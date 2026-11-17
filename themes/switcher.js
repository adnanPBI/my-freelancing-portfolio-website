/* Presentation registry: both themes use the same /projects.json and inquiry API. */
const current = document.documentElement.dataset.portfolioTheme;
const mount = () => {
  const control = document.createElement('div');
  control.className = 'theme-dock';
  control.setAttribute('role', 'group');
  control.setAttribute('aria-label', 'Website appearance');
  const label = document.createElement('label');
  label.htmlFor = 'portfolio-theme-select';
  label.textContent = 'Theme';
  const select = document.createElement('select');
  select.id = 'portfolio-theme-select';
  select.setAttribute('aria-label', 'Switch website theme');
  control.append(label, select);
  document.body.appendChild(control);
  return select;
};
async function initThemeSwitch() {
  const select = mount();
  try {
    const response = await fetch('/themes/manifest.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Theme registry unavailable');
    const config = await response.json();
    const themes = config?.themes;
    if (!Array.isArray(themes) || !themes.length) throw new Error('Empty theme registry');
    for (const theme of themes) {
      if (!theme.id || !theme.label || typeof theme.url !== 'string' || !theme.url.startsWith('/') || theme.url.startsWith('//')) continue;
      const option = document.createElement('option');
      option.value = theme.id;
      option.textContent = theme.label;
      option.title = theme.description || theme.label;
      select.appendChild(option);
    }
    select.value = themes.some(t => t.id === current) ? current : (config.default || themes[0].id);
    if (!select.value) select.selectedIndex = 0;
    select.addEventListener('change', () => {
      const selected = themes.find(t => t.id === select.value);
      if (!selected) return;
      try { localStorage.setItem('engineering-portfolio-theme', selected.id); } catch {}
      const url = new URL(selected.url, location.origin);
      if (url.origin !== location.origin) return;
      const project = new URLSearchParams(location.search).get('project');
      if (project) url.searchParams.set('project', project);
      if (location.hash === '#contact') url.hash = '#contact';
      location.assign(url.href);
    });
  } catch (error) {
    select.replaceWith(document.createTextNode('Theme unavailable'));
    console.warn('Theme selector is unavailable:', error.message);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initThemeSwitch, { once: true });
else initThemeSwitch();
