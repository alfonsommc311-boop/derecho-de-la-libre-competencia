import 'package:flutter_test/flutter_test.dart';
import 'package:libre_competencia_pro/main.dart';

void main() {
  test('puerto propio de la familia (9053 OxI, 9054 JPRD/Examen PJ, 9055 Resolución de Contrato)', () {
    expect(kServerPort, 9056);
  });

  test('trozos respeta el límite del TTS y corta en fin de oración', () {
    final largo = List.filled(400, 'El abuso de posición de dominio se sanciona.').join(' ');
    final partes = trozos(largo);
    expect(partes.length, greaterThan(1));
    for (final p in partes) {
      expect(p.length, lessThanOrEqualTo(1500));
      expect(p.endsWith('.'), isTrue);
    }
    expect(partes.join(' '), largo);
  });

  test('trozos deja intacto un texto corto y descarta el vacío', () {
    expect(trozos('Hola.'), ['Hola.']);
    expect(trozos('   '), isEmpty);
  });
}
