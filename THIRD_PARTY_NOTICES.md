# Bundled third-party libraries

The ExamOS app shell itself requires no external API calls. Two pinned JavaScript libraries are copied from npm dependencies into the static build and served from the same origin for offline compatibility:

- **JSZip 3.10.1** (copyright Stuart Knightley and contributors): used for offline ZIP extraction. JSZip is dual-licensed under MIT or GPLv3; ExamOS uses the MIT terms. Source: https://github.com/Stuk/jszip
- **MathJax v2 legacy distribution** (copyright MathJax Consortium / contributors): used to render LaTeX formula cards offline. Apache License 2.0; the upstream license is distributed with the MathJax npm package. Source: https://github.com/mathjax/MathJax/tree/legacy-v2

The legacy MathJax library is included to preserve offline rendering, with no bundled font files committed to the application repository. Before wider distribution, evaluate maintenance/security and an upgrade to a current math-rendering stack. The offline ZIP decoder does not automatically execute archive contents; archive extraction and writing to IndexedDB are bounded and file-validated.