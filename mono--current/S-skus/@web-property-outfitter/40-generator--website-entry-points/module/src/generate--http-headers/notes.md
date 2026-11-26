TODO CSP

good reference! https://web.dev/articles/security-headers

performance.now() is deliberately coarsened as a Spectre mitigation:

- Default: ~100µs granularity (Chrome), 1ms (Firefox/Safari)
- With cross-origin isolation (Cross-Origin-Opener-Policy + Cross-Origin-Embedder-Policy headers): restored to ~5µs in
  Chrome
