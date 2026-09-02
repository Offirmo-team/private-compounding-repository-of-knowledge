html files became a mix of concerns:

- security
- huge list of meta
  - including social ones (with lots of repetition!)
  - favicons
- critical CSS
- preload
- 3rd party scripts
- webmanifest with repetition: titles, favicons...

And above all it's hard to properly comment!

I need a tool.

NOT IN SCOPE

- minification = not this tool's job
- SSR = maybe one day? but ideally we want full static on CDN
