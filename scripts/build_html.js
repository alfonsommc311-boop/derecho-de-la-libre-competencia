/* Genera las versiones HTML de Libre Competencia PRO a partir de assets/web (única fuente):
     dist/libre-competencia.html   un solo archivo autónomo (todo embebido, sin internet, se abre o comparte tal cual)
     dist/pwa/                     sitio instalable (manifest + service worker) para GitHub Pages o cualquier https
   Uso (desde la raíz del repo):  node scripts/build_html.js
   No modifica assets/web, así que el APK de Flutter no cambia. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'assets', 'web');
const DIST = path.join(ROOT, 'dist');
const PWA = path.join(DIST, 'pwa');
const ICONS = path.join(__dirname, 'pwa');
const BG = '#15191c';

function walk(dir, base = '') {
  let out = [];
  for (const n of fs.readdirSync(path.join(dir, base)).sort()) {
    const rel = base ? base + '/' + n : n;
    const st = fs.statSync(path.join(dir, rel));
    if (st.isDirectory()) out = out.concat(walk(dir, rel));
    else out.push(rel);
  }
  return out;
}

if (!fs.existsSync(path.join(WEB, 'index.html'))) { console.error('No encuentro assets/web/index.html'); process.exit(1); }
const files = walk(WEB).filter(f => /\.(html|js|css)$/.test(f));
const text = {};
files.forEach(f => { text[f] = fs.readFileSync(path.join(WEB, f), 'utf8'); });

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(PWA, { recursive: true });

/* ============================ 1) HTML único ============================ */
// El JSON se incrusta en un <script>: se escapa «</» para que ninguna lección cierre la etiqueta.
const data = JSON.stringify(text).replace(/<\//g, '<\\/').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const router = `
(function () {
  var BLOBS = {};
  function norm(u) { return String(u || '').replace(/^\\.\\//, '').split('#')[0].split('?')[0]; }
  function blobFor(k) {
    if (!BLOBS[k]) BLOBS[k] = URL.createObjectURL(new Blob([FILES[k]], { type: /\\.css$/.test(k) ? 'text/css' : 'text/javascript' }));
    return BLOBS[k];
  }
  // Las lecciones se cargan creando <script src="lessons/x.js">: se redirige a su copia embebida.
  var d = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
  Object.defineProperty(HTMLScriptElement.prototype, 'src', {
    configurable: true, enumerable: d.enumerable, get: d.get,
    set: function (v) { var k = norm(v); d.set.call(this, FILES[k] != null && /\\.js$/.test(k) ? blobFor(k) : v); }
  });

  function parse(hash) {
    var h = String(hash || '').replace(/^#\\/?/, '') || 'index.html', q = '', i = h.indexOf('?');
    if (i >= 0) { q = h.slice(i); h = h.slice(0, i); }
    h = norm(h);
    if (FILES[h] == null) h = 'index.html';
    return { page: h, search: q };
  }
  function render() {
    var r = parse(location.hash);
    window.__SEARCH = r.search;
    var html = FILES[r.page]
      .replace(/(src|href)="([^"]+)"/g, function (m, a, u) {
        var k = norm(u);
        return FILES[k] != null && /\\.(js|css)$/.test(k) ? a + '="' + blobFor(k) + '"' : m;
      })
      .replace(/location\\.search/g, '(window.__SEARCH||"")')
      .replace(/<head>/i, '<head><script>window.__nav.attach()<\\/script>');
    document.open(); document.write(html); document.close();
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function onClick(e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || e.defaultPrevented || e.button) return;
    var href = a.getAttribute('href');
    if (!href || href === '#' || /^[a-z][a-z0-9+.-]*:/i.test(href)) return;
    e.preventDefault();
    if (href.charAt(0) === '#') {                       // ancla interna de la misma página
      var t = document.getElementById(href.slice(1));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    var next = '#/' + href.replace(/^\\.\\//, '');
    if (location.hash === next) render(); else location.hash = next;
  }
  window.__nav = {
    render: render,
    attach: function () {            // document.open() borra los listeners: se vuelven a poner
      window.addEventListener('click', onClick, true);
      window.addEventListener('hashchange', render);
    }
  };
  // Se renderiza al terminar la carga: document.open() durante la lectura del archivo dejaría restos del cargador.
  if (document.readyState === 'complete') render(); else window.addEventListener('load', render);
})();
`;

const single = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Libre Competencia PRO</title><meta name="theme-color" content="${BG}">
<style>body{background:${BG};color:#eef0f2;font-family:system-ui,sans-serif;padding:24px}</style>
</head><body>Cargando Libre Competencia PRO…
<script>var FILES = ${data};</script>
<script>${router}</script>
</body></html>
`;
fs.writeFileSync(path.join(DIST, 'libre-competencia.html'), single);

/* ============================ 2) PWA instalable ============================ */
for (const f of walk(WEB)) {
  const dst = path.join(PWA, f);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(path.join(WEB, f), dst);
}
for (const n of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) {
  if (!fs.existsSync(path.join(ICONS, n))) { console.error('Falta scripts/pwa/' + n + ' (python3 scripts/make_pwa_icons.py)'); process.exit(1); }
  fs.copyFileSync(path.join(ICONS, n), path.join(PWA, n));
}
fs.writeFileSync(path.join(PWA, 'manifest.webmanifest'), JSON.stringify({
  name: 'Libre Competencia PRO', short_name: 'Libre Competencia',
  description: 'Examen final de libre competencia, competencia desleal, publicidad y consumo, con audio para escuchar en el carro.',
  lang: 'es', start_url: 'index.html', scope: './', display: 'standalone', orientation: 'portrait',
  background_color: BG, theme_color: BG, categories: ['education'],
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2));

const head = '<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="icon-192.png">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">';
const reg = `<script>if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});}</script>`;
for (const f of files.filter(x => /\.html$/.test(x))) {
  const p = path.join(PWA, f);
  let h = fs.readFileSync(p, 'utf8');
  h = h.replace('<link rel="icon" href="data:,">', '<link rel="icon" href="icon-192.png">\n' + head);
  h = h.replace('</body>', reg + '\n</body>');
  fs.writeFileSync(p, h);
}

const all = walk(PWA).filter(f => f !== 'sw.js');
const hash = crypto.createHash('sha1');
all.forEach(f => hash.update(f).update(fs.readFileSync(path.join(PWA, f))));
const ver = 'lcp-' + hash.digest('hex').slice(0, 10);
fs.writeFileSync(path.join(PWA, 'sw.js'), `/* Service worker de Libre Competencia PRO: guarda todo el curso para usarlo sin internet. */
var V = '${ver}';
var FILES = ${JSON.stringify(all)};
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('lcp-') === 0 && k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
`);

const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log('HTML único : dist/libre-competencia.html (' + kb(fs.statSync(path.join(DIST, 'libre-competencia.html')).size) + ', ' + files.length + ' archivos embebidos)');
console.log('PWA        : dist/pwa/ (' + (all.length + 1) + ' archivos, caché ' + ver + ')');
