# Deployment checklist — Adnan Industrial Portfolio

**Scope:** distinct second portfolio, not a replacement for the original deployed site. There is no hosting URL included in this source; do not invent one.

1. Run `npm test && npm run check`. Review `projects.json` and verify permission to publish each item.
2. Choose a VPS, container host or other Node.js 22.13+ service with a **persistent disk**. This application has a server-backed form and inbox; it is not a static HTML-only package.
3. Provision HTTPS and a secure domain; terminate TLS through a trusted proxy. Set `HOST=0.0.0.0` as appropriate and let the platform choose PORT.
4. Set `ADMIN_TOKEN` in the host's secret manager to a unique random value of at least 16 characters, not checked into source; set `DATA_DIR` to a backed-up persistent path.
5. Start `node server.js` using a managed process or container service. Proxy public HTTPS requests to the configured port. Never serve the source or persistent data directory as public static files.
6. Test homepage, all 59 project covers, filtering, mobile menu, deep-link modals, inquiry submission, authenticated admin read, CSV export, bad-token rejection, consent validation and unexpected URL rejection.
7. Configure database backups, limits on data retention, monitoring and legitimate administrator access. This version stores inbox records only, and **does not email notifications**.
8. Confirm permissions/rights, privacy notice, accessibility, mobile breakpoints and published case statuses before sharing with paying clients.

For a **read-only static review**, publish `index.html`, `styles.css`, `app.js`, `projects.json` and the `/assets` directory at the site root, but **disable or replace the inquiry form** because `/api/inquiries` is unavailable on static hosting. This review package does not pretend otherwise.
