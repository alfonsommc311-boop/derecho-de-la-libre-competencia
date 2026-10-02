# CLAUDE.md – Libre Competencia PRO (reglas del proyecto)

App formativa Android de la familia «Experto/PRO» (Flutter WebView + TTS, sin internet) para el examen final de Libre Competencia, Competencia Desleal, Publicidad y Consumo, pensada para **escucharse en el carro**. Lee `PLAN.md`, `_brief/TEMAS.md` y `_brief/GUIA-REDACCION.md` antes de tocar nada.

## Identidad
- Nombre: **Libre Competencia PRO** · `com.alfonso.librecompetenciapro` · prefijo de storage `lcp` · puerto **9056** (9053 OxI, 9054 JPRD/Examen PJ, 9055 Resolución de Contrato).
- Colores: carbón `#15191c` con dorado `#d4af6a` (`assets/web/assets/styles.css`). Ícono: balanza con ondas de audio (`scripts/make_icon.py --glyph balanza --top "#34404a" --bot "#101417" --accent "#d4af6a"`, luego `python3 scripts/make_android_res.py`).

## Estructura
- `assets/web/index.html` home · `lesson.html` + `assets/engine.js` motor · `assets/catalog.js` (MODULES y CATALOG: 13 áreas, 63 lecciones) · `lessons/*.js` una lección por archivo (`Lesson.start({...})`).
- `carro.html` modo carro (lista de reproducción) · `simulacro.html` · `fichas.html` · `articulos.html` · `casos.html` · `glosario.html`; datos de referencia en `assets/ref.js`; `assets/all.js` carga todas las lecciones como datos.
- `lib/main.dart`: shell Flutter. **La lista de lectura (`list`) corre en Dart**, no en la página; la página solo recibe `__ttsAt(id, i)` y `__ttsEnd(id)`. Canal `lcp/pantalla` (MainActivity.kt) mantiene la pantalla encendida.
- **Versión HTML**: `node scripts/build_html.js` genera `dist/libre-competencia.html` (un solo archivo; enrutador por hash que reescribe `src`/`href` a blobs y `location.search`) y `dist/pwa/` (manifest + `sw.js` con precarga). No modifica `assets/web`. Íconos PWA en `scripts/pwa/` (`python3 scripts/make_pwa_icons.py`). `dist/` está en `.gitignore`. Si añades una página a `assets/web`, no uses `let/const` globales ni `location.search` fuera de los dos usos actuales sin probar el HTML único.
- En navegador `Speak` usa `speechSynthesis` por trozos de 500 caracteres y Wake Lock (solo https/localhost); en el APK la lista corre en Dart.
- `engine.js`: `hablar()` convierte abreviaturas («D.Leg.», «art.», «Res.», «S/») en texto pronunciable; `partesLeccion()` arma el guion hablado que usan la lección y el carro.

## Reglas de contenido
- La fuente única es el PDF del curso, resumido en `_brief/TEMAS.md`. Artículos, resoluciones y montos solo los de ese archivo; lo marcado [COMPLEMENTO] va con «verificar la norma vigente». No nombrar farmacias ni empresas de oxígeno, GLP, papel higiénico o farmacéuticas, ni inventar multas.
- El material tiene dos rarezas que se respetan y se avisan: el riesgo de asociación aparece en el art. 10 (parasitismo) y en el art. 9 (caso Actibio); el «art. 15.2» del daño lícito no se cita con número.
- HTML en lecciones: `p, b, ul/ol/li, table/tr/th/td, span.hl`. Ids ASCII kebab-case. Secciones con tabla llevan `audio:` hablado.
- Herramienta formativa, no reemplaza asesoría legal.

## Validación
`cd assets/web && node ../../scripts/validate_lessons.js` → `problemas=0 faltantes=0 huerfanos=0`. `flutter pub get && flutter analyze && flutter test`. Probar el HTML: `node scripts/build_html.js` y abrir `dist/libre-competencia.html` (también por `file://`). Vista previa: `cd assets/web && python3 -m http.server 9056`.

## Compilación
`scripts/build_apk.sh` (requiere Android SDK). En GitHub, el workflow `Build APK` compila y publica el APK y el HTML en el release `apk-latest`; `pages.yml` publica la PWA en Pages (solo rama predeterminada; requiere activar Pages con fuente GitHub Actions).
