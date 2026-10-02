/* Validador de lecciones para apps formativas de la familia Experto/PRO.
   Uso:  cd assets/web && node ../../scripts/validate_lessons.js
   Comprueba:
   - catálogo: ids únicos, acc aN válido, campos de área y lección completos
   - ids == nombre de archivo, area/areaIcon/icon/title == catálogo; audio de sección no vacío
   - sections/keypoints/flashcards/quiz completos; quiz.correct en rango
   - sin comillas tipográficas curvas; HTML solo con etiquetas permitidas
   Sale con código 0 solo si todo está limpio ("problemas=0"). */
const fs = require('fs');
const path = require('path');

const webDir = process.cwd();
const catPath = path.join(webDir, 'assets', 'catalog.js');
const lessonsDir = path.join(webDir, 'lessons');
if (!fs.existsSync(catPath) || !fs.existsSync(lessonsDir)) {
  console.error('Ejecuta desde assets/web de la app (deben existir assets/catalog.js y lessons/).');
  process.exit(1);
}

// Etiquetas de la guía (+ inline/encabezados seguros que el WebView renderiza nativamente)
const ALLOWED_TAGS = new Set(['p', 'b', 'ul', 'ol', 'li', 'table', 'tr', 'th', 'td', 'span',
  'i', 'em', 'strong', 'br', 'sub', 'sup', 'small', 'h3', 'h4']);
const CURLY = /[‘’“”]/;

let CATALOG;
eval(fs.readFileSync(catPath, 'utf8').replace('var CATALOG', 'CATALOG'));

// --- catálogo ---
let catProb = 0;
const map = {};        // id -> {area, areaIcon, icon, t}
const seen = new Set();
CATALOG.forEach((a, ai) => {
  if (!a.area || !a.icon || !a.desc) { console.log('CATALOGO area#' + ai + ': faltan area/icon/desc'); catProb++; }
  if (!/^a([1-9]|1[0-4])$/.test(a.acc || '')) { console.log('CATALOGO "' + a.area + '": acc invalido (' + a.acc + '), usar a1..a14'); catProb++; }
  (a.lessons || []).forEach(l => {
    if (!l.id || !l.t || !l.d || !l.icon) { console.log('CATALOGO "' + a.area + '": leccion incompleta (' + (l.id || '?') + ')'); catProb++; }
    if (seen.has(l.id)) { console.log('CATALOGO: id DUPLICADO "' + l.id + '"'); catProb++; }
    seen.add(l.id);
    map[l.id] = { area: a.area, areaIcon: a.icon, icon: l.icon, t: l.t };
  });
});
const catIds = Object.keys(map);

// --- archivos ---
const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.js'));
const fileIds = files.map(f => f.replace('.js', ''));
const faltantes = catIds.filter(id => !fileIds.includes(id));
const huerfanos = fileIds.filter(id => !catIds.includes(id));
faltantes.forEach(id => console.log('FALTA (en catalogo sin archivo): ' + id));
huerfanos.forEach(id => console.log('HUERFANO (archivo sin catalogo): ' + id));

function checkHtml(html, where, errs) {
  if (CURLY.test(html)) errs.push(where + ': comillas curvas');
  // Solo nombres que empiezan con letra: evita falsos positivos con "p<0.05", "Cp<1", etc.
  const tags = html.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g) || [];
  for (const t of tags) {
    const name = t.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/, '$1').toLowerCase();
    if (!ALLOWED_TAGS.has(name)) { errs.push(where + ': etiqueta no permitida <' + name + '>'); break; }
  }
}

global.Lesson = { start: s => { global.__s = s; } };
let ok = 0, prob = 0;
for (const f of files) {
  global.__s = null;
  const raw = fs.readFileSync(path.join(lessonsDir, f), 'utf8');
  try { eval(raw); }
  catch (e) { console.log('RUNTIME ' + f + ': ' + e.message); prob++; continue; }
  const s = global.__s, id = f.replace('.js', ''), e = [];
  if (!s) { console.log('NO Lesson.start: ' + f); prob++; continue; }
  if (s.id !== id) e.push('id!=archivo (' + s.id + ')');
  if (!s.title || !s.subtitle || !s.norma || !s.intro) e.push('faltan title/subtitle/norma/intro');
  if (map[id]) {
    if (s.area !== map[id].area) e.push('area!=catalogo ("' + s.area + '")');
    if (s.areaIcon !== map[id].areaIcon) e.push('areaIcon!=catalogo');
    if (s.icon !== map[id].icon) e.push('icon!=catalogo');
    if (s.title !== map[id].t) e.push('title!=catalogo ("' + s.title + '")');
  }
  if (CURLY.test(raw)) e.push('comillas tipograficas curvas en el archivo');
  if (!Array.isArray(s.sections) || s.sections.length < 3) e.push('sections<3');
  (s.sections || []).forEach((x, i) => {
    if (!x.h || !x.html) e.push('sec' + i + ' incompleta');
    else if (x.audio != null && (typeof x.audio !== 'string' || !x.audio.trim())) e.push('sec' + i + ' audio vacio');
    else checkHtml(x.html, 'sec' + i, e);
  });
  if (s.intro) checkHtml(s.intro, 'intro', e);
  if (!Array.isArray(s.keypoints) || s.keypoints.length < 3) e.push('keypoints<3');
  if (!Array.isArray(s.flashcards) || s.flashcards.length < 3) e.push('flashcards<3');
  (s.flashcards || []).forEach((c, i) => { if (!c.q || !c.a) e.push('flash' + i + ' incompleta'); });
  if (!Array.isArray(s.quiz) || s.quiz.length < 3) e.push('quiz<3');
  (s.quiz || []).forEach((q, i) => {
    if (!q.q) e.push('quiz' + i + ' sin pregunta');
    if (!Array.isArray(q.opts) || q.opts.length < 2) e.push('quiz' + i + ' opts<2');
    if (typeof q.correct !== 'number' || q.correct < 0 || (q.opts && q.correct >= q.opts.length)) e.push('quiz' + i + ' correct fuera de rango');
    if (!q.why) e.push('quiz' + i + ' sin why');
  });
  if (e.length) { console.log('WARN ' + f + ': ' + e.join('; ')); prob++; } else ok++;
}

console.log('\nIDs catalogo=' + catIds.length + '  archivos=' + files.length + '  areas=' + CATALOG.length);
console.log('==> OK=' + ok + '  problemas=' + (prob + catProb) +
            '  faltantes=' + faltantes.length + '  huerfanos=' + huerfanos.length);
process.exit((prob + catProb + faltantes.length + huerfanos.length) === 0 ? 0 : 1);
