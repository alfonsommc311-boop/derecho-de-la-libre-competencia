import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter_tts/flutter_tts.dart';

// Puerto propio de la app (registro de la familia Experto/PRO) para evitar «Address already in use».
// 9053 = Obras por Impuestos PRO, 9054 = JPRD PRO / Examen PJ PRO, 9055 = Resolución de Contrato PRO.
const int kServerPort = 9056;

// Canal nativo (MainActivity.kt) para mantener la pantalla encendida en el modo carro.
const MethodChannel _pantalla = MethodChannel('lcp/pantalla');

final InAppLocalhostServer _server =
    InAppLocalhostServer(port: kServerPort, documentRoot: 'assets/web');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await _server.start();
  } catch (e) {
    debugPrint('Servidor local no iniciado: $e');
  }
  runApp(const LibreCompetenciaProApp());
}

/// Divide un texto en trozos que el motor TTS de Android acepta sin cortarse
/// (su límite ronda los 4000 caracteres), cortando en fin de oración cuando se puede.
List<String> trozos(String texto, {int max = 1500}) {
  var resto = texto.replaceAll(RegExp(r'\s+'), ' ').trim();
  final out = <String>[];
  while (resto.length > max) {
    var corte = resto.lastIndexOf(RegExp(r'[.;:!?] '), max - 1);
    if (corte < max ~/ 3) corte = resto.lastIndexOf(' ', max - 1);
    if (corte <= 0) corte = max - 1;
    out.add(resto.substring(0, corte + 1).trim());
    resto = resto.substring(corte + 1).trim();
  }
  if (resto.isNotEmpty) out.add(resto);
  return out;
}

class LibreCompetenciaProApp extends StatelessWidget {
  const LibreCompetenciaProApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Libre Competencia PRO',
        debugShowCheckedModeBanner: false,
        theme: ThemeData.dark(useMaterial3: true),
        home: const Shell(),
      );
}

class Shell extends StatefulWidget {
  const Shell({super.key});
  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  InAppWebViewController? _c;
  final FlutterTts _tts = FlutterTts();
  double _rate = 0.5;
  String _lang = 'es-US';

  // La lista de lectura vive en Dart (no en la página) para que el audio siga
  // avanzando con la pantalla apagada o el celular en el soporte del carro.
  int _gen = 0; // cambiarla cancela la lista en curso
  Completer<void>? _fin; // se completa cuando el TTS termina la frase actual
  DateTime _inicio = DateTime.now();
  int _fallos = 0; // frases seguidas que el motor de voz rechazó (sin voz instalada)

  @override
  void initState() {
    super.initState();
    _initTts();
  }

  Future<void> _initTts() async {
    await _tts.awaitSpeakCompletion(false);
    await _aplicarIdioma(_lang);
    try { await _tts.setSpeechRate(_rate); } catch (_) {}
    await _tts.setPitch(1.0);
    _tts.setCompletionHandler(_terminoFrase);
    _tts.setErrorHandler((_) => _terminoFrase(forzar: true));
  }

  Future<void> _aplicarIdioma(String lang) async {
    final candidatos = <String>[lang, 'es-US', 'es-ES', 'es-MX', 'es'];
    for (final l in candidatos) {
      try {
        final ok = await _tts.isLanguageAvailable(l);
        if (ok == true) {
          await _tts.setLanguage(l);
          return;
        }
      } catch (_) {}
    }
    try { await _tts.setLanguage('es-ES'); } catch (_) {}
  }

  void _terminoFrase({bool forzar = false}) {
    // Un «terminó» que llega pegado al inicio es el eco de la frase anterior: se ignora.
    if (!forzar && DateTime.now().difference(_inicio).inMilliseconds < 250) return;
    final f = _fin;
    _fin = null;
    if (f != null && !f.isCompleted) f.complete();
  }

  void _js(String source) {
    try { _c?.evaluateJavascript(source: source); } catch (_) {}
  }

