export const CreateInputRange = (inputs) => {
  const inputRangeUnits = document.createElement('div');
  inputRangeUnits.classList.add('input-range__units');

  const inputRangeInputs = document.createElement('div');
  inputRangeInputs.classList.add('input-range__inputs');

  inputs.forEach((input) => {
    const id1 = Math.floor(Math.random() * 666666);

    if (input.type === 'radio') {
      inputRangeUnits.insertAdjacentHTML(
        'beforeend',
        `
        <div class="radio-btn">
          <input type="radio" name="${input.name}" value="${input.value}" id="${id1}" ${input.checked ? 'checked' : ''}>
          <label for="${id1}">${input.label}</label>
        </div>
      `,
      );
    }

    const id2 = Math.floor(Math.random() * 666666);

    if (input.name === 'priceMin' || input.name === 'priceMax') {
      inputRangeInputs.insertAdjacentHTML(
        'beforeend',
        `
          <div class="input ${input.name === 'priceMin' ? 'input-min' : 'input-max'}">
            <input id="${id2}" name="${input.name}" placeholder=" " value="${input.value}">
            <label class="input__placeholder" for="${id2}">${input.label}</label>
          </div>
        `,
      );
    }
  });

  return `
    <div class="input-range">
      ${inputRangeUnits.outerHTML}
      ${inputRangeInputs.outerHTML}
      <div class="input-range__slider" data-min="0" data-max="6666666"></div>
    </div>
  `;
};

export const CreateCheckList = (inputs) => {
  const checkListItems = inputs.map((input) => {
    const id = Math.floor(Math.random() * 666666);

    return `
      <div class="checkbox checkbox_reverse">
        <input class="checkbox__input" type="checkbox" name="${input.name}" value="0" id="${id}" ${input.checked ? 'checked' : ''}>
        <label class="checkbox__label" for="${id}">${input.label}</label>
      </div>
    `;
  }).join('');

  const id = Math.floor(Math.random() * 666666);

  return `
    <div class="check-list">
      <div class="check-list__search">
        <div class="input input_search">
          <input class="filter__input-skip" id="${id}" placeholder=" ">
          <label class="input__placeholder" for="${id}">Placeholder</label>
          <div class="input__btns">
            <button class="input__btn-clear" type="reset" style="display: none;">
              <svg class="svg-icon icon-clear">
                <use xlink:href="/assets/img/icons/sprite.svg#clear"></use>
              </svg>
            </button>
            <button class="input__btn-search" type="submit">
              <svg class="svg-icon icon-search">
                <use xlink:href="/assets/img/icons/sprite.svg#search"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="check-list__items">
        ${checkListItems}
      </div>
    </div>
  `;
};

export const CreateAccordion = (items) => {
  const accordion = document.createElement('ul');
  accordion.classList.add('accordion');

  const accordionItems = items.map((el) => {
    const item = document.createElement('li');
    item.classList.add('accordion__item');
    item.dataset.filterName = el.filterName;
    item.dataset.filterType = el.filterType;

    item.innerHTML = `
          <div class="accordion__head">
            <div class="accordion__head-content">
              <div class="accordion__head-text"></div>
              <div class="accordion__head-label" data-filter-label></div>
            </div>
            <div class="accordion__icon">
              <svg class="svg-icon icon-plus">
                <use xlink:href="/assets/img/icons/sprite.svg#plus"></use>
              </svg>
            </div>
          </div>
          <div class="accordion__body">
            <div class="accordion__body-content"></div>
          </div>
        `;

    const header = item.querySelector('.accordion__head-text');
    header.innerText = el.name;

    return item;
  });

  accordion.append(...accordionItems);

  return accordion;
};

export const CreateBtnDrawer = (content) => {
  const btnDrawers = document.createElement('div');
  btnDrawers.classList.add('btn-drawers');

  content.forEach((el) => {
    const btn = document.createElement('button');
    btn.classList.add('btn-drawer');
    btn.dataset.myModal = el.myModal;
    btn.dataset.filterName = el.filterName;

    const btnName = document.createElement('span');
    btnName.classList.add('btn-drawer__name');
    const btnCount = document.createElement('span');
    btnCount.classList.add('btn-drawer__count');

    btnName.innerText = el.name;
    btnCount.dataset.filterLabel = '';

    btn.append(btnName, btnCount);

    btnDrawers.append(btn);
  });

  return btnDrawers;
};

export const changeAllId = (parent) => {
  [...parent.querySelectorAll('input[id]')].forEach((el) => {
    const id = el.getAttribute('id');
    const newId = Math.floor(Math.random() * 666666);
    const label = el.parentNode.querySelector(`[for="${id}"]`);

    el.id = newId;
    label.setAttribute('for', newId);
  });
};

export const CreateModalDrawer = (content) => {
  const modalTemplate = (id, name, filterType, filterName) => (`
    <div class="my-modal my-modal_drawer filter__modal" id="${id}" data-filter-name="${filterName}" data-filter-type="${filterType}">
      <div class="my-modal__container">
        <div class="my-modal__head">
          <div class="my-modal__head-back">
            <button class="btn btn_square" data-my-modal="#filterAll">
              <svg class="svg-icon icon-arrow-left">
                <use xlink:href="/assets/img/icons/sprite.svg#arrow-left"></use>
              </svg>
            </button>
          </div>
          <div class="my-modal__head-text">${name}
          </div>
          <div class="my-modal__head-close">
            <button class="btn btn_square" data-my-modal-close="data-my-modal-close">
              <svg class="svg-icon icon-close">
                <use xlink:href="/assets/img/icons/sprite.svg#close"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="my-modal__body">
        </div>
        <div class="my-modal__footer">
          <button class="btn btn_secondary" type="reset" data-my-modal-reset="data-my-modal-reset">Сбросить</button>
          <button class="btn btn_primary" type="submit" data-my-modal-submit="data-my-modal-submit">Применить</button>
        </div>
      </div>
    </div>
  `);

  const res = content.map((el) => modalTemplate(el.myModal.replace(/#/, ''), el.name, el.filterType, el.filterName)).join('');

  document.body.insertAdjacentHTML('beforeend', res);
};

export const temp = {};
