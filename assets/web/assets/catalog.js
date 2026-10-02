/* Catálogo de Libre Competencia PRO: 13 áreas agrupadas en 5 módulos (mod) del examen final.
   mod 1 = Libre competencia (D.Leg. 1034) · 2 = Competencia desleal I · 3 = Publicidad (desleal II)
   mod 4 = Consumo (Ley 29571) · 5 = Repaso final */
var MODULES = [
  { mod: 1, icon: '⚖️', t: 'Libre competencia', d: 'D.Leg. 1034: mercado, dominio, abuso, colusión, verticales y Ley 31112' },
  { mod: 2, icon: '🛡️', t: 'Competencia desleal I', d: 'D.Leg. 1044: bien jurídico, filtros, cláusula general y actos desleales' },
  { mod: 3, icon: '📣', t: 'Competencia desleal II', d: 'Publicidad comercial: principios, responsables, procedimiento y casos' },
  { mod: 4, icon: '🛒', t: 'Derecho del consumo', d: 'Ley 29571: sujetos, relación de consumo, derechos y reclamos' },
  { mod: 5, icon: '🎓', t: 'Repaso final', d: 'Cuadros, artículos, casos, confusiones y examen integrador' }
];

var CATALOG = [
  { area: 'Fundamentos de la libre competencia', icon: '🏛️', acc: 'a1', mod: 1,
    desc: 'Qué protege la ley, por qué beneficia al consumidor, su base constitucional y quién la aplica.',
    lessons: [
      { id: 'que-protege-la-libre-competencia', icon: '🎯', t: '¿Qué protege la libre competencia?', d: 'El proceso competitivo, no al competidor: ganar por ser mejor es lícito, ganar con trampa no.' },
      { id: 'por-que-beneficia-al-consumidor', icon: '🛍️', t: 'Por qué beneficia al consumidor', d: 'Con y sin competencia real: precios, calidad, innovación, variedad y el ejemplo de las cinco pollerías.' },
      { id: 'constitucion-y-libre-competencia', icon: '📜', t: 'Constitución y economía social de mercado', d: 'Los artículos 58, 60, 61 y 65 y cómo se conectan con las cuatro leyes del curso.' },
      { id: 'el-indecopi-y-sus-organos', icon: '🏢', t: 'El INDECOPI y sus órganos', d: 'Secretaría Técnica, CLC, CCD, Sala de Defensa de la Competencia y Sala de Protección al Consumidor.' }
    ] },
  { area: 'Economía básica y poder de mercado', icon: '📊', acc: 'a2', mod: 1,
    desc: 'Las herramientas económicas que la autoridad usa antes de calificar una conducta.',
    lessons: [
      { id: 'el-mercado-relevante', icon: '🗺️', t: 'El mercado relevante', d: 'Producto y geográfico: sustitutos si sube el precio y zona donde de verdad se compite.' },
      { id: 'elasticidad-de-la-demanda', icon: '📉', t: 'La elasticidad de la demanda', d: 'Cuánto cambia lo que se compra cuando cambia el precio; por qué medicamentos y oxígeno duelen más.' },
      { id: 'poder-de-mercado', icon: '💪', t: 'Poder de mercado: ¿ser dominante es ilegal?', d: 'Subir precios o excluir sin perder clientes. La ley no sanciona ser grande (art. 7).' },
      { id: 'la-posicion-de-dominio', icon: '👑', t: 'La posición de dominio', d: 'Actuar con independencia significativa de competidores, clientes y consumidores.' }
    ] },
  { area: 'Abuso de posición de dominio', icon: '🚫', acc: 'a3', mod: 1,
    desc: 'Cuándo el dominante cruza la línea: las formas de abuso del art. 10 y el caso FETRANS.',
    lessons: [
      { id: 'que-es-el-abuso-de-posicion-de-dominio', icon: '⚠️', t: 'Qué es el abuso de posición de dominio', d: 'Usar el poder para impedir que otros compitan: el art. 10 y sus seis formas.' },
      { id: 'negativa-injustificada-de-trato', icon: '🚪', t: 'Negativa injustificada de trato', d: 'Cerrar sin razón objetiva la puerta que el rival necesita para competir.' },
      { id: 'discriminacion-y-ventas-atadas', icon: '🔗', t: 'Discriminación exclusoria y ventas atadas', d: 'Condiciones desiguales para excluir y obligar a comprar lo que no se pidió.' },
      { id: 'precios-predatorios-y-barreras-de-acceso', icon: '🦈', t: 'Precios predatorios y barreras de acceso', d: 'Vender bajo para eliminar, obstáculos injustificados e infraestructura esencial.' },
      { id: 'caso-fetrans', icon: '🚆', t: 'Caso FETRANS: la vía a Machu Picchu', d: 'Res. 064-2006/CLC infundada; Res. 1122-2007/TDC revoca y sanciona la negativa de trato.' }
    ] },
  { area: 'Prácticas colusorias horizontales', icon: '🤝', acc: 'a4', mod: 1,
    desc: 'Cárteles: competidores que se vuelven socios secretos contra el consumidor y contra el Estado.',
    lessons: [
      { id: 'que-es-la-colusion-horizontal', icon: '🕵️', t: 'Qué es la colusión horizontal', d: 'Acuerdos entre competidores para no competir: precios, repartos y licitaciones (art. 11).' },
      { id: 'caso-farmacias', icon: '💊', t: 'Caso farmacias: concertación de precios', d: 'Cinco cadenas sancionadas por concertar precios de medicamentos (2016-2017).' },
      { id: 'colusion-en-compras-publicas', icon: '🏥', t: 'Colusión en compras públicas', d: 'Oxígeno medicinal por zonas y S/ 539 millones a 13 farmacéuticas: el Estado también es víctima.' },
      { id: 'carteles-de-consumo-masivo', icon: '🧻', t: 'Cárteles de consumo masivo', d: 'Papel higiénico, GLP y otros: un pequeño sobreprecio por millones de unidades.' }
    ] },
  { area: 'Prácticas verticales y estándares de análisis', icon: '🔍', acc: 'a5', mod: 1,
    desc: 'Regla per se y regla de la razón, prohibición absoluta y relativa, y acuerdos en la cadena.',
    lessons: [
      { id: 'regla-per-se-y-regla-de-la-razon', icon: '⚖️', t: 'Regla per se vs. regla de la razón', d: 'Ilícito por su sola naturaleza o ilícito si produce efectos y no tiene eficiencias.' },
      { id: 'prohibicion-absoluta-y-relativa', icon: '🧷', t: 'Prohibición absoluta y prohibición relativa', d: 'Qué debe probar la autoridad en cada caso y cómo se relaciona con per se y razón.' },
      { id: 'practicas-verticales', icon: '🏭', t: 'Prácticas verticales: lícito y problemático', d: 'Estándares de presentación y servicio técnico vs. precios mínimos de reventa y exclusividad.' }
    ] },
  { area: 'Conductas, estructuras y síntesis', icon: '🏗️', acc: 'a6', mod: 1,
    desc: 'Sancionar después o prevenir antes: la Ley 31112 y las tres ideas del módulo.',
    lessons: [
      { id: 'control-de-conductas-vs-estructuras', icon: '🔀', t: 'Control de conductas vs. control de estructuras', d: 'Sancionar una infracción concreta o evaluar si una operación reduce la competencia futura.' },
      { id: 'ley-31112-control-previo', icon: '🏦', t: 'Ley 31112: control previo de concentraciones', d: 'Desde 2021, control previo obligatorio: más de 100 operaciones evaluadas por el INDECOPI.' },
      { id: 'tres-ideas-de-libre-competencia', icon: '💡', t: 'Las tres ideas de libre competencia', d: 'El proceso y no el rival, el tamaño no es el problema, economía más derecho.' }
    ] },
  { area: 'Competencia desleal: bien jurídico y filtros', icon: '🛡️', acc: 'a7', mod: 2,
    desc: 'D.Leg. 1044: qué protege, la paradoja del daño lícito y los filtros objetivo, subjetivo y territorial.',
    lessons: [
      { id: 'bien-juridico-protegido', icon: '🏛️', t: 'El bien jurídico: del modelo profesional al social', d: 'De proteger al empresario rival a proteger el orden público económico (art. 58).' },
      { id: 'la-paradoja-del-dano-licito', icon: '🎭', t: 'La paradoja del daño lícito', d: 'Quitar clientes por eficiencia es lícito; el problema es el medio, no el resultado.' },
      { id: 'ambito-de-aplicacion-del-1044', icon: '🧭', t: 'Ámbito de aplicación: objetivo, subjetivo y territorial', d: 'Arts. 2, 3 y 4: qué actos, quiénes y dónde. Sin habitualidad y aunque nazca en el extranjero.' },
      { id: 'filtro-objetivo-finalidad-concurrencial', icon: '🎯', t: 'Filtro objetivo: la finalidad concurrencial', d: 'Trascendencia externa: idoneidad y desvío de preferencias. Opinión y propaganda quedan fuera.' },
      { id: 'filtro-subjetivo-principio-de-realidad', icon: '🔦', t: 'Filtro subjetivo: el principio de realidad', d: 'Art. 5: se levanta el velo; una asociación sin fines de lucro no es escudo.' }
    ] },
  { area: 'Cláusula general y actos desleales', icon: '🧩', acc: 'a8', mod: 2,
    desc: 'La red de seguridad del art. 6, la violación de normas, el Estado empresario y los actos no publicitarios.',
    lessons: [
      { id: 'la-clausula-general', icon: '🕸️', t: 'La cláusula general: la red de seguridad', d: 'Art. 6 buena fe empresarial; art. 7 sin dolo y con daño potencial; lista enunciativa.' },
      { id: 'violacion-de-normas', icon: '📛', t: 'Violación de normas (art. 14)', d: 'Competir ahorrando costos ilícitamente: decisión firme previa o ventaja significativa.' },
      { id: 'el-estado-como-competidor', icon: '🏛️', t: 'El Estado como competidor y la subsidiariedad', d: 'Art. 60 de la Constitución y art. 14.3: sin ventaja significativa, basta la infracción.' },
      { id: 'confusion-y-explotacion-de-la-reputacion', icon: '🪞', t: 'Confusión y explotación de la reputación ajena', d: 'Arts. 9 y 10: error sobre el origen y parasitismo o riesgo de asociación.' },
      { id: 'secretos-empresariales-y-sabotaje', icon: '🗝️', t: 'Secretos empresariales y sabotaje', d: 'Arts. 13 y 15: espionaje, deber de reserva y el límite de reclutar con mejores sueldos.' },
      { id: 'la-buena-fe-como-eje', icon: '🧭', t: 'La buena fe como eje rector', d: 'El mercado como orden público, la buena fe objetiva y el mejor caso es el no caso.' }
    ] },
  { area: 'Publicidad comercial: principios', icon: '📣', acc: 'a9', mod: 3,
    desc: 'Qué es publicidad, cómo la lee la autoridad y los principios de veracidad, autenticidad, legalidad y adecuación social.',
    lessons: [
      { id: 'la-publicidad-como-acto-de-concurrencia', icon: '📢', t: 'La publicidad como acto de concurrencia', d: 'Art. 59: promover imagen o motivar transacciones; basta un solo anuncio.' },
      { id: 'publicidad-propaganda-y-rotulado', icon: '🏷️', t: 'Publicidad, propaganda y rotulado', d: 'Qué no es publicidad y por qué el INDECOPI no hace censura previa.' },
      { id: 'analisis-integral-y-superficial', icon: '👀', t: 'Análisis integral y superficial', d: 'Art. 21: el vistazo del consumidor medio, la parte captatoria y el puffery del art. 20.' },
      { id: 'veracidad-y-sustanciacion-previa', icon: '🔬', t: 'Veracidad y sustanciación previa', d: 'Art. 8 y 8.4: la prueba debe existir antes de difundir el anuncio.' },
      { id: 'autenticidad-y-legalidad', icon: '🕶️', t: 'Autenticidad y legalidad', d: 'Arts. 16 y 17: publicidad encubierta, influencers, octógonos y precio con impuestos.' },
      { id: 'adecuacion-social', icon: '🚸', t: 'Adecuación social', d: 'Art. 18: discriminación, actos ilegales y contenido erótico frente a menores.' },
      { id: 'quien-responde-y-el-procedimiento', icon: '🧑‍⚖️', t: 'Quién responde y cómo se tramita', d: 'Anunciante, agencia y medio; de la denuncia a la CCD y la apelación ante la SDC.' }
    ] },
  { area: 'Casos de publicidad del INDECOPI', icon: '🔎', acc: 'a10', mod: 3,
    desc: 'La línea entre licencia publicitaria e infracción en casos recientes.',
    lessons: [
      { id: 'caso-win-y-caso-bitel', icon: '🐀', t: 'Caso Win y caso Bitel: humor vs. burla', d: 'Res. 0106-2024/SDC infundada por humor lícito; Bitel sancionado por mofa directa.' },
      { id: 'caso-mr-musculo', icon: '🧴', t: 'Caso Mr. Músculo: el 99.9 % de gérmenes', d: 'Res. 004-2025/CCD confirmada por Res. 0176-2025/SDC: pruebas parciales no bastan.' },
      { id: 'caso-bon-o-bon', icon: '🍫', t: 'Caso Bon o Bon: la imagen del empaque', d: 'Res. 137-2025/CCD: el relleno desbordante de la foto también es una afirmación.' },
      { id: 'caso-actibio-gloria-vs-laive', icon: '🥛', t: 'Caso Actibio: Gloria vs. Laive', d: 'Res. 104-2025/CCD sanciona por riesgo de asociación; Res. 0058-2026/SDC revoca.' },
      { id: 'caso-queso-artesanal-laive', icon: '🧀', t: 'Caso del queso «artesanal» de Laive', d: 'Res. 119-2025/CCD: el expediente técnico debe preceder al anuncio.' },
      { id: 'sintesis-de-publicidad', icon: '🧠', t: 'Síntesis: la protección del proceso competitivo', d: 'Protector y no enemigo, el consumidor medio como medida y prepararse antes del lanzamiento.' }
    ] },
  { area: 'Consumo: sujetos y relación de consumo', icon: '🛒', acc: 'a11', mod: 4,
    desc: 'Ley 29571: quién es consumidor, cuándo la MYPE lo es, quién es proveedor y los tres elementos.',
    lessons: [
      { id: 'del-articulo-65-a-la-ley-29571', icon: '📜', t: 'Del art. 65 a la Ley 29571', d: 'El mandato constitucional y la finalidad del Código: acceso idóneo, asimetría y mecanismos.' },
      { id: 'el-consumidor-destinatario-final', icon: '🙋', t: 'El consumidor: la regla del destinatario final', d: 'Art. IV 1.1: consumo personal, familiar o social, ajeno a la actividad empresarial.' },
      { id: 'la-mype-como-consumidor', icon: '🏪', t: 'Cuando la MYPE actúa como consumidor', d: 'Art. IV 1.2: ajeno al giro y asimetría informativa, dos filtros cumulativos.' },
      { id: 'el-proveedor-y-la-habitualidad', icon: '🏬', t: 'El proveedor y la habitualidad', d: 'Art. IV 2: oferta habitual; el acto civil aislado queda fuera del Código.' },
      { id: 'la-relacion-de-consumo', icon: '🔺', t: 'La relación de consumo: tres elementos', d: 'Consumidor, proveedor y producto o servicio con fin comercial; sin los tres no aplica.' }
    ] },
  { area: 'Consumo: protección, derechos y jurisprudencia', icon: '📋', acc: 'a12', mod: 4,
    desc: 'De la publicidad a la post-venta, el catálogo de derechos, el plazo de reclamos y las zonas grises.',
    lessons: [
      { id: 'alcance-temporal-de-la-proteccion', icon: '⏳', t: 'Alcance temporal: más allá del contrato', d: 'Etapa preliminar, contratación y post-venta (art. III y Título IV).' },
      { id: 'asimetria-informativa', icon: '⚖️', t: 'La ratio legis: asimetría informativa', d: 'Un mercado naturalmente desigual y el Derecho del consumo como contrapeso.' },
      { id: 'catalogo-de-derechos-del-consumidor', icon: '📑', t: 'El catálogo de derechos (art. 1.1)', d: 'Once literales de la a a la k agrupados en seis categorías y cuatro derechos más.' },
      { id: 'plazo-de-atencion-de-reclamos', icon: '⏱️', t: 'El plazo de atención de reclamos', d: 'Art. 24.1: 15 días hábiles improrrogables; antes 30 calendario (Ley 31435).' },
      { id: 'zonas-grises-uso-mixto-y-terceros', icon: '🌫️', t: 'Zonas grises: uso mixto y terceros', d: 'Finalidad predominante del uso y beneficiarios que no firmaron el contrato.' },
      { id: 'caso-mype-avicola-y-sectores', icon: '🐔', t: 'Caso de la MYPE avícola y ejemplos sectoriales', d: 'Res. 2502-2014/SPC y reglas en inmobiliario, financiero, educativo y salud.' }
    ] },
  { area: 'Repaso final para el examen', icon: '🎓', acc: 'a13', mod: 5,
    desc: 'Todo junto: cuadros comparativos, artículos y casos clave, confusiones típicas y examen integrador.',
    lessons: [
      { id: 'cuadro-comparativo-de-las-cuatro-normas', icon: '🗂️', t: 'Cuadro comparativo de los cuatro módulos', d: 'D.Leg. 1034, D.Leg. 1044, publicidad y Ley 29571: qué protegen, quién decide y cómo.' },
      { id: 'articulos-clave-para-el-examen', icon: '🔢', t: 'Artículos clave para el examen', d: 'Cada número de artículo que aparece en los temas, ordenado por norma.' },
      { id: 'casos-clave-para-el-examen', icon: '📚', t: 'Casos y resoluciones clave', d: 'FETRANS, farmacias, Win, Mr. Músculo, Bon o Bon, Actibio, queso artesanal y la MYPE avícola.' },
      { id: 'confusiones-frecuentes-en-el-examen', icon: '🧨', t: 'Confusiones frecuentes en el examen', d: 'Dominio vs. abuso, per se vs. razón, publicidad vs. propaganda, 30 días vs. 15 días hábiles.' },
      { id: 'examen-integrador', icon: '🏁', t: 'Examen integrador', d: 'Veinte preguntas que cruzan los cuatro módulos para comprobar que dominas el temario.' }
    ] }
];
