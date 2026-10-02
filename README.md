# Libre Competencia PRO

App formativa Android (Flutter WebView + voz, **sin internet**) para preparar el **examen final** del curso de Derecho de la Libre Competencia (programa de postgrado, Cuyutupa Luque Abogados). Está pensada para **escucharla en el carro** camino al trabajo.

- **63 lecciones en 13 áreas y 4 módulos**: libre competencia (D.Leg. 1034), competencia desleal I (D.Leg. 1044), publicidad comercial y casos del INDECOPI, y derecho del consumo (Ley 29571), más un repaso final con examen integrador. Cada lección trae explicación, puntos clave, 5 fichas y un quiz (268 preguntas en total).
- **🚗 Modo carro**: pantalla grande, cinco botones, una lista de lecciones que avanza sola y recuerda dónde te quedaste. Formatos: completa, solo explicación, puntos clave, preguntas con pausa para pensar y examen oral. La lista corre en el shell Flutter, no en la página.
- **Herramientas**: simulacro de examen, repaso relámpago, artículos clave, banco de casos del INDECOPI y glosario, todas con audio.
- ~8,8 horas de audio en total con el formato «Completa».

## Instalar en el celular
Hay tres formas, todas desde **Releases → Libre Competencia PRO (APK y HTML)** (`apk-latest`):

| Forma | Archivo | Cuándo usarla |
|---|---|---|
| **App Android** (recomendada para el carro) | `libre-competencia.apk` | Ábrela y permite instalar desde orígenes desconocidos. Mantiene la pantalla encendida y la voz continua. |
| **HTML de un solo archivo** | `libre-competencia.html` | Sin instalar nada: ábrelo con Chrome en el celular o la PC; funciona sin internet y se comparte como un archivo. |
| **Web instalable (PWA)** | sitio de GitHub Pages | Abre la dirección en Chrome → menú ⋮ → **Instalar aplicación**; queda como app y funciona sin internet. Requiere activar una vez Settings → Pages → Source: *GitHub Actions*. |

Necesitas una voz en español (Ajustes → Texto a voz → «Servicios de voz de Google» → español). En el carro: conecta el Bluetooth, abre **Modo carro**, elige qué escuchar y toca ▶. En la app deja activada «Pantalla encendida» y excluye la app del ahorro de batería. En las versiones web el navegador suele detener la voz si apagas la pantalla: déjala encendida.

## Desarrollo
```
cd assets/web && node ../../scripts/validate_lessons.js    # problemas=0 faltantes=0 huerfanos=0
flutter pub get && flutter analyze && flutter test
scripts/build_apk.sh                                        # requiere Android SDK
node scripts/build_html.js                                  # dist/libre-competencia.html + dist/pwa/
```
Vista previa en el navegador (la voz usa speechSynthesis): `cd assets/web && python3 -m http.server 9056` y abrir http://localhost:9056/.

El workflow `Build APK` valida las lecciones, analiza, prueba, compila y publica el APK y el HTML en el release `apk-latest` en cada push. El workflow `Web instalable` publica la PWA en GitHub Pages desde la rama predeterminada.

Herramienta formativa; el contenido sigue el material del curso. **Verificar la norma vigente** y el estado procesal de cada caso antes de citarlos.
