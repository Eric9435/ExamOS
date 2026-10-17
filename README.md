# ExamOS — TUHH EEIT Exam Preparation

**Version:** 1.5.0 (touch PDF scrolling and private offline vault)  
**University:** Hamburg University of Technology (TUHH)  
**Programme:** M.Sc. Electrical Engineering and Information Technology  
**Specialization:** Control and Power Systems Engineering  
**Semester:** Winter 2026/27

ExamOS is a privacy-oriented examination workspace for Android, tablet and desktop. It runs on **static hosting**, with **no account, backend, AI API, AI chat, paid external service, or model keys**. Local study data and original uploaded PDF bytes are stored in browser **IndexedDB**. A local PDF.js canvas reader with continuous finger scrolling, a draggable page scrubber, and private page-linked notes are provided. Original PDF files stay encrypted at rest in the browser.

## Get running

Requires Node.js 20+ and a modern Chromium browser.

```bash
npm install
npm test
npm run build
npm run dev
```

Open `http://localhost:4173`. For production preview, `npm run preview`. The static build uses pinned **jszip@3.10.1**, **mathjax@2.7.9** and **pdfjs-dist@5.4.296** packages fetched by `npm install` at build time. No API or network service is required at runtime after the first full app load and cached dependencies. The build copies runtime scripts to `dist/vendor/`, and the PWA caches core assets for offline use. Installing dependencies requires an internet connection unless those packages are already installed; no paid subscription, backend, or AI API is needed.

This is a **dependency-free JavaScript PWA**, not the suggested React/Vite stack. The choice makes offline distribution and reproducible builds possible in constrained environments, without making a claim that React or Vite is present. The build script generates a fully static `dist/` site.

## Deploy to Render (Static Site)

1. Create a new GitHub repository and upload the **source project folder contents** (including `src`, `public`, `scripts`, `package.json`, and `index.html`). Do not upload student materials, private backups or `ExamOS_Private_*` archives to a public repo.
2. On Render, select **New → Static Site** and connect the repository.
3. Set **Build command** to `npm install && npm run build`.
4. Set **Publish directory** to `dist`.
5. The generated `dist/_redirects` includes the fallback rule `/* /index.html 200` for SPA hosting. All navigation currently occurs inside one static page.
6. Deploy. After first online load, use Chrome **Install app** / **Add to Home Screen**.

There is no backend, Render web service, server environment variable or secret to configure. Render is only responsible for serving the **application shell**, not for storing student data.

## Initial study structure

| Subject | Instructor | Initial syllabus | Exam template |
| --- | --- | --- | --- |
| Digital Communications | Prof. Gerhard Bauch | 19 study groups with page ranges from the uploaded 505-page WiSe 2026/27 PDF index; these groups are not official lecture boundaries | 90 min written; verify current rules |
| Electrical Power Systems II | Prof. Christian Becker | Chapter 1 Introduction; Chapter 2 Components and Grid Models Part 1 | ~30 min oral; historical, unverified for current semester |
| Control Systems Theory and Design | Prof. Timm Faulwasser | Introduction | 120 min written; verify |
| Microwave Engineering | Prof. Kölpin | 9 lectures from earlier archive (397 pages), including S-parameters, Noise, Couplers, Waveguides, Antennas and Filters | 90 min written; archived slide, verify |
| Microsystem Engineering | Dr. Timo Lipka | Introduction | User-configurable |

No chapters or tasks are marked completed on first launch. The four initial literature entries are sourced to the user's course slides/indexes and identified as *background* recommendations, not compulsory readings. No exam questions are generated or invented. Import your legitimate course materials through **Document library → Import PDF / ZIP**. The separately provided private `ExamOS_Private_*_PDFs.zip` files can be directly imported in the library, one at a time. The private content packages should not be deployed.

## Working modules

