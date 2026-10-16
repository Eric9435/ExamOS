# Device acceptance test checklist — ExamOS 1.1

Build/CI verification runs automatically on GitHub after repository creation. The following tests need real devices or a permitted web-browser environment.

- [ ] Android Chrome: launch, install prompt, reopen from home screen
- [ ] 11-inch tablet portrait: usable bottom navigation, all five subjects visible
- [ ] 11-inch tablet landscape: controls fit; modal scroll, keyboard, accessibility
- [ ] Desktop Chrome: light/dark mode, responsive window resizing
- [ ] Import a text-based PDF and verify reader, page number, notes, bookmarks
- [ ] Import a ZIP with several PDFs and confirm subject matching
- [ ] Reject malformed PDF, corrupted ZIP, path traversal and oversize archives gracefully
- [ ] New MCQ/numeric/multi-select questions; automatic grading and mistake records
- [ ] Start timed mock exam; refresh; confirm draft resumes with answers/timer
- [ ] Submit exam; confirm history and deletion of active draft
- [ ] Oral recording with permission; preview; navigate questions; save self-score
- [ ] Flashcard Again/Hard/Good/Easy scheduling after refresh
- [ ] Formula MathJax typesetting online; cache; verify offline behavior
- [ ] Local JSON backup → separate browser/profile → restore; compare PDFs and audio
- [ ] Go offline after install; reopen app, use IndexedDB data, check offline cache
- [ ] Verify browser quota warnings and persistent-storage request
- [ ] Test large, valid 50–100 MB PDF and large ZIP memory behavior

**Not yet signed off:** none of the above device tests should be marked complete until someone performs them. Document device/browser versions and failures.