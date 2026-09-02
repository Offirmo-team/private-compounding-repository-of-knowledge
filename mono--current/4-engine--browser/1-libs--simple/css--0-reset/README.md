## CSS reset

My own CSS reset. A true reset.

## Introduction

### What is a CSS reset?

From Eric Meyer https://meyerweb.com/eric/tools/css/reset/

> The goal of a reset stylesheet is to reduce browser inconsistencies in things like default line heights, margins and
> font sizes of headings, and so on. (...) Reset styles quite often appear in CSS frameworks...
>
> The reset styles (...) are intentionally very generic. There isn't any default color or background set for the body
> element, for example. (...)
>
> Goal: After including the appropriate stylesheet from this module, HTML pages using non-deprecated elements should
> look identical on every browser and form factor

**My own reflexions on top of the above:**

- a true reset should still be readable, it should display at least as well as the browser default stylesheet
- a true reset should NOT introduce opinionated styles
- we not only want the same display across browsers and os, we also want stability across time = different versions of
  browser
- technically we should provide 1 reset per browser, maybe per combination browser + os

### Why a new one?

2017 FYI resets history https://css-tricks.com/reboot-resets-reasoning/

Reviewing the well known CSS, it appears they are not pure CSS reset:

- [list of early reset](https://perishablepress.com/a-killer-collection-of-global-css-reset-styles/)
- 2007 [Eric Meyer's](https://meyerweb.com/eric/tools/css/reset/)
  - not versioned/modularized (copy/paste on a web page)
  - not clearly commented (ex. mentions "older browsers")
  - goes beyond a reset by setting "recommended" styles
- [Richard Clark's](http://html5doctor.com/html-5-reset-stylesheet/)
  - (iteration of Eric Meyer's, same issues)
  - (TODO look at)
- [normalize.css](https://github.com/necolas/normalize.css/)
  - removes all margins = bad display
  - still supports IE
- [Josh Comeau's custom CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/)
  - not versioned/modularized (copy/paste on a blog post)
  - goes beyond a reset by "improving" styles
- [Josh Comeau's global styles](https://courses.joshwcomeau.com/css-for-js/treasure-trove/010-global-styles)
  - later version of the previous one
- [piccalilli](https://piccalil.li/blog/a-modern-css-reset/)
  - not versioned/modularized (copy/paste on a blog post)
  - goes beyond a reset with opiniated choices, ex. default list "style none"
- [a11y-css-reset](https://github.com/mike-engel/a11y-css-reset)
  - is not a reset, more like a "recommended"
- TODO https://github.com/jensimmons/cssremedy https://css-tricks.com/css-remedy/
- TODO https://css-tricks.com/should-css-override-default-styles/
- TODO https://css-tricks.com/notes-on-josh-comeaus-custom-css-reset/
- TODO https://css-tricks.com/reboot-resets-reasoning/
- TODO https://github.com/h5bp/main.css

What we want:

- ideally we want a pure reset bringing all browsers/os to the same common denominator WITHOUT introducing opinions or
  "recommended"
- we won't come up with new styles, we'll settle on the most rational from any of the big 3 browsers
- "sane defaults" should NOT be included, such recommended styles should be built upon the reset in a **separated**
  stylesheet
  - however this common denominator should display properly a semantic HTML (thus adding a few styles can be acceptable
    if not handled by the any default stylesheet)
- deprecated elements and browsers/os should no longer be included
- should be unit tested with visual regression

IMPORTANT NOTE

- since we may be using a foundation, this reset will only contain the needed stuff to correct ACTUAL USEFUL
  differences.
  - we don't aim at covering all the rare quirks

## Contributing

Please report display differences across browsers, if possible with a reproduction!

CSS

- use :root instead of html
- use logical properties https://adrianroselli.com/2019/11/css-logical-properties.html
- use the most appropriate unit https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/

## Notes

Ideas

- TODO one day check if one can use js to grab the default style from inside a browser?
- TODO https://web.dev/baseline
- TODO https://andy-bell.co.uk/a-more-modern-css-reset/
- TODO https://bedrocss.austingil.com/

[canonical link](https://github.com/Offirmo/offirmo-monorepo--2022/tree/main/stack--current/3-advanced--browser/css--reset#readme)
