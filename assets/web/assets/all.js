/* Carga todas las lecciones como datos (sin dibujarlas) en el orden del catálogo.
   loadAll(cb, filtro?) → cb([spec...]) ; cada spec recibe _area, _mod y _n (posición global). */
function loadAll(cb, filtro) {
  var ALL = [], flat = [];
  CATALOG.forEach(function (a) {
    a.lessons.forEach(function (l) { if (!filtro || filtro(a, l)) flat.push({ id: l.id, a: a }); });
  });
  var got = {};
  window.Lesson = { start: function (s) { got[s.id] = s; } };
  var i = 0;
  (function nx() {
    if (i >= flat.length) {
      flat.forEach(function (f, n) {
        var s = got[f.id];
        if (s) { s._area = f.a.area; s._areaIcon = f.a.icon; s._mod = f.a.mod; s._n = n; ALL.push(s); }
      });
      window.ALL = ALL;
      return cb(ALL);
    }
    var s = document.createElement('script'); s.src = 'lessons/' + flat[i++].id + '.js';
    s.onload = s.onerror = nx; document.body.appendChild(s);
  })();
}
function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function modDe(mod) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].mod === mod) return MODULES[i]; return null; }
