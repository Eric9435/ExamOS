# ExamOS security and data protection

- **Local-first design:** no login, backend, metrics collector, third-party AI endpoint, or student-data upload is present in ExamOS. The deployed static website contains app code only, not your private PDFs or backups.
- **Uploads:** files are limited by size and basic PDF header validation. ZIP entries are checked against path traversal and limits on entry count, individual size and aggregate uncompressed size. The decompressor runs in a dedicated worker.
- **HTML:** user-entered text is HTML-escaped before being inserted in DOM templates; text and JSON imports do not execute scripts. Avoid importing unknown backups from untrusted parties.
- **Storage:** IndexedDB is local to the browser origin. It is not encrypted independently by ExamOS, and other people with access to an unlocked browser profile may read it. Use an OS account lock and disk encryption.
- **Backups:** full JSON exports contain **all** lecture PDFs, oral recordings, notes, answers and personal history. Treat backups as private and store them safely. They may be very large.
- **Offline:** the service worker caches only static application resources; user-uploaded documents are stored in IndexedDB. Cache storage can be evicted by the browser.
- **Limited verification:** static analysis/unit tests and builds are repeatable in CI. An independent professional penetration test, Android device matrix, PDF mutation-fuzzing and end-to-end browser testing have not been completed.

If distributing or publishing a fork, review the service-worker scope, Content Security Policy, MathJax/JSZip versions, and dependencies. No keys should be checked into source control.


### Local encrypted PDF vault (v1.3)
PDF binary content is encrypted in the user's browser with Web Crypto AES-GCM before IndexedDB persistence. Browser-derived keys are never committed, uploaded or transmitted. A fresh passphrase is needed on each refresh. Raw PDF bytes can exist transiently in browser memory/renderer as required for viewing, and the user-supplied import ZIP is itself unencrypted. Filenames, notes, chapter progress, exam history, and oral recordings are currently not encrypted at rest, and the login-like local vault gate is not a remotely verified user account. No multi-device sync is provided. Strong device security and offline backups are essential.