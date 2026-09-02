## @monorepo-private/css--framework

A micro CSS framework (like Bootstrap but with minimal features), mostly for my personal use.
**[live demo on CodePen](https://codepen.io/Offirmo/pen/qYYWVy)** TODO BROKEN

Can also be used as a base for more advanced CSS frameworks like @tbrpg/ui--browser--css

Features:

- by default, the minimal styles to make a page looks good (cf. "motherfucking website")
- by default, activates clever non-reset settings gleaned across blog posts (see list at bottom)
- several "atomic" classes (see [tachyons](https://tachyons.io/) / [atomic CSS](https://acss.io/))

Inspiration:

- inspired by [tachyons](https://tachyons.io/)
- inspired by [motherfuckingwebsite](https://motherfuckingwebsite.com/) /
  [better](https://bettermotherfuckingwebsite.com/) / [perfect](https://perfectmotherfuckingwebsite.com/)
- inspired by techniques borrowed in articles around the net (see refs. in the code and "credits" below)

## Usage

### automatic defaults (reset + foundation)

By default, this stylesheet will activate a page like "mother fucking website".

```html
<link rel="stylesheet" type="text/css" href="TODO" />
```

alternatively:

```css
@import "@monorepo-private/css--framework";
```

### On-demand

Activated through classes: (ideally as semantic as possible)

```
o⋄error-report


o⋄border⁚default
o⋄border-colorꘌancillary


o⋄colorꘌmain
o⋄colorꘌsecondary
o⋄colorꘌancillary

o⋄colorꘌerror
o⋄colorꘌwarning
o⋄colorꘌinfo
o⋄colorꘌsuccess TODO failure

o⋄bg-colorꘌbackdrop


o⋄widthꘌ100pc
o⋄heightꘌ100pc

o⋄full-viewport` WARNING will style all the chain of parents!
o⋄usable-viewport

o⋄fill-parent


o⋄flex--directionꘌrow // TODO semantic!
o⋄flex--directionꘌcolumn
o⋄flex--centered-content

o⋄flex-element--nogrow
o⋄flex-element--grow
o⋄flex-element--no-squish


o⋄fontꘌfast-and-good-enough
o⋄fontꘌsystem--sans
o⋄fontꘌsystem--serif
o⋄fontꘌsystem--mono


o⋄text-alignꘌcenter
o⋄marginꘌnone
o⋄overflow-yꘌauto
o⋄fast-tap
o⋄unstyled
o⋄text-readable-on-any-background
o⋄img-visible-on-any-background


o⋄paddingꘌnone
o⋄paddingꘌsmall
o⋄paddingꘌmedium


o⋄positionꘌabsolute
o⋄positionꘌrelative
o⋄positionꘌfixed


o⋄rotated⁚45deg
o⋄rotated⁚90deg
o⋄rotated⁚180deg
o⋄rotated⁚270deg
```

### Customization

```
* data selectors
data-o-theme="dark" (light is the default, no need to specify)
data-o-theme="dark--colorhunt212"


COLORS inherited from foundation
--o⋄color⁚fg--main
--o⋄color⁚fg--strong
--o⋄color⁚fg--ancillary
--o⋄color⁚accent
--o⋄color⁚activity-outline
--o⋄color⁚bg--main
--o⋄color⁚bg--code
--o⋄color⁚bg--highlight--1
--o⋄color⁚bg--highlight--2
--o⋄color⁚fg--link
--o⋄color⁚fg--link--visited
--o⋄font-family--fast_and_good_enough
--o⋄font-family--main
--o⋄font-family--code
--o⋄border--thickness
--o⋄content-recommended-width

EXTRA colors
--o⋄color⁚fg--secondary
--o⋄color⁚fg--error
--o⋄color⁚fg--warning
--o⋄color⁚fg--info
--o⋄color⁚fg--success

--o⋄color⁚bg--main--backdrop ???

--o⋄filter⁚img-visible-on-any-background
```

### Special techniques

**[More advanced demo](https://codepen.io/Offirmo/pen/zjavzJ)** TODO BROKEN

#### containers debug

```html
XXX OUTDATED
<style type="text/css">
  .o⋄top-container {
    border-width: 1px;
  }
</style>

<html class="o⋄top-container">
  <body class="o⋄top-container">
    <div class="o⋄top-container o⋄centered-article">
      <p>Hello world</p>
    </div>
  </body>
</html>
```

## Credits

https://docs.google.com/spreadsheets/d/1wc7Arr5YyOjFmSvJfmQnPfxgPQXXaRSPu21tfAhIuAQ/edit#gid=0

- using data="xyz" https://simurai.com/blog/2018/04/01/contextual-styling
  - (more about data) https://www.sitepoint.com/use-html5-data-attributes/

using the fancy U+205A TWO DOT PUNCTUATION '⁚' U+22C4 DIAMOND OPERATOR '⋄' VAI LENGTHENER 'ꘌ'

TODO review units + TODO review scalability TODO review font size TODO layout
https://css-tricks.com/an-auto-filling-css-grid-with-max-columns/ TODO layout
https://css-tricks.com/the-holy-grail-layout-with-css-grid/ TODO evaluat shapes
https://css-tricks.com/the-shapes-of-css/
