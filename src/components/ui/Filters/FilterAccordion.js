import {
  CreateAccordion, CreateBtnDrawer, CreateModalDrawer,
} from '@/components/ui/Filters/UiCreators';
import InputRange from '@/components/ui/Filters/InputRange/InputRange';
import CheckList from '@/components/ui/Filters/CheckList/CheckList';
import GetLabels from '@/components/ui/Filters/GetLabels';

export default class Filters {
  constructor() {
    this.filters = document.querySelector('.filter-accordion');
    if (!this.filters) return;

    this.submitBtn = this.filters.querySelector('.filter-accordion__submit');

    this.filterItems = [...this.filters.querySelectorAll('.accordion__item:not(.accordion__item_fake)')];

    this.filterAll = this.filters.querySelector('.filter-accordion__all');

    // Bind
    this.setLabel = this.setLabel.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  init() {
    if (!this.filters) return;
    this.initFilterTypes();
    this.createDrawers();
    this.filterItems.forEach(this.setLabel);
    this.resizeHandler();

    this.filters.addEventListener('change', (e) => {
      const filter = e.target.closest('[data-filter-name]');

      if (!Filters.isMobile()) this.submitLabelHandler(e);

      if (!filter) return;
      if (Filters.isMobile() && filter === this.filterAll) return;
      this.setLabel(filter);
    });

    window.addEventListener('resize', this.resizeHandler);

    document.addEventListener('modal:beforeClose', (e) => {
      const filter = e.target.closest('[data-filter-name]');
      if (!filter) return;

      if (filter !== this.filterAll) this.setLabel(filter);
      else this.filterItems.forEach(this.setLabel);
    });

    document.addEventListener('modal:reset', (e) => {
      if (!e.target.closest('[data-filter-name]')) return;
      const filterContent = e.target.querySelector('.my-modal__body').children;
      filterContent[0].dispatchEvent(new Event('filter:reset', { bubbles: true }));
    });

    // TODO
    this.filters.addEventListener('modal:afterClose', (e) => {
      const modal = e.target;
      const inputs = [...modal.querySelectorAll('input:not(.filter__input-skip)')];
      const state = inputs
        .filter((input) => (input.type === 'checkbox' && input.checked) || (input.type === 'text'))
        .map((input) => ({ name: input.name, value: input.value }));
      console.log(JSON.stringify(state));
      this.filters.dispatchEvent(new Event('filter:submit'));
    });

    this.filters.addEventListener('click', (e) => {
      const btnResetAll = e.target.closest('.filter_clear');

      if (btnResetAll) {
        this.filterItems.forEach((filter) => {
          const filterContent = filter.querySelector('.accordion__body-content').children;
          filterContent[0].dispatchEvent(new Event('filter:reset', { bubbles: true }));
          this.setLabel(filter);
        });
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  submitLabelHandler(e) {
    const target = e.target.closest('.input')
      || e.target.closest('.select')
      || e.target.closest('.checkbox')
      || e.target.closest('.checkbox-btn');
    const targetTop = target.getBoundingClientRect().top;
    const accordionTop = this.filters.getBoundingClientRect().top;

    // this.submitBtn.classList.add('active');
    this.submitBtn.style.top = `${targetTop - accordionTop}px`;

    this.submitBtn.addEventListener('click', () => {
      this.submitBtn.classList.remove('active');
    }, { once: true });
  }

  resizeHandler() {
    if (Filters.isMobile()) {
      this.filterItems.forEach((el) => {
        const filterContent = el.querySelector('.accordion__body-content').children[0];
        const modalBody = document.querySelector(`[data-filter-name=${el.dataset.filterName}] .my-modal__body`);
        if (filterContent) modalBody.append(filterContent);
      });

      this.filterItems = [...this.filters.querySelectorAll('.filter__modal')];
    } else {
      const modals = document.querySelectorAll('.filter__modal[data-filter-name]');
      modals.forEach((el) => {
        const filterContent = el.querySelector('.my-modal__body').children[0];
        const accordionBody = this.filters.querySelector(`[data-filter-name="${el.dataset.filterName}"] .accordion__body-content`);
        if (filterContent) accordionBody.append(filterContent);
      });

      this.filterItems = [...this.filters.querySelectorAll('.accordion__item:not(.accordion__item_fake)')];
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setLabel(filter) {
    const { filterName, filterType } = filter.dataset;
    if (!filterName || !filterType) return;
    const filterContent = filter.querySelector(`[data-filter-name=${filterName}] .${filterType}`);

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
      name: filter.querySelector('.accordion__head-text').innerText,
      filterType: filter.dataset.filterType,
      filterName: filter.dataset.filterName,
      myModal: `#filter-modal-${filter.dataset.filterName}`,
    }));

    const btnDrawers = CreateBtnDrawer(content);

    this.filterAll.querySelector('.my-modal__body').append(btnDrawers);

    CreateModalDrawer(content);
  }

  static isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }
}
