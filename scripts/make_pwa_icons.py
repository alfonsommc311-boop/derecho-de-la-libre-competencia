"""Genera los íconos de la versión web (PWA) desde assets/icon/*.png. Requiere Pillow.
Uso: python3 scripts/make_pwa_icons.py   (tras scripts/make_icon.py)"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'scripts', 'pwa')
BG = (0x15, 0x19, 0x1c, 255)
icon = Image.open(os.path.join(ROOT, 'assets', 'icon', 'icon.png')).convert('RGBA')
glyph = Image.open(os.path.join(ROOT, 'assets', 'icon', 'foreground.png')).convert('RGBA')
os.makedirs(OUT, exist_ok=True)

icon.resize((192, 192), Image.LANCZOS).save(os.path.join(OUT, 'icon-192.png'), optimize=True)
icon.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, 'icon-512.png'), optimize=True)

# Maskable: fondo lleno y glifo dentro de la zona segura (círculo central del 80 %).
m = Image.new('RGBA', (512, 512), BG)
g = glyph.resize((int(512 * 0.72),) * 2, Image.LANCZOS)
m.alpha_composite(g, ((512 - g.width) // 2, (512 - g.height) // 2))
m.save(os.path.join(OUT, 'icon-maskable-512.png'), optimize=True)
print('Íconos PWA generados en ' + OUT)
