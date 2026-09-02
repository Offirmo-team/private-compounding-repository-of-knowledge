# theming

## Usage

Use a data attribute:

```html
<html data-o-theme="light">
  <html data-o-theme="dark"></html>
</html>
```

If no data attribute, light theme is active.

### Brand customization

TODO !!! doesn't work ATM

TODO automatically derive some colors? https://developer.chrome.com/blog/css-relative-color-syntax/

### custom theme

- extra themes should start with `light--` or `dark--`
- extra themes should not need to redefine all colors, since several should be the same as the default

## Contributing

FYI colors: rainbow vs spectrum https://en.wikipedia.org/wiki/Rainbow#Number_of_colours_in_a_spectrum_or_a_rainbow

### default themes

Color selection

- True white and black? There is a raging debate:
  - https://uxplanet.org/alternatives-to-using-pure-black-000000-for-text-and-backgrounds-54ef0e733cdb
  - https://github.com/KeenRivals/bestmotherfucking.website/issues/54 discussion
  - https://uxmovement.com/content/why-you-should-never-use-pure-black-for-text-or-backgrounds/
  - https://ianstormtaylor.com/design-tip-never-use-black/
  - https://bestmotherfucking.website/ is using true white/black
  - Ideas "Alternatives to Using Pure Black" https://codepen.io/marcobiedermann/pen/ExqKeoW
  - Github is using rgb(36, 41, 47)

### TODO additional themes?

TODO https://draculatheme.com/pro TODO https://vscodethemes.com/ TODO https://iterm2colorschemes.com/ (not RGB, hard to
convert) TODO nice one https://piccalil.li/blog/a-guide-to-destructuring-in-javascript/ TODO cool design
https://voidzero.dev/posts/announcing-voidzero-inc

### TODO

TODO convert to LCH when supported ? https://caniuse.com/css-lch-lab TODO LCH palette https://uchu.style/ TODO
https://css-tricks.com/thinking-deeply-about-theming-and-color-naming/ TODO auto 256 from 16
https://gist.github.com/jake-stewart/0a8ea46159a7da2c808e5be2177e1783

TODO review https://github.com/google-labs-code/design.md
