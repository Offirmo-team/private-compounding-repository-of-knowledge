https://markdoc.io/
https://github.com/cure53/DOMPurify/wiki/Security-Goals-&-Threat-Model

https://developer.mozilla.org/en-US/docs/Web/HTML/Microdata
https://developer.mozilla.org/en-US/docs/Web/HTML/microformats


https://github.com/mozilla/pdf.js


https://www.awsgeek.com/KubeCon-Virtual-2020/Managing-2-5-Million-Lines-of-YAML/

https://developers.google.com/search/docs/appearance/structured-data/article

https://webhint.io/docs/user-guide/hints/

https://marked.js.org/

https://www.mathjax.org/

typography "provides typographic features used traditionally in ﬁne printing which remain unavailable to browser layout engines" https://typeset.lllllllllllllllll.com/

markdown header

https://hackernoon.com/28-stories-to-learn-about-markdown


docx https://docx.js.org/#/

declaration vs. object model 

https://en.wikipedia.org/wiki/Uniform_Type_Identifier


length of text / intro
https://www.researchgate.net/publication/324329159_How_Constraints_Affect_Content_The_Case_of_Twitter%27s_Switch_from_140_to_280_Characters


diagrams https://d2lang.com/
https://viz-js.com/

## Need for a long-term semantic format

https://en.m.wikipedia.org/wiki/Digital_dark_age
https://en.m.wikipedia.org/wiki/BBC_Domesday_Project



https://www.canvasprotocol.org/


https://www.notion.so/blog/data-model-behind-notion


## hierarchy of file formats

human-readable -> machine-readable
no expertise needed -> expertise needed
"expressivity" (reduce duplication)
'+++ https://pkl-lang.org/blog/introducing-pkl.html
'+++ https://medium.com/kurtosis-tech/pkl-and-the-goldilocks-problem-of-configuration-languages-dc36621e102a

1. text
   1. unstructured
   1. semi-structured = text with some markup, permissive, no "syntax error"
      * markdown https://daringfireball.net/projects/markdown/
        * mixed with YAML front matter https://jekyllrb.com/docs/front-matter/
      * stricter markdown http://commonmark.org/
      * html
   1. structured = code
      1. "static languages"
         * json https://www.json.org/
         * YAML
         * property lists
      1. "hybrid/blend"
         * pkl https://pkl-lang.org/index.html
         * dhall https://dhall-lang.org/
      1. DSL
      1. "general-purpose languages" (powerful but: complex, ankward, tied to their ecosysytems)
         * js etc.
1. binary

Opportunities:
- vaguely structured markdown
- snowflake config

## Markdown

https://en.m.wikipedia.org/wiki/MultiMarkdown
https://datatracker.ietf.org/doc/html/rfc7764 Guidance on Markdown: Design Philosophies, Stability Strategies, and Select Registrations
https://github.com/mkdoc/mkql Markdown Query Language
reformat? https://www.npmjs.com/package/mdquery
https://kramdown.gettalong.org/index.html (ruby lib) interesting
CommonMark https://blog.codinghorror.com/standard-markdown-is-now-common-markdown/
MDX https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/
blocks https://blocks.md/


## counter-example of bad design

### Zip
https://news.ycombinator.com/item?id=27925393
https://games.greggman.com/game/zip-rant/

https://books.google.fr/books?id=uaTgf95ualMC&pg=PA62&lpg=PA62&dq=zip+format+hard+to+decompress+specification&source=bl&ots=hXUXU52z2_&sig=ACfU3U07GJVl8issVs3-lbwiEOD0UoRf7g&hl=en&sa=X&ved=2ahUKEwjxrrXd1sf5AhUF1IUKHayKA64Q6AF6BAhCEAI#v=onepage&q=zip%20format%20hard%20to%20decompress%20specification&f=false

https://github.com/thejoshwolfe/yauzl/issues/48#issuecomment-266587526

https://repairit.wondershare.com/file-repair/cannot-open-zip-file.html

### YAML
https://hitchdev.com/strictyaml/why/implicit-typing-removed/

### Markdown
(initial)


## web pag archive

https://stackoverflow.com/questions/260058/whats-the-best-file-format-for-saving-complete-web-pages-images-etc-in-a

https://www.ibm.com/docs/en/sc-and-ds/8.2.1?topic=reference-html-archive

https://en.m.wikipedia.org/wiki/MHTML

https://en.m.wikipedia.org/wiki/Mozilla_Archive_Format

https://en.m.wikipedia.org/wiki/Webarchive

## pdf

https://en.m.wikipedia.org/wiki/PDF
https://en.m.wikipedia.org/wiki/History_of_PDF
https://en.m.wikipedia.org/wiki/PostScript
https://en.m.wikipedia.org/wiki/Page_description_language (printer)

## RCS

https://en.wikipedia.org/wiki/Rich_Communication_Services

## new semantic format?

https://en.m.wikipedia.org/wiki/Open_file_format

https://en.m.wikipedia.org/wiki/Email

human + AI format
- structured data https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemscope


need to embed binary files:
* https://en.m.wikipedia.org/wiki/Media_type
* https://en.m.wikipedia.org/wiki/Uniform_Type_Identifier
* https://en.m.wikipedia.org/wiki/Data_URI_scheme


Books
https://dz4k.com/2024/new-hypermedia-systems/

html hard to parse https://dbushell.com/2024/10/01/html-parser-conundrum/


https://plantuml.com/   https://crashedmind.github.io/PlantUMLHitchhikersGuide/

semantic types https://github.com/facebook/prop-types
