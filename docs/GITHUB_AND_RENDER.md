# GitHub + Render deployment — exact procedure

1. Sign in to GitHub as **Eric9435** and create **a new private repository named `ExamOS`**. Do not initialize with a README or .gitignore: those already exist in this source release.
2. On your local computer after extracting the project, in the `ExamOS` folder:

```bash
git init -b main
git add .
git commit -m "Release ExamOS 1.1 — offline TUHH exam preparation"
git remote add origin https://github.com/Eric9435/ExamOS.git
git push -u origin main
```

   GitHub may ask you to sign in through your configured credential helper. Never commit login tokens.
3. Run `npm install`, `npm test`, `npm run build` locally before pushing. GitHub Actions also runs tests and builds on push.
4. Connect `Eric9435/ExamOS` to Render → **New → Static Site**. Set:

```
Build command: npm install && npm run build
Publish directory: dist
```

   Alternatively Render can use the included `render.yaml` Blueprint configuration.
5. Once deployed, open the HTTPS URL in Chrome, then install as a PWA; import your **private** course PDFs in the app. ExamOS does not copy those PDFs to Render or GitHub.

If you have only the supplied local Git bundle, you can clone it instead of the extracted source:

```bash
git clone ExamOS-v1.1.bundle ExamOS
cd ExamOS
git remote set-url origin https://github.com/Eric9435/ExamOS.git
git push -u origin main
```

Do not upload `ExamOS_Private_*.zip`, backups, lecture material or recordings to the repository. The `.gitignore` excludes the intended private file naming patterns.