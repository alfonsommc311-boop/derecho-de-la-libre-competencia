# Libre Competencia PRO

App formativa Android (Flutter WebView + voz, **sin internet**) para preparar el **examen final** del curso de Derecho de la Libre Competencia (programa de postgrado, Cuyutupa Luque Abogados). Está pensada para **escucharla en el carro** camino al trabajo.

- **63 lecciones en 13 áreas y 4 módulos**: libre competencia (D.Leg. 1034), competencia desleal I (D.Leg. 1044), publicidad comercial y casos del INDECOPI, y derecho del consumo (Ley 29571), más un repaso final con examen integrador. Cada lección trae explicación, puntos clave, 5 fichas y un quiz (268 preguntas en total).
- **🚗 Modo carro**: pantalla grande, cinco botones, una lista de lecciones que avanza sola y recuerda dónde te quedaste. Formatos: completa, solo explicación, puntos clave, preguntas con pausa para pensar y examen oral. La lista corre en el shell Flutter, no en la página.
- **Herramientas**: simulacro de examen, repaso relámpago, artículos clave, banco de casos del INDECOPI y glosario, todas con audio.
- ~8,8 horas de audio en total con el formato «Completa».

## Instalar en el celular
1. En el celular abre el repositorio en GitHub → **Releases** → **Libre Competencia PRO (APK)** y descarga `libre-competencia.apk`.
2. Ábrelo y permite instalar desde orígenes desconocidos.
3. Necesitas una voz en español (Ajustes → Texto a voz → «Servicios de voz de Google» → español).
4. En el carro: conecta el Bluetooth, abre **Modo carro**, elige qué escuchar y toca ▶. Deja activada «Pantalla encendida» y excluye la app del ahorro de batería para que el audio no se corte.

## Desarrollo
```
cd assets/web && node ../../scripts/validate_lessons.js    # problemas=0 faltantes=0 huerfanos=0
flutter pub get && flutter analyze && flutter test
scripts/build_apk.sh                                        # requiere Android SDK
```
Vista previa en el navegador (la voz usa speechSynthesis): `cd assets/web && python3 -m http.server 9056` y abrir http://localhost:9056/.

El workflow `Build APK` valida las lecciones, analiza, prueba, compila y publica el APK en el release `apk-latest` en cada push.

Herramienta formativa; el contenido sigue el material del curso. **Verificar la norma vigente** y el estado procesal de cada caso antes de citarlos.
