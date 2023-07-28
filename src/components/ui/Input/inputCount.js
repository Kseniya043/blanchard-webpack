(function _() {
  const clickHandler = (e) => {
    const inputCount = e.target.closest('.input_count');

    if (!inputCount) return;

    const input = inputCount.querySelector('input');
    const value = () => +input.value.replace(/[^\d-]/g, '');

    const clickOnPlus = e.target.closest('.input__plus');
    const clickOnMinus = e.target.closest('.input__minus');

    if (!clickOnPlus && !clickOnMinus) return;

    if (clickOnMinus) input.value = value() <= 0 ? 0 : value() - 1;
    if (clickOnPlus) input.value = value() >= 999 ? 999 : value() + 1;

    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  document.addEventListener('click', clickHandler);
}());
