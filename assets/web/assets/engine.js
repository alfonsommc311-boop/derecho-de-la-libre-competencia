/* ============================================================
   Libre Competencia PRO — motor de aprendizaje
   Store   = progreso local (prefijo lcp:)
   hablar  = convierte abreviaturas jurídicas en texto que la voz pronuncia bien
   Speak   = voz: listas de lectura que corren en el shell Flutter (siguen con la
             pantalla apagada) con respaldo de speechSynthesis en el navegador
   partesLeccion = guion hablado de una lección (lo usan la lección y el modo carro)
   Lesson  = framework de lecciones (secciones, puntos clave, fichas, quiz)
   ============================================================ */

var Store = {
  get: function (k, def) {
    try { var v = localStorage.getItem('lcp:' + k); return v == null ? def : JSON.parse(v); }
    catch (e) { return def; }
  },
  set: function (k, v) {
    try { localStorage.setItem('lcp:' + k, JSON.stringify(v)); } catch (e) {}
  }
};

/* ---------------- Texto para el oído ---------------- */
var ROMANOS = { I: 'primero', II: 'segundo', III: 'tercero', IV: 'cuarto', V: 'quinto' };
function hablar(t) {
  return String(t || '')
    .replace(/[«»“”"]/g, '')
    .replace(/D\.\s?Leg\.?(?=\s|$)/g, 'Decreto Legislativo')
    .replace(/\bD\.\s?S\.(?=\s)/g, 'Decreto Supremo')
    .replace(/\bN\.?\s?[°º](?=\s?\d)/g, 'número')
    .replace(/(\d{1,4})-(\d{4})\/([A-Za-z]+(?:-[A-Za-z]+)*)/g, function (m, n, y, org) {
      return n + ' del ' + y + ', ' + org.replace(/-/g, ' ');
    })
    .replace(/\bRes\.(?=\s)/g, 'Resolución')
    .replace(/\b[Aa]rts\.(?=\s)/g, 'artículos')
    .replace(/\b[Aa]rt\.(?=\s)/g, 'artículo')
    .replace(/\bnum\.(?=\s)/g, 'numeral')
    .replace(/\b(artículo|artículos|Título)\s(I|II|III|IV|V)\b/g, function (m, w, r) { return w + ' ' + ROMANOS[r]; })
    .replace(/S\/\s?([\d.,']+)(\s?millones)?/g, function (m, n, mill) { return n + (mill ? ' millones de soles' : ' soles'); })
    .replace(/\bINDECOPI\b|\bIndecopi\b/g, 'Indecopi')
    .replace(/\bMYPE(s?)\b/g, 'mype$1')
    .replace(/\bS\.A\.C\./g, 'S A C').replace(/\bS\.A\./g, 'S A')
    .replace(/\bvs\.(?=\s)/g, 'versus')
    .replace(/\bej\.(?=\s)/g, 'por ejemplo').replace(/\betc\./g, 'etcétera')
    .replace(/\(?\ba\s?[–-]\s?k\b\)?/g, 'de la a a la k')
    .replace(/(\d)\s?[–-]\s?(\d)/g, '$1 a $2')
    .replace(/\s?→\s?/g, ', luego, ')
    .replace(/\s\/\s/g, ' o ')
    .replace(/([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\/([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/g, '$1 o $2')
    .replace(/#/g, 'hashtag ')
    .replace(/[•·]/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Conversión de HTML a texto narrable */
function toSpeech(html) {
  var d = document.createElement('div');
  d.innerHTML = String(html || '').replace(/<li>/g, '<li>• ').replace(/<\/(p|li|tr|h3|h4)>/g, '</$1>. ').replace(/<\/t[dh]>/g, '</td>, ');
  var t = d.textContent || d.innerText || '';
  return t.replace(/\s+/g, ' ').replace(/\s*•\s*/g, '. ').replace(/(\.\s*){2,}/g, '. ').replace(/,\s*\./g, '.').trim();
}
function sinPunto(s) { return String(s || '').replace(/[\s.]+$/, ''); }

/* ---------------- Voz ----------------
   Speak.list(items, opts)  items = [{text, pause}] ; opts = {start, btn, label, onAt(i), onEnd(), onStop()}
   Speak.say(texto, btn)    lee un texto suelto (el mismo botón alterna detener)
   Speak.playQueue(items, onHighlight, btn) lee [{text, el}] resaltando el actual
   Speak.setRate(r)         0.2 (lento) … 1.0 (rápido); 0.5 normal
   Speak.setLang('es-US' | 'es-ES') voz latina o de España
   Speak.awake(true/false)  mantener la pantalla encendida (modo carro) */
var Speak = {
  rate: 0.5, lang: 'es-US', playing: false, btn: null, label: '',
  id: 0, items: [], idx: -1, onAt: null, onEnd: null, onStop: null,

  native: function () { return !!(window.flutter_inappwebview && window.flutter_inappwebview.callHandler); },
  _send: function (o) { try { window.flutter_inappwebview.callHandler('tts', o); } catch (e) {} },

  setRate: function (r) {
    this.rate = Math.max(0.2, Math.min(1.0, r));
    Store.set('rate', this.rate);
    if (this.native()) this._send({ cmd: 'rate', rate: this.rate });
  },
  setLang: function (l) {
    this.lang = l === 'es-ES' ? 'es-ES' : 'es-US';
    Store.set('lang', this.lang);
    if (this.native()) this._send({ cmd: 'lang', lang: this.lang });
  },
  awake: function (on) { if (this.native()) this._send({ cmd: 'awake', on: !!on }); },

  list: function (items, opts) {
    opts = opts || {};
    this.stop();
    var id = ++this.id;
    this.items = (items || []).map(function (x) {
      return typeof x === 'string' ? { t: hablar(x), p: 0 } : { t: hablar(x.text || x.t || ''), p: x.pause || x.p || 0 };
    });
    this.playing = true; this.idx = -1;
    this.btn = opts.btn || null; this.label = this.btn ? (this.btn.dataset.lbl || this.btn.innerHTML) : '';
    this.onAt = opts.onAt || null; this.onEnd = opts.onEnd || null; this.onStop = opts.onStop || null;
    if (this.btn) this.btn.innerHTML = opts.label || '⏸ Detener';
    var start = opts.start || 0;
    if (this.native()) this._send({ cmd: 'list', id: id, start: start, rate: this.rate, items: this.items });
    else this._web(id, start);
  },

  say: function (text, btn) {
    if (this.playing && btn && this.btn === btn) { this.stop(); return; }
    this.list([text], { btn: btn });
  },

  playQueue: function (items, onHighlight, btn) {
    if (this.playing && btn && this.btn === btn) { this.stop(); return; }
    this.list(items, {
      btn: btn, label: '⏸ Detener lección',
      onAt: function (i) { if (onHighlight) onHighlight(i, items[i]); },
      onEnd: function () { if (onHighlight) onHighlight(-1, null); },
      onStop: function () { if (onHighlight) onHighlight(-1, null); }
    });
  },

  _reset: function () {
    this.playing = false;
    if (this.btn) this.btn.innerHTML = this.label || '🔊';
    this.btn = null;
  },

  stop: function () {
    var was = this.playing, cb = this.onStop;
    this.id++;
    this._reset();
    this.onAt = this.onEnd = this.onStop = null;
    if (this.native()) this._send({ cmd: 'stop' });
    else if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (was && cb) cb();
  },

  _at: function (id, i) {
    if (id !== this.id) return;
    this.idx = i;
    if (this.onAt) this.onAt(i);
  },
  _end: function (id) {
    if (id !== this.id) return;
    var cb = this.onEnd;
    this._reset();
    this.onAt = this.onEnd = this.onStop = null;
    if (cb) cb();
  },

  // Respaldo del navegador (vista previa en PC): misma lógica de lista con pausas.
  _web: function (id, i) {
    var self = this;
    if (id !== this.id) return;
    if (!window.speechSynthesis || i >= this.items.length) { setTimeout(function () { self._end(id); }, 0); return; }
    this._at(id, i);
    var it = this.items[i];
    var u = new SpeechSynthesisUtterance(it.t);
    u.lang = this.lang; u.rate = 0.6 + this.rate * 0.9;
    var next = function () { if (id === self.id) setTimeout(function () { self._web(id, i + 1); }, it.p || 0); };
    u.onend = next; u.onerror = next;
    window.speechSynthesis.speak(u);
  }
};
function aviso(msg) {
  try {
    var d = document.createElement('div');
    d.setAttribute('style', 'position:fixed;left:12px;right:12px;bottom:16px;z-index:99;background:#3a1d1d;color:#ffd9d9;border:1px solid #ff6b6b;border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.5');
    d.textContent = msg;
    d.onclick = function () { d.remove(); };
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 12000);
  } catch (e) {}
}
if (typeof window !== 'undefined') {
  window.__ttsFail = function () {
    Speak.stop();
    aviso('🔇 El celular no encontró una voz en español. Ve a Ajustes → Administración general → Idioma → Texto a voz, instala «Voz de Google» o «Servicios de voz de Google» y descarga el español. Luego vuelve a tocar ▶.');
  };
  window.__ttsAt = function (id, i) { Speak._at(id, i); };
  window.__ttsEnd = function (id) { Speak._end(id); };
  Speak.rate = Store.get('rate', 0.5);
  Speak.lang = Store.get('lang', 'es-US');
  if (Speak.native()) {
    Speak._send({ cmd: 'rate', rate: Speak.rate });
    Speak._send({ cmd: 'lang', lang: Speak.lang });
  }
  window.addEventListener('flutterInAppWebViewPlatformReady', function () {
    Speak._send({ cmd: 'rate', rate: Speak.rate });
    Speak._send({ cmd: 'lang', lang: Speak.lang });
  });
}

/* ---------------- Guion hablado de una lección ----------------
   cfg = {encabezado, preguntas, pausa(ms), soloClaves}
   Devuelve [{text, pause, k:'head'|'intro'|'sec'|'kp'|'fq'|'fa'|'cierre', i}] */
function partesLeccion(spec, cfg) {
  cfg = cfg || {};
  var out = [];
  if (cfg.encabezado) out.push({ text: (cfg.prefijo || '') + 'Lección: ' + sinPunto(spec.title) + '. ' + (spec.subtitle || ''), k: 'head', pause: 400 });
  if (cfg.soloClaves) {
    (spec.keypoints || []).forEach(function (p, i) { out.push({ text: 'Clave ' + (i + 1) + '. ' + toSpeech(p), k: 'kp', i: i, pause: 700 }); });
    return out;
  }
  if (spec.intro) out.push({ text: toSpeech(spec.intro), k: 'intro' });
  (spec.sections || []).forEach(function (s, i) {
    out.push({ text: sinPunto(s.h) + '. ' + (s.audio || toSpeech(s.html)), k: 'sec', i: i, pause: 300 });
  });
  if (spec.keypoints && spec.keypoints.length) {
    out.push({ text: 'Puntos clave para recordar. ' + spec.keypoints.map(function (p) { return sinPunto(toSpeech(p)); }).join('. ') + '.', k: 'kp', pause: 500 });
  }
  if (cfg.preguntas && spec.flashcards && spec.flashcards.length) {
    out.push({ text: 'Preguntas de repaso. Intenta responder en voz alta antes de escuchar la respuesta.', k: 'fq0', pause: 400 });
    spec.flashcards.forEach(function (c, i) {
      out.push({ text: 'Pregunta ' + (i + 1) + '. ' + toSpeech(c.q), k: 'fq', i: i, pause: cfg.pausa || 4000 });
      out.push({ text: 'Respuesta. ' + toSpeech(c.a), k: 'fa', i: i, pause: 700 });
    });
  }
  return out;
}

/* ============================================================
   Framework de Lección
   ============================================================ */
var Lesson = (function () {
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function audioBtn(lbl) {
    var b = el('button', 'mini-audio', lbl || '🔊'); b.type = 'button'; b.dataset.lbl = lbl || '🔊'; b.title = 'Escuchar';
    return b;
  }

  function start(spec) {
    document.title = (spec.title || 'Lección') + ' · Libre Competencia PRO';
    var ttEl = document.getElementById('tt');
    if (ttEl) ttEl.textContent = spec.title || '';
    var root = document.getElementById('lesson');
    root.innerHTML = '';

    if (spec.area) root.appendChild(el('div', 'area-badge', (spec.areaIcon ? spec.areaIcon + ' ' : '') + spec.area));
    root.appendChild(el('h1', 'lesson-title', (spec.icon ? spec.icon + ' ' : '') + spec.title));
    if (spec.subtitle) root.appendChild(el('div', 'lesson-sub', spec.subtitle));
    if (spec.norma) root.appendChild(el('div', 'norma-tag', '📜 ' + spec.norma));

    // Barra de audio: lección completa (con preguntas de repaso) + velocidad + modo carro
    var bar = el('div', 'audiobar');
    var playAll = el('button', 'btn primary', '▶ Escuchar lección completa');
    playAll.type = 'button'; playAll.dataset.lbl = '▶ Escuchar lección completa';
    var speed = el('div', 'speed');
    speed.innerHTML = '<span>🐢</span>';
    var slider = el('input');
    slider.type = 'range'; slider.min = '0.2'; slider.max = '1.0'; slider.step = '0.05';
    slider.value = Speak.rate;
    slider.oninput = function () { Speak.setRate(parseFloat(slider.value)); };
    speed.appendChild(slider);
    speed.appendChild(el('span', null, '🐇'));
    bar.appendChild(playAll);
    bar.appendChild(speed);
    if (spec.id) {
      var car = el('a', 'btn ghost sm', '🚗 Modo carro');
      car.href = 'carro.html?desde=' + spec.id;
      bar.appendChild(car);
    }
    root.appendChild(bar);

    var targets = { intro: null, sec: [], kp: null, fc: [] };

    if (spec.intro) {
      targets.intro = el('div', 'intro', spec.intro);
      root.appendChild(targets.intro);
    }

    (spec.sections || []).forEach(function (s) {
      var sec = el('div', 'sec');
      var head = el('div', 'sec-head');
      head.appendChild(el('h2', null, s.h));
      var sb = audioBtn();
      var narration = sinPunto(s.h) + '. ' + (s.audio || toSpeech(s.html));
      sb.onclick = function () { Speak.say(narration, sb); };
      head.appendChild(sb);
      sec.appendChild(head);
      sec.appendChild(el('div', 'sec-body', s.html));
      root.appendChild(sec);
      targets.sec.push(sec);
    });

    if (spec.keypoints && spec.keypoints.length) {
      var kp = el('div', 'keypoints');
      var kph = el('div', 'kp-head');
      kph.innerHTML = '<span>🎯 Puntos clave para recordar</span>';
      var kpb = audioBtn();
      var kpText = 'Puntos clave. ' + spec.keypoints.map(function (p) { return sinPunto(toSpeech(p)); }).join('. ') + '.';
      kpb.onclick = function () { Speak.say(kpText, kpb); };
      kph.appendChild(kpb);
      kp.appendChild(kph);
      var ul = el('ul');
      spec.keypoints.forEach(function (p) { ul.appendChild(el('li', null, p)); });
      kp.appendChild(ul);
      root.appendChild(kp);
      targets.kp = kp;
    }

    if (spec.flashcards && spec.flashcards.length) {
      root.appendChild(el('div', 'block-title', '🃏 Fichas de repaso'));
      var fcWrap = el('div', 'flashwrap');
      spec.flashcards.forEach(function (c) {
        var card = el('div', 'flash');
        card.innerHTML = '<div class="flash-inner"><div class="flash-face flash-q">' +
          '<span class="flash-tag">PREGUNTA</span><div>' + c.q + '</div><span class="flash-hint">toca para ver la respuesta</span></div>' +
          '<div class="flash-face flash-a"><span class="flash-tag">RESPUESTA</span><div>' + c.a + '</div></div></div>';
        card.onclick = function (e) {
          if (e.target.closest('.flash-audio')) return;
          card.classList.toggle('flip');
        };
        var fab = el('button', 'flash-audio', '🔊'); fab.type = 'button'; fab.dataset.lbl = '🔊';
        fab.onclick = function (ev) { ev.stopPropagation(); Speak.say(toSpeech(c.q) + ' Respuesta: ' + toSpeech(c.a), fab); };
        card.appendChild(fab);
        fcWrap.appendChild(card);
        targets.fc.push(card);
      });
      root.appendChild(fcWrap);
    }

    if (spec.quiz && spec.quiz.length) {
      root.appendChild(el('div', 'block-title', '✅ Autoevaluación'));
      var quizBox = el('div', 'quiz');
      var state = { correct: 0 };
      var scoreEl = el('div', 'quiz-score', '');
      var LET = 'ABCDE';
      spec.quiz.forEach(function (q, qi) {
        var qb = el('div', 'qitem');
        var qhead = el('div', 'q-head');
        qhead.appendChild(el('div', 'q-text', (qi + 1) + '. ' + q.q));
        var qa = audioBtn();
        qa.onclick = function () {
          Speak.say(toSpeech(q.q) + ' Opciones: ' + q.opts.map(function (o, k) { return 'Opción ' + LET.charAt(k) + ', ' + toSpeech(o); }).join('. '), qa);
        };
        qhead.appendChild(qa);
        qb.appendChild(qhead);
        var opts = el('div', 'opts');
        var locked = false;
        q.opts.forEach(function (opt, oi) {
          var b = el('button', 'opt', LET.charAt(oi) + '. ' + opt); b.type = 'button';
          b.onclick = function () {
            if (locked) return;
            locked = true;
            var ok = (oi === q.correct);
            if (ok) { state.correct++; b.classList.add('ok'); }
            else {
              b.classList.add('bad');
              var btns = opts.querySelectorAll('.opt');
              if (btns[q.correct]) btns[q.correct].classList.add('ok');
            }
            qb.appendChild(el('div', 'why ' + (ok ? 'why-ok' : 'why-bad'), (ok ? '✔ Correcto. ' : '✘ Incorrecto. ') + (q.why || '')));
            scoreEl.textContent = '📊 Puntaje: ' + state.correct + ' / ' + spec.quiz.length;
            var res = Store.get('quiz', {});
            res[spec.id] = res[spec.id] || {};
            res[spec.id][qi] = ok;
            Store.set('quiz', res);
          };
          opts.appendChild(b);
        });
        qb.appendChild(opts);
        quizBox.appendChild(qb);
      });
      quizBox.appendChild(scoreEl);
      root.appendChild(quizBox);
    }

    // Lectura completa: intro, secciones, puntos clave y preguntas de repaso (resalta y voltea las fichas)
    var parts = partesLeccion(spec, { preguntas: true, pausa: Store.get('pausa', 4000) });
    function targetOf(p) {
      if (!p) return null;
      if (p.k === 'intro') return targets.intro;
      if (p.k === 'sec') return targets.sec[p.i];
      if (p.k === 'kp') return targets.kp;
      if (p.k === 'fq' || p.k === 'fa') return targets.fc[p.i];
      return null;
    }
    function highlight(idx) {
      var all = [targets.intro, targets.kp].concat(targets.sec, targets.fc);
      var cur = idx >= 0 ? targetOf(parts[idx]) : null;
      all.forEach(function (e) { if (e) e.classList.toggle('speaking', e === cur); });
      if (idx >= 0 && parts[idx]) {
        if (parts[idx].k === 'fq' && cur) cur.classList.remove('flip');
        if (parts[idx].k === 'fa' && cur) cur.classList.add('flip');
      }
      if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    playAll.onclick = function () { Speak.playQueue(parts, highlight, playAll); };

    // Navegación entre lecciones
    if (typeof CATALOG !== 'undefined' && spec.id) {
      var flat = [];
      CATALOG.forEach(function (a) { a.lessons.forEach(function (l) { flat.push(l); }); });
      var idx = -1;
      flat.forEach(function (l, k) { if (l.id === spec.id) idx = k; });
      var nav = el('div', 'lesson-nav');
      if (idx > 0) {
        var prev = el('a', 'nav-btn prev', '← ' + flat[idx - 1].t);
        prev.href = 'lesson.html?l=' + flat[idx - 1].id;
        nav.appendChild(prev);
      } else { nav.appendChild(el('span')); }
      if (idx >= 0 && idx < flat.length - 1) {
        var next = el('a', 'nav-btn next', flat[idx + 1].t + ' →');
        next.href = 'lesson.html?l=' + flat[idx + 1].id;
        nav.appendChild(next);
      }
      root.appendChild(nav);
    }

    if (spec.id) {
      var done = Store.get('read', {});
      done[spec.id] = true;
      Store.set('read', done);
      Store.set('last', spec.id);
    }
  }

  return { start: start };
})();
