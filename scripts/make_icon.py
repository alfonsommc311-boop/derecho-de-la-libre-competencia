# make_icon.py — Genera assets/icon/icon.png (1024, fondo degradado redondeado + glifo)
# y assets/icon/foreground.png (glifo transparente para adaptive icon + splash).
# Requiere Pillow. Uso:
#   python make_icon.py --dir "D:\especialista en <tema>" --top "#7c3aed" --bot "#4338ca" [--glyph robot]
# Glifos incluidos: robot | casco | engranaje | libro | municipio | resolucion | balanza. Para uno nuevo, añade una función draw_<n>.
# Tras generar: dart run flutter_launcher_icons ; dart run flutter_native_splash:create ; rebuild.
import argparse, os
from PIL import Image, ImageDraw

SS = 4096  # supersample

def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

WHITE = (244, 244, 255, 255)
DARK  = (20, 24, 40, 255)

def draw_robot(S, accent):
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    screen = (46, 16, 101, 255); eye = (125, 211, 252, 255)
    R = lambda a, b, c, dd, r, f: d.rounded_rectangle([(a, b), (c, dd)], radius=r, fill=f)
    E = lambda cx, cy, r, f: d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=f)
    d.line([(S*0.5, S*0.335), (S*0.5, S*0.25)], fill=accent, width=int(S*0.016)); E(S*0.5, S*0.235, S*0.032, accent)
    R(S*0.255, S*0.44, S*0.30, S*0.60, S*0.02, WHITE); R(S*0.70, S*0.44, S*0.745, S*0.60, S*0.02, WHITE)
    R(S*0.29, S*0.335, S*0.71, S*0.72, S*0.09, WHITE); R(S*0.335, S*0.39, S*0.665, S*0.66, S*0.06, screen)
    E(S*0.42, S*0.49, S*0.045, eye); E(S*0.58, S*0.49, S*0.045, eye)
    E(S*0.435, S*0.475, S*0.016, (255,)*4); E(S*0.595, S*0.475, S*0.016, (255,)*4)
    for x in (0.44, 0.50, 0.56): R(S*(x-0.02), S*0.575, S*(x+0.02), S*0.60, S*0.008, eye)
    return img

def draw_casco(S, accent):
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.pieslice([S*0.28, S*0.34, S*0.72, S*0.72], 180, 360, fill=WHITE)                      # casquete
    d.rounded_rectangle([(S*0.24, S*0.52), (S*0.76, S*0.585)], radius=S*0.03, fill=WHITE)   # visera
    d.rounded_rectangle([(S*0.465, S*0.30), (S*0.535, S*0.46)], radius=S*0.03, fill=accent) # cresta
    return img

def draw_engranaje(S, accent):
    import math
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    cx = cy = S/2; r_out = S*0.20; r_t = S*0.055
    for k in range(8):
        a = k*math.pi/4
        x, y = cx + math.cos(a)*r_out, cy + math.sin(a)*r_out
        d.rounded_rectangle([(x-r_t, y-r_t), (x+r_t, y+r_t)], radius=r_t*0.4, fill=WHITE)
    d.ellipse([cx-r_out, cy-r_out, cx+r_out, cy+r_out], fill=WHITE)
    d.ellipse([cx-S*0.085, cy-S*0.085, cx+S*0.085, cy+S*0.085], fill=accent)
    return img

def draw_libro(S, accent):
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.rounded_rectangle([(S*0.30, S*0.33), (S*0.70, S*0.70)], radius=S*0.03, fill=WHITE)     # tapa
    d.rectangle([(S*0.30, S*0.33), (S*0.36, S*0.70)], fill=accent)                            # lomo
    for i, y in enumerate((0.42, 0.50, 0.58)):
        d.rounded_rectangle([(S*0.42, S*y), (S*0.64, S*(y+0.035))], radius=S*0.012, fill=(170, 180, 205, 255))
    return img

def draw_municipio(S, accent):
    """Edificio municipal (frontón + columnas) con moneda dorada: OxI."""
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    R = lambda a, b, c, dd, r, f: d.rounded_rectangle([(S*a, S*b), (S*c, S*dd)], radius=S*r, fill=f)
    d.polygon([(S*0.5, S*0.26), (S*0.24, S*0.40), (S*0.76, S*0.40)], fill=WHITE)   # frontón
    R(0.24, 0.41, 0.76, 0.445, 0.008, WHITE)                                       # arquitrabe
    for x in (0.29, 0.40, 0.51, 0.62):                                             # columnas
        R(x, 0.46, x+0.065, 0.66, 0.008, WHITE)
    R(0.22, 0.665, 0.78, 0.71, 0.012, WHITE)                                       # base
    R(0.19, 0.715, 0.81, 0.75, 0.012, WHITE)
    cx, cy, r = S*0.735, S*0.335, S*0.105                                          # moneda
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=accent)
    d.ellipse([cx-r*0.72, cy-r*0.72, cx+r*0.72, cy+r*0.72], outline=(15, 23, 42, 255), width=int(S*0.011))
    d.rounded_rectangle([(cx-S*0.012, cy-r*0.45), (cx+S*0.012, cy+r*0.45)], radius=S*0.006, fill=(15, 23, 42, 255))
    d.rounded_rectangle([(cx-r*0.32, cy-S*0.012), (cx+r*0.32, cy+S*0.012)], radius=S*0.006, fill=(15, 23, 42, 255))
    return img

