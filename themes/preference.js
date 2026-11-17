/* The default landing page honors a visitor's saved appearance choice. */
(() => {
  try {
    const saved = localStorage.getItem('engineering-portfolio-theme');
    if (saved === 'studio' && (location.pathname === '/' || location.pathname === '/index.html')) {
      const url = new URL('/themes/studio/index.html', location.origin);
      url.search = location.search;
      if (location.hash === '#contact') url.hash = '#contact';
      location.replace(url.href);
    }
  } catch { /* Storage restrictions should never block the site. */ }
})();
