import FilterState from '@/components/ui/Filters/FilterState';
import {
  changeAllId,
  CreateAccordion, CreateBtnDrawer,
} from '@/components/ui/Filters/UiCreators';
import InputRange from '@/components/ui/Filters/InputRange/InputRange';
import CheckList from '@/components/ui/Filters/CheckList/CheckList';

export default class Filters {
  constructor() {
    this.filters = document.querySelector('.filters');
    if (!this.filters) return;

    this.filterItems = [...this.filters.querySelectorAll('.filter:not(.filter_all)')];

    this.filterAll = this.filters.querySelector('.filter_all');
  }

  init() {
    this.initProxyState();

    console.log('FilterState', window.filter = FilterState);

    this.createAccordion();
    this.createDrawers();
    this.initFilterTypes();
  }

  initProxyState() {
    this.filterItems.forEach((filter) => {
      const inputs = [...filter.querySelectorAll('input:not(.filter__input-skip)')];

      const obj = {};
      inputs.forEach((input, i) => {
        const key = `input[${i}]`;
        // const key = input.name;

        obj[key] = {
          name: input.name, value: input.value, type: input.type, checked: input.checked,
        };

        if (input.nextElementSibling.tagName === 'LABEL') {
          obj[key].label = input.nextElementSibling.innerText;
        }
      });
      obj.type = filter.dataset.filterType;

      FilterState[filter.dataset.filterName] = obj;
    });

    this.filters.addEventListener('change', (e) => {
      // console.log(e);
      // if (!e.isTrusted) return;

      const {
        name, value, checked, type,
      } = e.target;

      Object.keys(FilterState).forEach((k1) => {
        Object.keys(FilterState[k1]).forEach((k2) => {
          const hasName = FilterState[k1][k2].name === name;
          const hasValue = FilterState[k1][k2].value === value;

          if (type === 'text' && hasName) FilterState[k1][k2].value = value;
          else if (hasValue && hasName) FilterState[k1][k2].checked = checked;
        });
      });
    });
  }

  initFilterTypes() {
    const inputRangeArr = [...this.filters.querySelectorAll('.input-range')];
    inputRangeArr.forEach((el) => {
      const inst = new InputRange(el);
      inst.init();
    });

    const checkListArr = [...this.filters.querySelectorAll('.check-list')];
    checkListArr.forEach((el) => {
      const inst = new CheckList(el);
      inst.init();
    });
  }

  createAccordion() {
    const content = this.filterItems.map((filter) => (
      filter.querySelector('.filter__modal.my-modal_menu .my-modal__body > div').cloneNode(true)
    ));

    const accordion = CreateAccordion([...content]);

    changeAllId(accordion);

    this.filterAll.querySelector('.my-modal__body').append(accordion);
  }

  createDrawers() {
    const btnDrawers = document.createElement('div');
    btnDrawers.classList.add('btn-drawers');

    this.filterItems.forEach((filter) => {
      const modalMenu = filter.querySelector('.filter__modal.my-modal_menu');

      // Клонируем my-modal_menu и превращаем в my-modal_drawer
      const modalDrawer = modalMenu.cloneNode(true);
      modalDrawer.classList.remove('my-modal_menu');
      modalDrawer.classList.add('my-modal_drawer');
      modalDrawer.id = `${modalDrawer.id}-drawer`;

      // Меняем id у инпутов и лэйблов
      changeAllId(modalDrawer);

      // Вставлем после модал меню
      modalMenu.after(modalDrawer);

      // Создаем кнопки вызывающие дроверы
      const btn = CreateBtnDrawer(
        modalDrawer.id,
        filter.querySelector('.filter__btn-name').innerText,
        filter.querySelector('.filter__btn-count').innerText,
      );

      btnDrawers.append(btn);
    });

    this.filterAll.querySelector('.my-modal__body').append(btnDrawers);
  }

  static isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }
}
