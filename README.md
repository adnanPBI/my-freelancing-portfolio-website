# Adnan / Engineering for the Real World

**Source:** https://github.com/adnanPBI/my-freelancing-portfolio-website  
**Build status:** `.github/workflows/validate.yml` runs syntax, backend/API and portfolio-integrity tests on push and PR.

The repository includes an existing LICENSE file inherited from the repository. Review its licensing terms before distributing client-specific assets or proprietary code.

A second, ReserveChain-inspired **industrial editorial portfolio** — a wholly original Adnan website design, not a replica or sublicense of ReserveChain content. The design language references the earlier work's institutional visual discipline, metallic material language, precision grids, and evidence-oriented layout. ReserveChain is included only as one clearly labeled case study in the portfolio.

## Includes

- **59 project dossiers** across **eight disciplines**, sourced from the previously created portfolio catalog.
- Six selected technical case files, eight linked specialization categories, and a search/filterable project index.
- Accessible responsive navigation and case file overlays; deep links with `?project=<id>`; Escape and keyboard focus handling.
- Original SVG engineering hero, favicon and OG artwork; existing portfolio-specific SVG covers are reused unchanged.
- Reduced-motion support, animation pause, desktop/tablet/mobile layout styles and SEO metadata.
- A real server-side inquiry API and **protected administrator inbox** with export/delete, backed by Node.js built-in SQLite. No third-party runtime npm dependencies.
- Zero synthetic testimonials, fake metrics or invented project outcomes. All case files label their documented stage and conceptual imagery.

## Run locally

Requires Node.js **22.13+** (Node 24 recommended).

```bash
cp .env.example .env
# Fill ADMIN_TOKEN locally (a long random secret). Do not commit .env.
# Node's built-in --env-file option is available when setting credentials.
HOST=127.0.0.1 PORT=3000 DATA_DIR=./data node --env-file=.env server.js
```

For read-only preview, you can simply run `npm start` (the admin inbox remains locked until a valid `ADMIN_TOKEN` is configured). The inquiry form saves to the local SQLite file `data/inquiries.sqlite`; messages do **not** send email automatically. Do not assume access to inquiries from another device without a shared, durable deployment.

Open `http://127.0.0.1:3000/` and, if configured, the private inbox at `/admin.html`.

## Customize

- `projects.json`: the 59 documented entries. Review every project's stage, wording, rights and portfolio disclosure before public distribution. Never disclose client-private source data or deployment secrets.
- `app.js`: filters, case file overlays, categorized archive and form submit logic.
- `styles.css`: midnight/navy, muted bronze and warm-cream design system; responsive layout.
- `index.html`: homepage sections, writing and metadata.
- `assets/hero-forge.svg`: original abstract metallic precision artwork.
- `.env.example` / `DEPLOYMENT.md`: environment and hosting requirements.

## Tests

```bash
npm test
npm run check
```

The API test harness uses a temporary database and test token. Visual QA evidence in the companion ZIP was captured using a browser-rendered *inlined copy* of the site, because this environment blocked browser navigation to localhost. The actual Node HTTP server is tested independently. The visual package does **not** claim a live public hosting URL.

## Privacy and limitations

The public project library contains the author's documented projects, implementation work, prototype concepts and technical studies; it is not a set of third-party-verified case studies. The 59 descriptions and SVG cover art came from the prior portfolio source rather than authenticated production product screenshots.

**Important:** Node/SQLite needs a host with durable storage; ephemeral serverless functions alone are unsuitable for retaining inquiry submissions. Before using the site commercially, verify consent language, administrator access, anti-spam measures, data retention, applicable privacy obligations and public project publication rights. Review and remove any confidential information before deployment.
