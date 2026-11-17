# Theme registry

Both presentations use the shared `../../projects.json`, `/assets/cover-*.svg`, and `/api/inquiries` backend. Only visual layout files vary. Visitors can choose an appearance using the fixed **Theme** selector; preference persists in browser local storage. Direct URLs remain shareable:

- **Industrial:** `/`
- **Studio:** `/themes/studio/index.html`

The default homepage honors a previously selected theme preference. To open Industrial explicitly, choose it from the switcher. Deep links using `?project=<project-id>` continue to work in both designs.

## Add another theme

1. Create `themes/<new-id>/index.html`, `styles.css`, and `app.js` (or adapt one of the existing presentations).
2. Include `<html data-portfolio-theme="<new-id>">`, the shared `/themes/switcher.css` and `/themes/switcher.js`, plus your theme-specific stylesheet and application script.
3. Load `/projects.json` and `/assets/cover-<id>.svg` from the shared public root; submit inquiries to `/api/inquiries` without duplicating records or server code.
4. Add `{ "id": "<new-id>", "label": "New Theme", "url": "/themes/<new-id>/index.html", "description": "..." }` to `themes/manifest.json`.
5. Run `npm test && npm run check`, and check desktop/mobile layout, the selector, project deep links, and the inquiry form.

The server is framework-free, so no bundler, migration or dependency install is needed. Keep any visitor-specific design preference client-side; confidential inbox data must remain on the server.