def draw_resolucion(S, accent):
    """Contrato de obra (hoja con líneas y firma) partido por una grieta, con sello de resolución: Resolución de Contrato PRO."""
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = S*0.27, S*0.22, S*0.69, S*0.78
    d.rounded_rectangle([(x0, y0), (x1, y1)], radius=S*0.03, fill=WHITE)                    # hoja
    d.polygon([(x1-S*0.10, y0), (x1, y0), (x1, y0+S*0.10)], fill=(200, 205, 220, 255))      # esquina doblada
    for y in (0.32, 0.39, 0.46, 0.53):                                                      # líneas de texto
        d.rounded_rectangle([(S*0.33, S*y), (S*0.60, S*(y+0.028))], radius=S*0.01, fill=(160, 170, 195, 255))
    d.line([(S*0.34, S*0.66), (S*0.40, S*0.62), (S*0.45, S*0.67), (S*0.51, S*0.63)], fill=(60, 70, 100, 255), width=int(S*0.012))  # firma
    crack = [(S*0.47, y0), (S*0.44, S*0.36), (S*0.50, S*0.47), (S*0.45, S*0.58), (S*0.51, S*0.68), (S*0.48, y1)]
    d.line(crack, fill=(28, 25, 23, 255), width=int(S*0.018))                                # grieta
    cx, cy, r = S*0.68, S*0.68, S*0.14                                                       # sello
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=accent)
    d.ellipse([cx-r*0.78, cy-r*0.78, cx+r*0.78, cy+r*0.78], outline=WHITE, width=int(S*0.012))
    w = int(S*0.026)
    d.line([(cx-r*0.38, cy-r*0.38), (cx+r*0.38, cy+r*0.38)], fill=WHITE, width=w)
    d.line([(cx-r*0.38, cy+r*0.38), (cx+r*0.38, cy-r*0.38)], fill=WHITE, width=w)
    return img

def draw_balanza(S, accent):
    """Balanza de la justicia con platillos dorados y ondas de audio: Libre Competencia PRO."""
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.rounded_rectangle([(S*0.485, S*0.25), (S*0.515, S*0.70)], radius=S*0.012, fill=WHITE)   # poste
    d.rounded_rectangle([(S*0.36, S*0.69), (S*0.64, S*0.745)], radius=S*0.02, fill=WHITE)     # base
    d.rounded_rectangle([(S*0.20, S*0.285), (S*0.80, S*0.315)], radius=S*0.014, fill=WHITE)   # cruz
    r = S*0.035; d.ellipse([S*0.5-r, S*0.24-r, S*0.5+r, S*0.24+r], fill=accent)               # pivote
    w = int(S*0.009)
    for cx in (0.27, 0.73):
        top = (S*cx, S*0.31)
        d.line([top, (S*(cx-0.10), S*0.53)], fill=WHITE, width=w)                             # cuerdas
        d.line([top, (S*(cx+0.10), S*0.53)], fill=WHITE, width=w)
        d.chord([S*(cx-0.125), S*0.45, S*(cx+0.125), S*0.61], 0, 180, fill=accent)             # platillo
    for k, rr in enumerate((0.085, 0.13)):                                                     # ondas de audio
        bb = [S*(0.5-rr), S*(0.47-rr), S*(0.5+rr), S*(0.47+rr)]
        d.arc(bb, 300, 60, fill=accent, width=int(S*0.014))
        d.arc(bb, 120, 240, fill=accent, width=int(S*0.014))
    return img

GLYPHS = {'robot': draw_robot, 'casco': draw_casco, 'engranaje': draw_engranaje, 'libro': draw_libro, 'municipio': draw_municipio, 'resolucion': draw_resolucion, 'balanza': draw_balanza}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dir', required=True, help='Carpeta raiz de la app (contiene assets/icon)')
    ap.add_argument('--top', default='#7c3aed', help='Color superior del degradado (#rrggbb)')
    ap.add_argument('--bot', default='#4338ca', help='Color inferior del degradado (#rrggbb)')
    ap.add_argument('--glyph', default='robot', choices=sorted(GLYPHS), help='Glifo del icono')
    ap.add_argument('--accent', default=None, help='Color de acento del glifo (default: --top)')
    a = ap.parse_args()

    icon_dir = os.path.join(a.dir, 'assets', 'icon')
    os.makedirs(icon_dir, exist_ok=True)
    accent = hex_rgb(a.accent or a.top) + (255,)

    glyph = GLYPHS[a.glyph](SS, accent).resize((1024, 1024), Image.LANCZOS)
    glyph.save(os.path.join(icon_dir, 'foreground.png'))

    W = 1024; top, bot = hex_rgb(a.top), hex_rgb(a.bot)
    grad = Image.new('RGB', (1, W))
    for y in range(W):
        t = y/(W-1)
        grad.putpixel((0, y), tuple(int(top[i] + (bot[i]-top[i])*t) for i in range(3)))
    grad = grad.resize((W, W))
    mask = Image.new('L', (W, W), 0)
    ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (W-1, W-1)], radius=180, fill=255)
    bg = Image.new('RGBA', (W, W), (0, 0, 0, 0)); bg.paste(grad, (0, 0), mask)
    big = GLYPHS[a.glyph](SS, accent).resize((int(1024*1.12),)*2, Image.LANCZOS)
    off = (W - big.width)//2
    bg.alpha_composite(big, (off, off))
    bg.save(os.path.join(icon_dir, 'icon.png'))
    print('icon.png y foreground.png generados en ' + icon_dir)
    print('Siguiente: dart run flutter_launcher_icons ; dart run flutter_native_splash:create ; flutter build apk --release')

if __name__ == '__main__':
    main()
