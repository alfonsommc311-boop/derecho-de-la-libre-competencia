# Guía de redacción de lecciones — Libre Competencia PRO

App de estudio para el **examen final** de un curso de postgrado de Derecho Económico (Perú). El usuario la **escucha en el carro** camino al trabajo: cada lección se narra por voz (TTS en español). Escribe para el oído y para el examen.

Lee TAMBIÉN: `_brief/TEMAS.md` (hechos verificados, ÚNICA fuente de datos), `assets/web/assets/catalog.js` (tu área y tus títulos) y el texto del material si te lo indican.

## Formato exacto (un archivo `assets/web/lessons/<id>.js` por lección, UNA llamada `Lesson.start({...})`)
```
Lesson.start({
  id: '<id>', area: '<AREA EXACTA DEL CATÁLOGO>', areaIcon: '<ICONO DEL ÁREA EXACTO>', icon: '<icon de la lección del catálogo>',
  title: '<Título EXACTO del catálogo>', subtitle: '<frase que engancha>', norma: '<norma y artículo clave en una frase>',
  intro: '<HTML 3-5 frases: qué es y por qué cae en el examen>',
  sections: [ { h: '<Subtítulo>', html: '<HTML>', audio: '<opcional: versión hablada>' }, ... (4 a 6) ],
  keypoints: [ '<5-6 frases memorizables>' ],
  flashcards: [ { q:'...', a:'...' }, ... (5) ],
  quiz: [ { q:'...', opts:['..','..','..','..'], correct:<idx 0-based>, why:'...' }, ... (4; el examen integrador lleva 20) ]
});
```
`id`, `area`, `areaIcon`, `icon` y `title` deben coincidir con el catálogo. `norma` siempre lleno.

## Reglas de HTML/JS
- HTML permitido SOLO: `<p> <b> <ul><li> <ol><li> <table><tr><th><td> <span class="hl">`. Nada de script/style/clases inventadas.
- Cadenas JS con comilla simple; atributos HTML con comilla doble. Escapa apóstrofes como `\'`. SIN comillas tipográficas curvas (usa « » para citar). Sin markdown ni texto fuera del objeto. El archivo empieza con `Lesson.start({` y termina con `});`.
- Varía el índice de la respuesta correcta entre preguntas (no siempre la misma letra).

## Escribir para el oído (la app se escucha manejando)
- Frases cortas y claras, tono de profesor que explica en voz alta. Nada de «ver tabla», «abajo», «arriba», «como se ve en la imagen».
- Cada sección de 120 a 220 palabras. Lección completa: 4 a 7 minutos de audio.
- Si una sección tiene `<table>`, agrega `audio:` con la misma idea en prosa hablada (la tabla leída en voz alta se entiende mal). Sin tablas, no pongas `audio`.
- Puedes escribir «D.Leg. 1034», «art. 10», «Res. 1122-2007/TDC-INDECOPI», «S/ 539 millones»: la app los convierte al hablar. Evita barras «/» entre palabras (usa «o» / «y»), evita paréntesis largos y siglas raras sin explicar la primera vez.
- Usa ejemplos cotidianos peruanos (bodegas, pollerías, combis, mercados) cuando ayuden, sin inventar casos reales: si es un ejemplo inventado, dilo («imagina que…»).
- Al menos una sección por lección debe terminar con una frase tipo **«Para el examen: …»** que resuma lo que se pregunta.

## Rigor (innegociable)
- Español didáctico para un alumno de postgrado en Derecho. Explica SIEMPRE el porqué y la diferencia con el concepto vecino con el que se suele confundir.
- **Datos solo de `TEMAS.md`**. Artículos con número, números de resolución, montos, años y nombres de empresas: SOLO los que aparecen ahí. Lo marcado [COMPLEMENTO] se puede usar con la coletilla «verificar la norma vigente».
- Prohibido inventar: nombres de las farmacias, empresas de oxígeno, GLP, papel higiénico o farmacéuticas; montos de multas (salvo S/ 539 millones del caso 2025); UIT; plazos que no estén en TEMAS.md; resoluciones adicionales.
- Si el material dice algo, respétalo tal cual aunque conozcas matices: es lo que se evalúa. Puedes añadir matices solo si son de alta confianza y los marcas como complemento.
- Cierra el `norma` o una sección con «verificar la norma vigente» al menos una vez por lección.

## Cierre
Valida: `cd /home/user/derecho-de-la-libre-competencia/assets/web && node ../../scripts/validate_lessons.js 2>&1 | grep -E "<tus ids>|OK=|problemas"` (los FALTA de otras áreas se ignoran; corrige cualquier WARN/RUNTIME de tus archivos). Devuelve SOLO la lista de archivos creados y una línea por cualquier duda de contenido.
