# Multi-theme portfolio deployment

Deploy Node.js 22.13+ on a managed host with HTTPS and a durable disk. The repository is both frontend and backend; do not deploy it as a static-only site if you need the inquiry inbox.

1. Run `npm run check && npm test` before release.
2. Keep `.env` and `ADMIN_TOKEN` private. Provide a random secret with 16 or more characters; never embed it in HTML or JavaScript served to clients.
3. Set `DATA_DIR` to a backed-up, durable path. The SQLite inquiry file must not be lost across redeployments.
4. Start the service with `node server.js` and proxy HTTPS traffic to the configured `HOST` and `PORT`.
5. Confirm `/`, `/themes/studio/index.html`, `/themes/manifest.json`, `/projects.json`, `/assets/`, and `/admin.html` behave as expected. Keep `/api/admin/*` authenticated.
6. Test both theme choices, persistence on revisit, project deep links, keyboard navigation, category filters, inquiry submission and admin read/delete/export. Verify mobile layouts at 320px and 390px.
7. Keep deployment backup/retention, privacy and security policies reviewed before publicizing the site. No automatic inquiry-email notification is included.

**Static-only preview:** the two presentations and catalog can be served from a static host, but the inquiry form will not save without the Node.js backend. Disable the form for static preview or provide a real API. Do not claim successful submissions when no inbox is connected.
