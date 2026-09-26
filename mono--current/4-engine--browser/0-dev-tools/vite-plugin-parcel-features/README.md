# @monorepo-private/vite-plugin-parcel-features

Backfills the Parcel features our sources rely on, so the same source stays portable across both bundlers.

Wired in by default — see [`@monorepo-private/vite--config--default`](../vite--config--default).

## Image transform directives

Parcel's query syntax, honoured at build time by sharp:

```ts
const local_url = new URL("original.png?as=webp&width=1920", import.meta.url).href
```

| directive          | meaning                                             |
| ------------------ | --------------------------------------------------- |
| `as=` \| `format=` | `avif` `gif` `jpeg`/`jpg` `png` `tiff`/`tif` `webp` |
| `width=` \| `w=`   | max width, px                                       |
| `height=` \| `h=`  | max height, px                                      |
| `quality=` \| `q=` | encoder quality                                     |

Aspect ratio is preserved, and images are **never upscaled** — asking for a width above the source's own leaves it
untouched, so the dimensions declared next to an asset stay true.

A reference carrying none of these is left alone: Vite's own asset pipeline already handles it correctly.

### Why a plugin of our own rather than `vite-imagetools`

Our asset modules reference images via `new URL(…, import.meta.url)` so that **the same source also works in plain
node** (ex. rendering an image in a capable terminal). Two consequences:

1. `vite-imagetools` only sees static `import`s — which node cannot use for a binary asset.
2. More fundamentally, **no** hook-based image plugin can see these references at all. Vite handles that pattern in
   `vite:asset-import-meta-url`, which resolves the file and emits it directly via its internal `fileToUrl` instead of
   routing it through `resolveId`/`load`. Whatever query the specifier carries is simply dropped.

So this plugin rewrites the reference **before** Vite's own plugin runs (`enforce: "pre"`), pointing it at a derived
file, and lets Vite's asset pipeline do the serving / hashing / emitting from there. Identical in `serve` and `build`,
with no bundler internals involved.

Sources are never modified, so the node path keeps seeing the original untouched — node's `fileURLToPath` ignores the
query, which is what makes the directive inert there.

### Caching

Derived images land in a `.cache/` next to their source (gitignored repo-wide, and swept by
`monorepo-script--clean-package …cache`). sharp only re-runs when the source is newer than its derivative, so a rebuild
over many high-res sources costs nothing after the first pass.

Deleting any `.cache/` is always safe.
