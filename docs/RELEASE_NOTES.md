## ExamOS 1.7 — iOS-inspired screen navigation

- Converted subject selection from in-page syllabus expansion to dedicated, full-width subject screens.
- Converted chapter selection into a dedicated chapter screen with checklists and lecture access.
- Question-bank selections open focused single-question screens rather than a side panel far down the page.
- Flashcard browsing and formula recall open standalone detail views.
- Added Back navigation, browser-history restoration, scroll-to-top on forward navigation, prior-position restoration on Back, and subtle reduced-motion-aware transitions.
- Added accessible grouped list rows, safe-area mobile navigation, and polished mobile/tablet typography.
- Preserved the private PDF vault, imported files, continuous finger-scroll PDF reader, quiz history, and offline PWA model.
- No AI APIs, models, or cloud uploads.

**Testing:** automated unit/regression tests and Render production build. Manual Android/tablet interaction requires device testing.

---

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

## ExamOS 1.3 — Private local PDF vault
- Added passphrase-gated AES-256-GCM encrypted PDF import and local storage, per-document authenticated decryption, a Lock control, and one-time personal course import instructions.
- Added a combined private 81-PDF import archive **distributed separately from GitHub/Render**. The archive is not uploaded to the public site.
- Added Web Crypto and import-regression automated tests, 20 tests total.
- Security scope: PDF contents encrypted only. Notes, filenames, exams and recordings remain local but unencrypted. No server-side account or cloud sync. Test manually on Android/tablet before relying on one-device storage.


## v1.4 — On-screen PDF reader
- Replaced the native browser PDF frame with a private PDF.js canvas reader, working on mobile browsers without native PDF preview support.
- Open PDFs in-app with previous/next, page jump, fit-width zoom, zoom controls, rotation, fullscreen, keyboard navigation, bookmarks and page notes.
- Local text search for selectable-text PDFs; image-only scans require OCR and are not falsely indexed.
- Decryption stays in browser memory and PDF.js files are served from the application origin (bundled at build).
- Worker, cMaps and standard fonts are copied to dist; the core renderer and worker are precached for offline use.
- Added pure page/zoom regressions. Existing encrypted documents do not require reimport.

## v1.5 — Acrobat-style continuous page scrolling
- Swipe up/down directly over PDF pages on smartphones, tablets and desktop touch displays.
- Always-visible, touch-draggable right page rail with live page counter and keyboard access.
- Smooth transition across pages without a fixed sidebar; single-page mode still available.
- Lazy PDF.js canvas rendering, caching only a small viewport neighborhood for documents with hundreds of pages.
- Page notes and progress follow the visible PDF page.
- 26 automated tests (includes 2 new reader/scrolling tests); live Android and tablet manual acceptance still needed.

## v1.6 — uncluttered PDF scrolling
- Removed the always-visible right-side fast page slider from the reader.
- Pages now occupy the available reading width; touch/trackpad/wheel continuous scrolling remains.
- No changes to encrypted document storage or prior imports.