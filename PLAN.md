# PLAN — Libre Competencia PRO (app formativa, familia Experto/PRO)

## 1. Propósito
Preparar el examen final del curso de Derecho de la Libre Competencia escuchando, sobre todo en los trayectos en carro, con el temario exacto de las 4 sesiones del PDF «TEMAS PARA EL EX. FINAL».

## 2. Identidad
| Campo | Valor |
|---|---|
| Nombre visible | Libre Competencia PRO |
| applicationId | `com.alfonso.librecompetenciapro` |
| Puerto InAppLocalhostServer | 9056 |
| Prefijo Store | `lcp:` |
| Clonado de | Resolución de Contrato PRO (shell, motor, validador) + Examen PJ PRO (simulacro, fichas) |

## 3. Catálogo (13 áreas / 63 lecciones / 4 módulos + repaso)
1. Libre competencia (D.Leg. 1034): fundamentos · economía y poder de mercado · abuso de dominio · colusión horizontal · verticales y estándares · conductas, estructuras y síntesis.
2. Competencia desleal I (D.Leg. 1044): bien jurídico y filtros · cláusula general y actos desleales.
3. Publicidad: principios · casos del INDECOPI.
4. Consumo (Ley 29571): sujetos y relación de consumo · protección, derechos y jurisprudencia.
5. Repaso final: cuadros, artículos, casos, confusiones y examen integrador (20 preguntas).

## 4. Modo carro
Lista de lectura en Dart (sigue con la pantalla apagada si el celular lo permite; pantalla encendida por defecto como opción fiable), 5 formatos, pausa para pensar de 3, 5 u 8 s, selección por curso, módulo o área, reanudar donde quedó, repetir, parte siguiente y lección anterior/siguiente.

## 5. Hecho (v1.0)
- [x] Shell Flutter WebView + TTS con lista nativa, voz latina o de España, aviso si falta la voz.
- [x] 63 lecciones validadas (0 problemas), 268 preguntas, ~8,8 h de audio.
- [x] Modo carro, simulacro, repaso relámpago, artículos, casos y glosario.
- [x] Ícono propio, íconos adaptativos y splash.
- [x] Workflow Build APK → release `apk-latest`.

## 6. Pendiente
- [ ] Probar en el celular: voz en español instalada, audio con pantalla apagada y con Bluetooth del carro.
- [ ] Servicio en primer plano / controles de medios en la pantalla de bloqueo (hoy se usa «pantalla encendida»).
- [ ] Firma de release (keystore).
- [ ] Contrastar los artículos [COMPLEMENTO] y las dos rarezas del material con el profesor o la norma vigente.
