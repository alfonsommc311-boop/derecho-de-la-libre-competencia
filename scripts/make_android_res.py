"""Genera los recursos Android (ícono, ícono adaptativo y splash) desde assets/icon/*.png
sin necesitar Flutter (equivale a flutter_launcher_icons + flutter_native_splash). Requiere Pillow.
Uso: python3 scripts/make_android_res.py   (tras scripts/make_icon.py)"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, 'android', 'app', 'src', 'main', 'res')
BG = (0x15, 0x19, 0x1c)
DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

icon = Image.open(os.path.join(ROOT, 'assets', 'icon', 'icon.png')).convert('RGBA')
glyph = Image.open(os.path.join(ROOT, 'assets', 'icon', 'foreground.png')).convert('RGBA')

def centered(size, scale):
    c = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    g = glyph.resize((int(size * scale),) * 2, Image.LANCZOS)
    c.alpha_composite(g, ((size - g.width) // 2, (size - g.height) // 2))
    return c

def save(img, *parts):
    path = os.path.join(RES, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)

for d, k in DENS.items():
    save(icon.resize((int(48 * k),) * 2, Image.LANCZOS), 'mipmap-' + d, 'ic_launcher.png')
    save(centered(int(108 * k), 0.80), 'drawable-' + d, 'ic_launcher_foreground.png')   # zona segura del adaptativo
    save(centered(int(256 * k), 1.0), 'drawable-' + d, 'splash.png')
    s12 = centered(int(256 * k), 0.72)                                                     # Android 12 recorta en círculo
    save(s12, 'drawable-' + d, 'android12splash.png')
    save(s12, 'drawable-night-' + d, 'android12splash.png')
for d in ('drawable', 'drawable-v21'):
    save(Image.new('RGB', (1, 1), BG), d, 'background.png')
print('Recursos Android generados en ' + RES)
