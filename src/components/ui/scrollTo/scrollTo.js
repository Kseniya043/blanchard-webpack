document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-scroll]')?.dataset.scroll;
  if (!target) return;

  e.preventDefault();

  const targetEl = document.querySelector(target);
  if (!targetEl) return;

  const distanceToEl = targetEl.getBoundingClientRect().top;
  const documentScrollTop = document.documentElement.scrollTop;
  const navbarHeight = 0;

  const scrollTo = distanceToEl + documentScrollTop - navbarHeight;

  document.documentElement.scrollTo({ top: scrollTo, behavior: 'smooth' });
});