  Future<void> _decir(String texto) async {
    final f = Completer<void>();
    _fin = f;
    _inicio = DateTime.now();
    dynamic r;
    try { r = await _tts.speak(texto); } catch (_) { r = 0; }
    if (r != 1) {
      _fin = null;
      _fallos++;
      await Future<void>.delayed(const Duration(milliseconds: 300));
      return;
    }
    _fallos = 0;
    // Red de seguridad si el motor nunca avisa que terminó.
    await f.future.timeout(Duration(seconds: 40 + texto.length ~/ 4), onTimeout: () {});
  }

  Future<void> _esperar(int ms, int gen) async {
    var resta = ms;
    while (resta > 0 && gen == _gen) {
      await Future<void>.delayed(const Duration(milliseconds: 100));
      resta -= 100;
    }
  }

  Future<void> _detener() async {
    _gen++;
    _terminoFrase(forzar: true);
    try { await _tts.stop(); } catch (_) {}
  }

  Future<void> _lista(List items, int desde, int id) async {
    await _detener();
    final gen = _gen;
    try { await _tts.setSpeechRate(_rate); } catch (_) {}
    for (var i = desde < 0 ? 0 : desde; i < items.length; i++) {
      if (gen != _gen) return;
      final it = items[i];
      final texto = (it is Map ? it['t'] : it ?? '').toString();
      final pausa = it is Map ? int.tryParse('${it['p'] ?? 0}') ?? 0 : 0;
      _js('window.__ttsAt && window.__ttsAt($id,$i);');
      for (final t in trozos(texto)) {
        if (gen != _gen) return;
        await _decir(t);
        if (_fallos >= 3) {
          // El motor de voz no responde: se corta la lista y se avisa en vez de recorrerla en silencio.
          _gen++;
          _js('window.__ttsFail && window.__ttsFail();');
          return;
        }
      }
      if (pausa > 0) await _esperar(pausa, gen);
    }
    if (gen == _gen) _js('window.__ttsEnd && window.__ttsEnd($id);');
  }

  Future<void> _handleTts(dynamic arg) async {
    if (arg is! Map) return;
    final cmd = arg['cmd'];
    if (arg['rate'] != null) {
      final r = double.tryParse('${arg['rate']}');
      if (r != null) _rate = r.clamp(0.2, 1.0).toDouble();
    }
    switch (cmd) {
      case 'stop':
        await _detener();
        break;
      case 'rate':
        try { await _tts.setSpeechRate(_rate); } catch (_) {}
        break;
      case 'lang':
        _lang = (arg['lang'] ?? 'es-US').toString();
        await _aplicarIdioma(_lang);
        break;
      case 'awake':
        try { await _pantalla.invokeMethod('encendida', arg['on'] == true); } catch (_) {}
        break;
      case 'list':
        final items = arg['items'];
        if (items is List) {
          _lista(items, int.tryParse('${arg['start'] ?? 0}') ?? 0, int.tryParse('${arg['id'] ?? 0}') ?? 0);
        }
        break;
      case 'speak':
        final text = (arg['text'] ?? '').toString();
        if (text.trim().isNotEmpty) _lista([text], 0, int.tryParse('${arg['id'] ?? 0}') ?? 0);
        break;
    }
  }

  @override
  Widget build(BuildContext context) => PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, _) async {
          if (didPop) return;
          await _detener();
          if (_c != null && await _c!.canGoBack()) {
            _c!.goBack();
          } else {
            SystemNavigator.pop();
          }
        },
        child: Scaffold(
          backgroundColor: const Color(0xFF15191C),
          body: SafeArea(
            child: InAppWebView(
              initialUrlRequest:
                  URLRequest(url: WebUri('http://localhost:$kServerPort/index.html')),
              initialSettings: InAppWebViewSettings(
                javaScriptEnabled: true,
                transparentBackground: true,
                supportZoom: false,
              ),
              onWebViewCreated: (c) {
                _c = c;
                c.addJavaScriptHandler(handlerName: 'tts', callback: (args) {
                  if (args.isNotEmpty) _handleTts(args.first);
                  return null;
                });
              },
            ),
          ),
        ),
      );

  @override
  void dispose() {
    _gen++;
    _tts.stop();
    super.dispose();
  }
}
