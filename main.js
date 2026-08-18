(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const mobileBtn = document.querySelector('[data-menu]');
  const nav = document.querySelector('[data-nav]');
  if (mobileBtn && nav) mobileBtn.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const current = path === '/' ? '/' : path;
  document.querySelectorAll('[data-nav] a[data-route]').forEach(a => {
    const route = a.getAttribute('data-route');
    if (route && (current === route || current.startsWith(route + '/'))) a.classList.add('active');
  });
})();
