# Fonts

Body (`Inter`) and mono (`JetBrains Mono`) are loaded via `next/font/google` in
`src/app/fonts.ts` — nothing to add here for those.

## Display font (Clash Display / Satoshi)

These are [Fontshare](https://www.fontshare.com/) fonts (not on Google Fonts),
so they are **not** auto-downloaded. Until you add them, the display family
gracefully falls back to Inter (see `--font-display` in `globals.css`).

To enable the real display font:

1. Download **Clash Display** (or **Satoshi**) `.woff2` files from Fontshare.
2. Place them in `src/app/fonts/` (create it), e.g.:
   - `ClashDisplay-Medium.woff2`
   - `ClashDisplay-Semibold.woff2`
3. Uncomment the `localFont` block in `src/app/fonts.ts` and add
   `fontDisplay.variable` to the `<html>` className in `src/app/layout.tsx`.

Licensing: review the Fontshare license before shipping the font files.
