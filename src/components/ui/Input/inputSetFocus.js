document.addEventListener('focusin', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    e.target.closest('.input')?.classList.add('focus');
  }
});

document.addEventListener('focusout', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    e.target.closest('.input')?.classList.remove('focus');
  }
});
