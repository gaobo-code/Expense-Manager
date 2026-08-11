from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "app" / "icon.png"
APP_DIR = ROOT / "app"
PUBLIC_DIR = ROOT / "public"


def contain(source: Image.Image, size: int, scale: float = 0.82) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target = round(size * scale)
    image = source.copy()
    image.thumbnail((target, target), Image.Resampling.LANCZOS)
    position = ((size - image.width) // 2, (size - image.height) // 2)
    canvas.alpha_composite(image, position)
    return canvas


def maskable(source: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), "#facc15")
    image = contain(source, size, 0.68)
    canvas.alpha_composite(image)
    return canvas


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    PUBLIC_DIR.mkdir(exist_ok=True)

    contain(source, 180).save(APP_DIR / "apple-icon.png", optimize=True)
    contain(source, 192).save(PUBLIC_DIR / "icon-192.png", optimize=True)
    contain(source, 512).save(PUBLIC_DIR / "icon-512.png", optimize=True)
    maskable(source, 192).save(PUBLIC_DIR / "icon-maskable-192.png", optimize=True)
    maskable(source, 512).save(PUBLIC_DIR / "icon-maskable-512.png", optimize=True)

    favicon = contain(source, 256, 0.9)
    favicon.save(
        APP_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )


if __name__ == "__main__":
    main()
