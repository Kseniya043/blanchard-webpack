document.addEventListener('DOMContentLoaded', () => {
  const uiContainer = document.querySelector('#ui-container');
  if (!uiContainer) return;
  const tabs = uiContainer.querySelectorAll('.tab');

  uiContainer.addEventListener('click', (e) => {
    const tabNum = e.target.dataset?.tab;
    if (!tabNum) return;
    const tabTarget = uiContainer.querySelector(`.tab-${tabNum}`);

    tabs.forEach((element) => {
      const el = element;
      el.style.display = 'none';
    });

    tabTarget.style.display = 'block';
  });
});