- **Home:** course overview, progress based on completed checklist items, saved study minutes, tasks, due cards, previous files, mistake summaries.
- **Courses:** add/edit subjects, import JSON/CSV chapter data, add/edit chapter ranges, chapter checklist progress.
- **Documents:** upload original PDF, ZIP of PDFs, organize folders, an in-app PDF.js reader, touch/swipe continuous vertical page scrolling, right-side draggable fast-page scrollbar, optional single-page mode, page number input, text search in PDFs with selectable text, fit-width zoom/rotation/fullscreen, bookmarks, last-page recovery and a draggable notes panel. PDF bytes are not modified on annotation.
- **Question bank:** write/import MCQ, multiselect, true/false, numerical-with-absolute-tolerance, fill-in, short/long, derivation, diagram and oral questions. Solutions are hidden until reveal/submit. Free-text answers are manually graded.
- **Timed exams:** select source-based questions, duration, navigation, flags, pause, submission, automatic objective scoring, local draft recovery after refresh and saved exam history.
- **Oral studio:** source-based question cards, duration, microphone recording with consent, saved audio and 0–5 self-rating; no speech transcription.
- **Formula bank:** equations in LaTeX rendered by local MathJax, explanations, symbols, units, sources, favorites and manual recall.
- **Flashcards:** edit/import cards, front/back reveal, ratings Again/Hard/Good/Easy, repeatable deterministic SM-2-inspired scheduling and history.
- **Notes:** searchable personal text/Markdown source, PDF-page linkage, Markdown download, printing/PDF via browser printing.
- **Planner:** tasks and statuses, dates, session timer and 25-minute Pomodoro, daily goal.
- **Insights:** statistics based on attempts, recorded mistakes and tracked sessions.
- **Books:** add/edit/import personally sourced textbook metadata and reading status.
- **Settings:** full JSON backup with PDF/audio bytes encoded as base64, JSON restore, storage quota estimate, dark/light theme, profile and install hints.

## Storage, privacy, recovery

IndexedDB records survive a normal page reload. They are **not guaranteed permanent**. Browsers impose quotas and may evict stored content; clearing browser data, reinstalling the app or switching browser/device may delete data. The full JSON backup includes large blobs as base64 and can be significantly larger than the original PDFs. Export periodically and save a separate copy somewhere outside the browser. Restoring from JSON performs ID-based upserts, not a destructive reset.

Recordings require microphone permission and a supported `MediaRecorder` implementation. For background operation and PWA installation, serve the site via HTTPS (Render automatically provides HTTPS). Static host does not receive PDF or recording data through an API; no analytics are installed.

The ZIP parser runs in a **Web Worker**; limits: archive ≤200 MB, up to 250 PDFs per archive, expanded total ≤450 MB, individual PDF ≤125 MB. CRCs and PDF header are checked. ZIP `../` traversal and drive-root paths are rejected. Structured JSON/CSV files are limited to 15 MB/10,000 records. The interfaces HTML-escape imported strings. Bulk backup/export is memory-intensive on small devices.

## Limitations (not simulated)

ExamOS 1.0 is an initial production-buildable, *functional foundation*, **not a fully complete implementation of every advanced requested feature**. In particular:

- PDF.js provides page canvases, continuous finger scrolling and a touch-draggable fast-scroll rail (version 1.5), but **does not yet provide PDF page thumbnails, in-PDF text highlights, handwritten ink annotations, OCR, PDF annotation export, or two-page spread mode**. Text search is only available for PDFs with selectable embedded text. The high-page-count virtual reader keeps near-viewport canvases and re-renders far pages on demand. Scanned PDFs remain images; no OCR is claimed.
- The notes editor stores plain text including Markdown/LaTeX source, but is **not** a complete rich-text editor with tables, inline images and visual mind maps. PDF output is via the browser's Print → Save as PDF.
- Exam history automatically grades only supported objective answers; derivations/long written answers require manual assessment. The exam currently offers pause on all practice templates, which does **not** imply the real exam permits it. Exam questions must be authored/imported, never fabricated.
- There is no continuous cross-device sync or remote backup. Large imported files might exceed quota or available RAM. PDF.js uses its own dedicated worker; ZIP decompression uses a separate Web Worker.
- Full background-processing, virtualized lists, device-specific gesture verification and all device matrix tests have not been completed. Some lists are capped/paginated in the UI; richer virtual scrolling is future work.
- Stopping a session saves elapsed time. A hard browser crash before stopping will lose that particular running timer, without deleting previously saved records.

## Testing record

Validated with `npm test` (deterministic grading, chapter completion, flashcard scheduler and seeded subjects), Node 22 syntax checks, `npm run build`, ZIP source verification and output integrity. Automated browser integration testing was **attempted** in the execution environment but navigation to local URLs was blocked by administrator network policy (`ERR_BLOCKED_BY_ADMINISTRATOR`); that is a test-environment limitation, not a passing browser check. Real Android Chrome, tablet landscape/portrait, microphone permissions, native PDF viewer interoperability and live offline-install workflows **still need device acceptance testing** before a production sign-off.

