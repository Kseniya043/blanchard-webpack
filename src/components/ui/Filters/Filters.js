import {
  CreateAccordion, CreateBtnDrawer,
} from '@/components/ui/Filters/UiCreators';
import InputRange from '@/components/ui/Filters/InputRange/InputRange';
import CheckList from '@/components/ui/Filters/CheckList/CheckList';
import GetLabels from '@/components/ui/Filters/GetLabels';
import { throttleOnce } from '@/js/utils';

export default class Filters {
  constructor() {
    this.filters = document.querySelector('.filters');
    if (!this.filters) return;

    this.filterItems = [...this.filters.querySelectorAll('.filter:not(.filter_all):not(.filter_clear)')];

    this.filterAll = this.filters.querySelector('.filter_all');

    // Bind
    this.setLabel = this.setLabel.bind(this);
  }

  init() {
    if (!this.filters) return;
    this.createAccordion();
    this.createDrawers();
    this.initFilterTypes();
    this.intersectionObserver();

    this.filterItems.forEach(this.setLabel);

    // Открытие "все фильтры"
    this.filterAll.addEventListener('modal:beforeOpen', () => {
      if (Filters.isMobile()) { // Если мобилка переделываем модал меню в модал дравер
        this.filterItems.forEach((filter) => {
          const modal = filter.querySelector('.my-modal');
          modal.classList.remove('my-modal_menu');
          modal.classList.add('my-modal_drawer');
        });
      } else {
        this.filterItems.forEach((filter) => {
          // Если НЕ мобилка переносим контент фильтра из модалок в аккордион
          const bodyContent = [...filter.querySelector('.my-modal__body').children][0];
          const { filterName } = filter.dataset;
          const accordionItem = this.filterAll.querySelector(`.accordion [data-filter-name="${filterName}"]`);
          const accordionContent = accordionItem.querySelector('.accordion__body-content');
          accordionContent.append(bodyContent);
        });
      }
    });

    // Закрытие "все фильтры"
    this.filterAll.addEventListener('modal:beforeClose', () => {
      if (Filters.isMobile()) { // Если мобилка переделываем модал дравер в модал меню
        this.filterItems.forEach((filter) => {
          const modal = filter.querySelector('.my-modal');
          setTimeout(() => { // сетТаймаут убирает лаг с анимацией
            modal.classList.add('my-modal_menu');
            modal.classList.remove('my-modal_drawer');
          }, 300);
        });
      } else {
        // Если НЕ мобилка возращаем контент из аккордиона в модалки
        const accordionItems = [...this.filterAll.querySelectorAll('.accordion__item')];
        accordionItems.forEach((item) => {
          const bodyContent = [...item.querySelector('.accordion__body-content').children][0];
          const { filterName } = item.dataset;
          const filter = this.filterItems.find((el) => el.dataset.filterName === filterName);
          const modalBody = filter.querySelector('.my-modal__body');
          modalBody.append(bodyContent);
        });
      }
    });

    this.filters.addEventListener('modal:reset', (e) => {
      const filterContent = e.target.querySelector('.my-modal__body').children;
      filterContent[0].dispatchEvent(new Event('filter:reset', { bubbles: true }));
    });

    this.filters.addEventListener('modal:beforeClose', (e) => {
      const filter = e.target.closest('[data-filter-name]');
      if (!filter) return;

      if (filter !== this.filterAll) this.setLabel(filter);
      else this.filterItems.forEach(this.setLabel);
    });

    this.filters.addEventListener('modal:afterClose', (e) => {
      const modal = e.target;
      const inputs = [...modal.querySelectorAll('input:not(.filter__input-skip)')];
      const state = inputs
        .filter((input) => (input.type === 'checkbox' && input.checked) || (input.type === 'text'))
        .map((input) => ({ name: input.name, value: input.value }));
      console.log(JSON.stringify(state));
      this.filters.dispatchEvent(new Event('filter:submit'));
    });

    this.filterAll.addEventListener('change', (e) => {
      const filter = e.target.closest('[data-filter-name]');
      this.setLabel(filter);
    });

    this.filters.addEventListener('click', (e) => {
      const btnReset = e.target.closest('.filter__btn-clear');
      const btnResetAll = e.target.closest('.filter_clear');

      if (btnReset) {
        e.preventDefault();
        e.stopPropagation();

        const filter = e.target.closest('.filter');
        const filterContent = filter.querySelector('.my-modal__body').children;
        filterContent[0].dispatchEvent(new Event('filter:reset', { bubbles: true }));
        this.setLabel(filter);
      } else if (btnResetAll) {
        this.filterItems.forEach((filter) => {
          const filterContent = filter.querySelector('.my-modal__body').children;
          filterContent[0].dispatchEvent(new Event('filter:reset', { bubbles: true }));
          this.setLabel(filter);
        });
      }
    });
  }

