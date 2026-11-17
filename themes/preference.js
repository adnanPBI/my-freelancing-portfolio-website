/* Honor any saved theme registered in the shared presentation manifest. */
(() => {
  try {
    const saved = localStorage.getItem('engineering-portfolio-theme');
    if (!saved || saved === 'industrial' || !['/', '/index.html'].includes(location.pathname)) return;
    fetch('/themes/manifest.json', { cache: 'no-cache' })
      .then(response => response.ok ? response.json() : null)
      .then(config => {
        const selected = config?.themes?.find(theme => theme.id === saved);
        if (!selected || typeof selected.url !== 'string' || !selected.url.startsWith('/') || selected.url.startsWith('//')) return;
        const url = new URL(selected.url, location.origin);
        if (url.origin !== location.origin || url.pathname === location.pathname) return;
        url.search = location.search;
        if (location.hash === '#contact') url.hash = '#contact';
        location.replace(url.href);
      })
      .catch(() => {});
  } catch { /* Storage restrictions should never block the default presentation. */ }
})();
