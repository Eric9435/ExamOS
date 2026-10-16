## Version 1.2 — GitHub-ready build

- Pinned build-time JSZip and MathJax dependencies, bundled into static output; core app needs no runtime API.
- Generated PNG PWA icons at build time instead of committing binary icons and font assets.
- Source-only GitHub release; lecture archives and personal PDFs remain private.

# ExamOS 1.1.0 — reliability and accessibility polish

## Improvements over 1.0
- IndexedDB v4 migration with `drafts` store and backward compatibility for v3 JSON backups.
- Written examinations are saved locally during an active attempt and resume after an ordinary page refresh. Users can discard the draft explicitly.
- Oral score/reflection fields persist while navigating question cards. Recording buttons reject duplicate starts.
- Practice attempts record elapsed time from when the question was opened.
- More consistent timezone handling for saved study sessions.
- Sourced Digital Communications subtopics from the uploaded 505-slide title index, plus the first two Electrical Power Systems II chapters (historical slides are labeled accordingly).
- Revised service worker cache with versioned activation and correct offline navigation fallbacks.
- Optional browser persistent-storage permission request, accessible focus indicators and keyboard PDF page navigation.
- Extended Node-based automated regression tests and GitHub Actions workflow.

## Transparency and remaining limitations
- The reader still relies on the browser's PDF engine; an integrated PDF.js canvas reader, in-document text index, thumbnails, ink/highlights, and full dual-page support are **not** implemented. Some mobile browsers cannot display PDF inside an iframe.
- HTML note editing and mathematical equivalence scoring are not implemented; note text is stored in plain text, optionally Markdown/LaTeX source.
- Offline mathematical typography depends on local MathJax resources being cached; initial online typesetting may be required for auxiliary font/extension files.
- Timed mock exams use *templates*, not verified current-semester examination rules.
- Unit tests and production build pass, but browser automation in this environment is blocked; physical-device acceptance testing remains necessary.
- The delivered code is a **dependency-free JavaScript PWA** rather than React/TypeScript/Vite. It must not be described as a React app.

## User data migration
The upgrade changes IndexedDB from schema v3 to v4 using normal object-store migration. Do **not** clear site storage. Export a backup before deploying upgrades, particularly if you have uploaded large lecture PDFs or oral recordings.