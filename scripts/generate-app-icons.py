from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
APP_DIR = ROOT / "app"
PUBLIC_DIR = ROOT / "public"
EMERALD_600 = "#059669"
WHITE = "#ffffff"


def wallet_icon(size: int, *, maskable: bool = False) -> Image.Image:
    """Render the same emerald WalletCards mark used by auth-shell.tsx."""
    supersampling = 4
    canvas_size = size * supersampling
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    inset = 0 if maskable else round(canvas_size * 0.08)
    radius = 0 if maskable else round(canvas_size * 0.32)
    draw.rounded_rectangle(
        (inset, inset, canvas_size - inset, canvas_size - inset),
        radius=radius,
        fill=EMERALD_600,
    )

    # Lucide WalletCards uses a 24x24 viewBox and a 2px rounded stroke.
    icon_size = canvas_size * (0.54 if not maskable else 0.50)
    offset = (canvas_size - icon_size) / 2
    unit = icon_size / 24
    stroke = max(1, round(2 * unit))

    def point(x: float, y: float) -> tuple[float, float]:
        return offset + x * unit, offset + y * unit

    draw.rounded_rectangle(
        (*point(3, 3), *point(21, 21)),
        radius=2 * unit,
        outline=WHITE,
        width=stroke,
    )
    draw.line([point(3, 9), point(3.15, 8.25), point(3.6, 7.6), point(4.25, 7.15), point(5, 7), point(19, 7), point(19.75, 7.15), point(20.4, 7.6), point(20.85, 8.25), point(21, 9)], fill=WHITE, width=stroke, joint="curve")

    # Sample the lower WalletCards wave so its shape stays faithful at every size.
    wave = [point(3, 11), point(6, 11)]
    wave += [point(6 + 2.1 * t, 11 + 1.8 * t) for t in [i / 8 for i in range(1, 9)]]
    wave += [point(8.1 + 6.8 * t, 12.8 + 1.6 * (4 * t * (1 - t))) for t in [i / 16 for i in range(1, 17)]]
    wave += [point(14.9 + 3.2 * t, 12.8 - 1.8 * t) for t in [i / 8 for i in range(1, 9)]]
    wave += [point(21, 11)]
    draw.line(wave, fill=WHITE, width=stroke, joint="curve")

    return image.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    PUBLIC_DIR.mkdir(exist_ok=True)

    wallet_icon(512).save(APP_DIR / "icon.png", optimize=True)
    wallet_icon(180).save(APP_DIR / "apple-icon.png", optimize=True)
    wallet_icon(192).save(PUBLIC_DIR / "icon-192.png", optimize=True)
    wallet_icon(512).save(PUBLIC_DIR / "icon-512.png", optimize=True)
    wallet_icon(192, maskable=True).save(PUBLIC_DIR / "icon-maskable-192.png", optimize=True)
    wallet_icon(512, maskable=True).save(PUBLIC_DIR / "icon-maskable-512.png", optimize=True)

    favicon = wallet_icon(256)
    favicon.save(
        APP_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )


if __name__ == "__main__":
    main()
