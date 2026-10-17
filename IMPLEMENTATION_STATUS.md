## Version 1.2 — GitHub-ready build

- Pinned build-time JSZip and MathJax dependencies, bundled into static output; core app needs no runtime API.
- Generated PNG PWA icons at build time instead of committing binary icons and font assets.
- Source-only GitHub release; lecture archives and personal PDFs remain private.

# ExamOS 1.1 — feature delivery matrix

| Phase | Status | Implemented | Not implemented / not verified |
|:---|:---|:---|:---|
| 1. Shell & data | Functional | Responsive UI, five subjects, IndexedDB v4, themes, metrics based on saved data | Cross-device browser QA |
| 2. PDFs & ZIPs | Partial | PDF/ZIP import in worker, preserved PDF bytes, browser-native display, manual page navigation, bookmarks, floating notes | PDF.js text extraction/search, canvas pages, thumbnails, highlighting, ink, universal rotation / dual-page / gesture support |
| 3. Syllabus & notes | Functional subset | Lecturer-source chapter indexes, user-entered checklists, page-linked notes, syllabus JSON/CSV | Rich WYSIWYG and visual mind-map editor |
| 4. Questions & grading | Functional subset | User-entered/imported questions, objective grading, numerical tolerance, hidden solutions, manual grading | Math-equivalence engine, verified large TUHH question catalog |
| 5. Exams & oral | Functional subset | Timers, local draft recovery on refresh, history, flags, objective grades; voice record/playback and self-assessment | Simulated examiner dialogue, full microphone/device QA; live exam rules unverified |
| 6. Formula & recall | Functional | Local LaTeX, formula records/favorites, SM-2-inspired spaced repetition | Diagram editing and advanced FSRS |
| 7. Planner & analytics | Functional subset | Tasks, statuses, focus timers, basic activity analytics, mistake classification | Recurring timetable integration / calendar sync |
| 8. PWA & deployment | Build-ready | Offline shell, service worker, manifest/icons, Render static site scripts, npm tests | Device compatibility and end-to-end offline-install acceptance testing |

**Important:** App build and unit tests passed in the container, but full browser E2E was blocked by policy and no end-user device testing was possible. The PDF component does not fully meet the requested advanced PDF.js reader specification. No functionality is represented as an AI tutor or powered by an AI service.


## v1.3 PDF privacy
- Completed: browser-local passphrase-derived AES-GCM encryption for PDFs, per-document authentication, PDF read-time decryption, manual Lock, one-time private ZIP import.
- The 81 private PDF files are **not in this repository or static Render assets**. Each browser must import them from the privately shared bundle; there is no server-side private cloud storage.
- Limitations: local passphrase gate is not a multi-device account; notes and other study records are not encrypted; browser storage quota/clearing remain risks.