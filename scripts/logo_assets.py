"""Build the app icon assets (or a preview sheet) from assets/CookEatLogo.jpeg.

Run from the repo root. Needs Pillow (`pip3 install pillow`).
The icon uses the full circular badge (variant A); B is a turtle close-up kept
for comparison.

usage: python3 scripts/logo_assets.py preview <out.png>
       python3 scripts/logo_assets.py build A assets
"""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC = Image.open("assets/CookEatLogo.jpeg").convert("RGBA")
BADGE = (704, 391, 344)          # full circular badge incl. dashed ring
CLOSEUP = (712, 300, 225)        # turtle + pan close-up
CREAM = (246, 246, 239, 255)     # margin colour of the JPEG, #F6F6EF
SPLASH_BG = (255, 250, 245, 255) # app.config splash backgroundColor #FFFAF5

def circle_crop(cx, cy, r, feather=1.5):
    sq = SRC.crop((cx - r, cy - r, cx + r, cy + r))
    mask = Image.new("L", sq.size, 0)
    ImageDraw.Draw(mask).ellipse((1, 1, sq.size[0] - 2, sq.size[1] - 2), fill=255)
    sq.putalpha(mask.filter(ImageFilter.GaussianBlur(feather)))
    return sq

def on_canvas(circ, size, diameter, bg):
    canvas = Image.new("RGBA", (size, size), bg)
    c = circ.resize((diameter, diameter), Image.LANCZOS)
    canvas.alpha_composite(c, ((size - diameter) // 2, (size - diameter) // 2))
    return canvas

VARIANTS = {
    # name: (source circle, android foreground diameter on 1024, ios diameter on 1024)
    "A": (BADGE, 650, 920),
    "B": (CLOSEUP, 683, 1024),
}

def android_fg(v, transparent=True):
    circ, d, _ = VARIANTS[v]
    return on_canvas(circle_crop(*circ), 1024, d, (0, 0, 0, 0) if transparent else CREAM)

def ios_icon(v):
    circ, _, d = VARIANTS[v]
    return on_canvas(circle_crop(*circ), 1024, d, CREAM).convert("RGB")

def splash_icon():
    return on_canvas(circle_crop(*BADGE), 1024, 1024, (0, 0, 0, 0))

def masked(img, shape, size):
    """Simulate a launcher: img is a 1024 adaptive canvas; visible area is the central 66.7%."""
    vis = int(1024 * 72 / 108)
    off = (1024 - vis) // 2
    region = Image.new("RGBA", (vis, vis), CREAM)
    region.alpha_composite(img.crop((off, off, off + vis, off + vis)))
    mask = Image.new("L", (vis, vis), 0)
    d = ImageDraw.Draw(mask)
    if shape == "circle":
        d.ellipse((0, 0, vis - 1, vis - 1), fill=255)
    else:
        d.rounded_rectangle((0, 0, vis - 1, vis - 1), radius=int(vis * 0.28), fill=255)
    region.putalpha(mask)
    return region.resize((size, size), Image.LANCZOS)

def ios_masked(img, size):
    im = img.convert("RGBA")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 1023, 1023), radius=225, fill=255)
    im.putalpha(mask)
    return im.resize((size, size), Image.LANCZOS)

def preview(out):
    font = ImageFont.load_default(size=22)
    sheet = Image.new("RGBA", (1180, 760), (255, 255, 255, 255))
    d = ImageDraw.Draw(sheet)
    labels = ["Android circle", "Android squircle", "iOS", "48 px"]
    for row, v in enumerate(["A", "B"]):
        y = 40 + row * 300
        d.text((20, y + 80), f"{v}: " + ("full badge" if v == "A" else "turtle close-up"), fill="black", font=font)
        fg = android_fg(v)
        tiles = [masked(fg, "circle", 192), masked(fg, "squircle", 192), ios_masked(ios_icon(v), 192), masked(fg, "circle", 48)]
        for col, t in enumerate(tiles):
            x = 260 + col * 220
            sheet.alpha_composite(t, (x, y + (72 if col == 3 else 0)))
            if row == 0:
                d.text((x, 10), labels[col], fill="black", font=font)
    # splash mock
    phone = Image.new("RGBA", (200, 400), SPLASH_BG)
    phone.alpha_composite(splash_icon().resize((150, 150), Image.LANCZOS), (25, 125))
    sheet.alpha_composite(phone, (980, 200))
    d.text((980, 170), "splash", fill="black", font=font)
    d.rectangle((980, 200, 1179, 599), outline="gray")
    sheet.convert("RGB").save(out)

def build(v, assets):
    ios_icon(v).save(f"{assets}/icon.png")
    android_fg(v).save(f"{assets}/adaptive-icon.png")
    splash_icon().save(f"{assets}/splash-icon.png")
    android_fg(v, transparent=False).resize((48, 48), Image.LANCZOS).save(f"{assets}/favicon.png")

if __name__ == "__main__":
    if sys.argv[1] == "preview":
        preview(sys.argv[2])
    else:
        build(sys.argv[2], sys.argv[3])