  intersectionObserver() {
    if (Filters.isMobile()) return;

    const options = {
      root: this.filters,
      rootMargin: '0px -140px 0px 0px',
      threshold: 0,
    };

    const callback = (entries) => {
      entries.forEach((el) => {
        if (el.intersectionRatio < 1) el.target.style.display = 'none';
      });
    };

    const observer = new IntersectionObserver(callback, options);

    const init = () => {
      this.filterItems.forEach((el) => {
        el.style.display = null;
        observer.unobserve(el);
      });

      this.filterItems.forEach((el) => observer.observe(el));
    };

    init();

    window.addEventListener('resize', throttleOnce(init));
    this.filters.addEventListener('filter:reset', throttleOnce(init));
    this.filters.addEventListener('filter:submit', throttleOnce(init));
  }

  setLabel(filter) {
    const { filterName, filterType } = filter.dataset;
    const filterContent = this.filters.querySelector(`[data-filter-name=${filterName}] .${filterType}`);

    let labelValue;
    if (filterType === 'check-list') labelValue = GetLabels.checkboxList(filterContent);
    if (filterType === 'input-range') labelValue = GetLabels.inputRange(filterContent);

    const labelContainers = document.querySelectorAll(`[data-filter-name="${filterName}"] [data-filter-label]`);

    labelContainers.forEach((el) => {
      const isAccordion = el.closest('.accordion');
      const isBtn = el.closest('.filter__btn');
      const isBtnDrawer = el.closest('.btn-drawer');

      if (isAccordion || isBtnDrawer) {
        if (labelValue) {
          el.innerText = `Выбранно: ${labelValue}`;
        } else {
          el.innerText = '';
        }
      }

      if (isBtn) {
        if (labelValue) {
          isBtn.classList.add('filter__btn_checked');
          el.innerText = `: ${labelValue}`;
        } else {
          isBtn.classList.remove('filter__btn_checked');
          el.innerText = '';
        }
      }
    });
  }

  initFilterTypes() {
    // Запускает фильтры input-range
    const inputRangeArr = [...this.filters.querySelectorAll('.input-range')];
    inputRangeArr.forEach((el) => {
      const inst = new InputRange(el);
      inst.init();
    });

    // Запускает фильтры check-list
    const checkListArr = [...this.filters.querySelectorAll('.check-list')];
    checkListArr.forEach((el) => {
      const inst = new CheckList(el);
      inst.init();
    });
  }

  createAccordion() {
    const content = this.filterItems.map((filter) => ({
      name: filter.querySelector('.filter__btn-name').innerText,
      filterType: filter.dataset.filterType,
      filterName: filter.dataset.filterName,
    }));

    const accordion = CreateAccordion(content);

    this.filterAll.querySelector('.my-modal__body').append(accordion);
  }

  createDrawers() {
    const content = this.filterItems.map((filter) => ({
      name: filter.querySelector('.filter__btn-name').innerText,
      filterType: filter.dataset.filterType,
      filterName: filter.dataset.filterName,
      myModal: filter.querySelector('.filter__btn').dataset.myModal,
    }));

    const btnDrawers = CreateBtnDrawer(content);

    this.filterAll.querySelector('.my-modal__body').append(btnDrawers);
  }

  static isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }
}
