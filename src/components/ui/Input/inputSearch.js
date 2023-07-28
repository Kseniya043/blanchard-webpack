const eventInput = new Event('input', { bubbles: true });

const btnClearToggler = (input, btnClear, btnSearch) => {
  if (input.value) {
    btnClear.style.display = null;
    btnSearch.style.display = 'none';
  } else {
    btnClear.style.display = 'none';
    btnSearch.style.display = null;
  }

  return this;
};

const inputHandler = (e) => {
  if (e.target.tagName !== 'INPUT') return;

  const input = e.target;
  const inputWrap = input.closest('.input');
  if (!inputWrap || !inputWrap.classList.contains('input_search')) return;

  const btnClear = inputWrap.querySelector('.input__btn-clear');
  const btnSearch = inputWrap.querySelector('.input__btn-search');
  btnClearToggler(input, btnClear, btnSearch);
};

const clickHandler = (e) => {
  if (!e.target.closest('.input__btn-clear')) return;

  const btn = e.target;
  const inputWrap = btn.closest('.input');
  const input = inputWrap.querySelector('input');

  input.value = '';
  input.focus();
  input.dispatchEvent(eventInput);
};

document.addEventListener('input', inputHandler);

document.addEventListener('click', clickHandler);
