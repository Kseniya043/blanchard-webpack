const eventInput = new Event('input', { bubbles: true });

// Функция закрывающая селект при клике вне селекта // TODO name fn
const closeActiveSelect = () => {
  const select = document.querySelector('.select.active');
  if (!select) return;
  select.classList.remove('active');

  const isSelectSearch = select.classList.contains('select_search');
  const input = select.querySelector('input');

  // Сбрасываем строку поиска и возращаем последний выбранный вариант
  if (isSelectSearch) {
    input.value = select.querySelector('.select__item input:checked + label')?.innerText || '';
    input.dispatchEvent(eventInput);
  }
};

// Открывает\закрывает селект
const toggleDropdown = (select) => {
  select.classList.toggle('active');
};

// Открывает селект
const openDropdown = (select) => {
  select.classList.add('active');

  const items = select.querySelector('.select__dropdown').children;
  [...items].forEach((item) => { item.style.display = null; });
};

// Продолжение обработчика ввода в поиск если у поиска action = #
const inputHandlerLocal = (e, select) => {
  const items = select.querySelector('.select__dropdown').children;

  [...items].forEach((item) => {
    const val = e.target.value.toLowerCase();
    const itemVal = item.textContent.trim().toLowerCase();

    if (!itemVal.includes(val)) item.style.display = 'none';
    else item.style.display = null;
  });
};

const selectItemTemplate = (values = [{}]) => {
  const res = values.map((el) => {
    const random = Math.floor(Math.random() * 666666);
    return `
      <div class="select__item">
        <input type="radio" name="name-test[]" id="${random}" value="${el.value}">
        <label for="${random}">${el.label}</label>
      </div>
    `;
  }).join('');

  return res;
};

// Продолжение обработчика ввода в поиск если у поиска есть action с url
const inputHandlerRemote = async (e, select, url) => {
  const res = await fetch(url);
  const json = await res.json();

  const dropDown = select.querySelector('.select__dropdown');
  dropDown.innerHTML = selectItemTemplate(json);
};

// Обработчик ввода в поиск селекта
const inputHandler = async (e) => {
  const select = e.target.closest('.select_search');
  const inputSearch = e.target.closest('.input_search');

  // Фильтруем события, нужны только если это
  // внутри .select_search, .input_search
  // и сгенерировано пользователем, а не js
  if (!select || !inputSearch || !e.isTrusted) return;

  const form = select.querySelector('form');
  const action = form.getAttribute('action');

  // Если action начинается с # или пустой
  if (/^#/.test(action) || !action) {
    inputHandlerLocal(e, select);
  } else {
    await inputHandlerRemote(e, select, form.action);
  }
};

// Обработчик кликов по селекту
const clickHandler = (e) => {
  const select = e.target.closest('.select');
  closeActiveSelect();
  if (!select) return;
  const isSelectSearch = select.classList.contains('select_search');
  const input = select.querySelector('input');

  const clickOnInput = e.target.closest('.input');
  const clickOnClear = e.target.closest('.input__btn-clear');
  const clickOnLabel = e.target.closest('.select__dropdown label');

  // Открытие списка
  if (clickOnInput) {
    if (isSelectSearch) openDropdown(select); // Если есть поиск
    else toggleDropdown(select); // Если нет поиска
  }

  // Сброс выбранного варианта
  if (clickOnClear) {
    const checked = select.querySelector('.select__item input:checked');
    if (checked) checked.checked = false;
  }

  // Клик по варианту селекта
  if (clickOnLabel) {
    input.value = e.target.innerText;
    input.dispatchEvent(eventInput);
    toggleDropdown(select);
  }
};

document.addEventListener('input', inputHandler);
document.addEventListener('click', clickHandler);
