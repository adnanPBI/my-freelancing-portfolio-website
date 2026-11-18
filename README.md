# Engineering Portfolio — Multiple Themes

A full-stack, responsive portfolio showcasing **59 project dossiers across eight engineering disciplines**. The AI & Computer Vision catalog includes the evidence-backed **GazeSpace Studio 0.2.1** Windows eye-tracking case study (upgraded in place from the original gaze-calibration entry). Two original visual presentations can be switched without changing content or duplicating inquiry data.

## Available themes

- **Industrial** (default): technical editorial design, metallic accents, large typographic sections and engineering illustrations. URL: `/`.
- **Studio**: the original interface-led portfolio with luminous accents, interactive dashboard artwork and project panels. URL: `/themes/studio/index.html`.

Both provide the same project index, filtering, search, category browsing, project dossiers and contact form. Use the **Theme** selector at the lower-left. Preference is retained on the visitor's device. Future themes are registered in `themes/manifest.json`; see `themes/README.md`.

## Source map

| Path | Responsibility |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Industrial presentation (default) |
| `themes/studio/` | Studio presentation, self-contained HTML/CSS/JS |
| `themes/manifest.json` | Registry of available presentations |
| `themes/switcher.*` | Shared accessible theme selector |
| `themes/preference.js` | Redirect to any previously selected registered theme |
| `projects.json` | Single source of truth for all 59 cases |
| `assets/` | Shared illustrations, favicon, hero art and social image |
| `server.js` | HTTP server and SQLite inquiry API |
| `admin.html`, `admin.js` | Protected inbox admin client |
| `tests/` | API, content, privacy and theme regression checks |

## Run

Node.js **22.13+** required (Node 24 recommended). No npm install is necessary.

```bash
npm run check
npm test
npm start
```

Visit `http://127.0.0.1:3000` for Industrial, then choose **Studio** from the Theme selector. Direct theme links are available for review. The form submits to `/api/inquiries` and stores entries in the server-side SQLite database; it does not automatically send email.

To access `/admin.html`, configure `ADMIN_TOKEN` as a server-side secret (16+ random characters), and configure `DATA_DIR` on durable storage. See `.env.example` and `DEPLOYMENT.md`. Avoid running the inquiry backend on an ephemeral filesystem if messages must persist.

## Extend themes

Add a new presentation under `themes/<id>/`, keep `/projects.json` and `/api/inquiries` as shared contracts, and add one manifest item. See `themes/README.md` for the full steps. Existing bookmarks and case-file deep links continue to work.

## Quality and disclosure

Each entry identifies its documented stage. Concept illustrations do not represent verified production screenshots or customer endorsements. Review permission to publish client details, project descriptions and art before sharing commercially. Keep credentials, SQLite files, backups and test data out of Git. The existing repository license is preserved, subject to its terms.

GitHub Actions (`.github/workflows/validate.yml`) runs syntax and test checks on commits and pull requests. A passing build does not imply a production deployment.

## GazeSpace Studio case file

Search **GazeSpace** or select **AI & Computer Vision** in either theme. The existing bookmarked deep link `?project=eye-gaze-calibration-system` is preserved.

The extended case file covers eye/pupil detection, subject-specific 2D/3D calibration, camera SDK adapters, recording/replay, analytics, SDK/API integration, the verified 225-test Windows software gate, four platform matrix jobs and frozen application checks. The corresponding GitHub source and CI evidence are **private and require access**. Physical IR/global-shutter camera performance, human gaze accuracy and client-specific integration are clearly labeled as pending. The cover is illustrative artwork, not a screenshot. Both themes use the shared `projects.json`.