## Suggested later engineering phases

1. Replace native PDF embed with locally bundled **PDF.js** for page render canvases, searchable text layer, thumbnails, zoom, two-page mode, and page annotations.
2. Introduce robust data schema validation and export/restore transaction integrity; stream big backups and imports where feasible.
3. Expand manual grading rubrics, reporting, virtual scrolling, keyboard accessibility and collaborative document provenance.
4. Complete Chrome/Android/tablet/PWA end-to-end matrix and storage-pressure tests.

**Security notice:** Never commit student PDFs, textbook files, exam papers, recordings or local backup exports to a public deployment repository without rights to redistribute them.

## GitHub source release and limitations

See [`docs/GITHUB_AND_RENDER.md`](docs/GITHUB_AND_RENDER.md) for repository initialization, GitHub Actions and deployment; see [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md) for the v1.1 delta and known feature gaps; see [`docs/QA_CHECKLIST.md`](docs/QA_CHECKLIST.md) for pending Android/tablet/offline acceptance testing.

Code is a functional offline-first foundation, **not a finished full PDF.js authoring suite**. The PDF view delegates to the browser PDF plugin and may not render inline on all Android versions. Browser-driven end-to-end tests are not yet completed. Full local study functionality requires current Chrome, microphone permission for oral recording, and available browser quota.

Third-party open-source notices: [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). Verification evidence: [`docs/VERIFICATION_REPORT.md`](docs/VERIFICATION_REPORT.md).


## Private PDF vault (v1.3)

ExamOS is a **public static website**; there is no server-side login, backend, private file server, or cloud synchronization. To protect uploaded lecture content, create a local passphrase on first use. The passphrase derives a nonextractable AES-256-GCM key with PBKDF2 SHA-256 (310,000 iterations, random 128-bit salt). PDFs are authenticated with per-document 96-bit IVs and stored encrypted in IndexedDB. The key remains only in the active tab's memory and is forgotten on refresh or manual Lock. The reader temporarily decrypts each document to a revocable object URL.

**What is and is not protected:** Document PDF contents are encrypted at rest. Filenames, chapter indexes, study notes, exam history, microphone recordings, and other metadata **are not encrypted at rest**; the app's local passphrase screen is not a server authentication system and does not protect against a compromised device, browser extensions, or malicious scripts. Keep your browser/device secure. Use a unique long passphrase. Password recovery is impossible without the original passphrase.

### Import your 81 personal course PDFs

1. Keep `ExamOS_TUHH_81_Private_PDFs_One_Time_Import.zip` outside public GitHub/Render. It is **not encrypted** before import.
2. On `https://examos-tuhh.onrender.com` on your own device, create a private PDF vault passphrase (at least 12 characters).
3. Open **Document library** → **Import private course ZIP / PDF** → choose the private ZIP file. The browser categorizes and encrypts the PDFs without sending originals to any server.
4. Import once *on each browser/device*: IndexedDB is not shared between devices. The ZIP is about 188 MiB, and some mobile devices may lack enough RAM/storage for one import. If an all-in-one import fails, import the five smaller private subject ZIPs instead.
5. Make a secure offline backup, keep the vault passphrase, and request persistent browser storage under Settings. The backup exports encrypted PDF bytes, but other saved activity is in cleartext; store backups safely.

**Copyright:** Recovered lectures, archived exams and book chapters may be copyright protected. Original PDFs, private ZIPs, passwords, and backup data are excluded from the public repository and Render deployment. Only use them for authorized personal study.

## v1.5 touch PDF reading
- Open a private lecture PDF and **swipe directly on the page** to read vertically across consecutive pages. No sidebar is required.
- Drag the **right-side vertical page slider** up/down to quickly scrub across a long document. Page numbers follow the thumb; the rail supports keyboard arrow, Home/End and Page Up/Down.
- Tap **↕ Scroll mode** to switch to the alternative single-page viewer; use Previous/Next or the page field in either mode.
- Only pages near the visible viewport are rendered as canvases. Distant page canvases are released, reducing tablet/Android memory use.
- All PDF bytes remain private and encrypted at rest. There is no PDF upload to Render or GitHub, and old imported PDFs do not need re-importing.

**QA:** Node unit tests cover slider boundary math, lazy render wiring, vault encryption and the existing reader. Test swiping and large-PDF memory behavior on your own Android/tablet before relying on it for exams.