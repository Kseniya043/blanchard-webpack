import { animateCSS, isMobile } from '@/js/utils';

// TODO Возможно хуки надо сделать асинхронными и bind(this)

export default class MyModal {
  constructor(target, config = {}) {
    // Config
    const defaultConfig = {
      openSelector: 'data-my-modal', // Селектор открытия - data атрибут
      closeSelector: 'data-my-modal-close', // Селектор кнопки закрытия - data атрибут
      teleportToBody: false, // Перенести модалку перед закрытием body
      afterOpen: () => {},
      beforeClose: () => true, // Для закрытия нужно вернуть true
      submitHandler: () => true, // Для закрытия нужно вернуть true
      resetHandler: () => true, // Для закрытия нужно вернуть true
    };
    this.config = { ...defaultConfig, ...config };

    // Bind
    this.clickHandler = this.clickHandler.bind(this);

    // Events
    this.eventBeforeOpen = new Event('modal:beforeOpen', { bubbles: true });
    this.eventAfterOpen = new Event('modal:afterOpen', { bubbles: true });
    this.eventBeforeClose = new Event('modal:beforeClose', { bubbles: true });
    this.eventAfterClose = new Event('modal:afterClose', { bubbles: true });
    this.eventSubmit = new Event('modal:submit', { bubbles: true });
    this.eventReset = new Event('modal:reset', { bubbles: true });

    // shadow
    this.shadow = document.querySelector('.my-modal-shadow') || document.createElement('div');
    this.shadow.classList.add('my-modal-shadow');
    document.body.append(this.shadow);
  }

  init() {
    document.addEventListener('click', this.clickHandler); // , { capture: true }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clickHandler(e);
      }
    });
  }

  static getMode(modal) {
    if (!modal) return null;
    if (modal.classList.contains('my-modal_menu')) return 'menu';
    if (modal.classList.contains('my-modal_drawer')) return 'drawer';
    if (modal.classList.contains('my-modal_notification')) return 'notification';
    return 'modal';
  }

  clickHandler(e) {
    // Открытие модалки
    const modalOpener = e.target.closest(`[${this.config.openSelector}]`);
    const modalActive = e.target.closest('.my-modal.active');

    const activeModalMenu = document.querySelector('.my-modal_menu.active');
    if (!activeModalMenu?.contains(e.target)) this.close(activeModalMenu);

    if (modalOpener) {
      e.preventDefault();

      const targetAttr = modalOpener.getAttribute(this.config.openSelector);
      const targetModal = document.querySelector(targetAttr);

      const openerInDrawerBody = modalOpener.closest('.my-modal_drawer.active .my-modal__body');

      if (!openerInDrawerBody) {
        this.close(modalActive, false).then(() => this.open(targetModal));
      } else {
        this.open(targetModal);
      }
    }

    if (modalActive) {
      // Submit
      if (e.target.hasAttribute('data-my-modal-submit')) {
        modalActive.dispatchEvent(this.eventSubmit);
        if (this.config.submitHandler()) this.close(modalActive);
        return;
      }

      // Reset
      if (e.target.hasAttribute('data-my-modal-reset')) {
        modalActive.dispatchEvent(this.eventReset);
        if (this.config.resetHandler()) this.close(modalActive);
        return;
      }
    }

    // Close
    const clickOnCloseSelector = e.target.closest(`[${this.config.closeSelector}]`);

    const clickNotInModal = !modalActive?.contains(e.target);
    const activeModals = [...document.querySelectorAll('.my-modal.active')];
    const clickOutsideActiveModal = (clickNotInModal && activeModals.length);

    if (!activeModals.length) return;
    if (clickOnCloseSelector || clickOutsideActiveModal) this.closeAllActive(activeModals);
  }

  open(modal) {
    if (!modal) {
      console.warn('modal not found');
      return this;
    }

    modal.dispatchEvent(this.eventBeforeOpen);

    if (
      MyModal.getMode(modal) === 'notification'
      && this.shadow.classList.contains('active')
    ) this.hideShadow();

    if (
      (this.config.teleportToBody
        && modal.parentNode.tagName !== 'BODY'
        && MyModal.getMode(modal) !== 'menu')
      || MyModal.getMode(modal) === 'notification'
    ) document.body.append(modal);

    modal.classList.add('active');
    this.intersectionObserver(modal);
    this.config.afterOpen();
    modal.dispatchEvent(this.eventAfterOpen);

    if (['modal', 'drawer'].includes(MyModal.getMode(modal))) {
      document.querySelector('body').style.overflow = 'hidden';
    }

    if (
      MyModal.getMode(modal) === 'drawer'
      && isMobile()
    ) return this;

    this.showShadow(modal);
    return this;
  }

  // TODO сделать чтоб если модалка menu не влазит во вьюпорт то сменить отображение
  // eslint-disable-next-line class-methods-use-this
  intersectionObserver(modal) {
    if (isMobile() || MyModal.getMode(modal) !== 'menu') return;

    const rect = modal.getBoundingClientRect();
    const right = rect.x + rect.width;

    if (right > window.innerWidth) modal.classList.add('my-modal_left');
    else modal.classList.remove('my-modal_left');
  }

  async close(modal, hideShadow = true) {
    if (!modal || !modal?.classList.contains('active')) return this;

    if (!this.config.beforeClose()) return this;

    modal.dispatchEvent(this.eventBeforeClose);

    const mode = MyModal.getMode(modal);

    if (mode === 'drawer') await animateCSS(modal, 'closeDrawer');
    if (mode === 'modal') await animateCSS(modal, 'closeModal');
    if (mode === 'notification') await animateCSS(modal, 'closeNotification');

    document.querySelector('body').style.overflow = null;
    modal.classList.remove('active', 'my-modal_left');

    modal.dispatchEvent(this.eventAfterClose);

    // TODO Проверить если открыто несколько модалок не не убирать тень при закрытии одной
    if (hideShadow) this.hideShadow(modal);

    return this;
  }

  closeAllActive(activeModals) {
    activeModals.forEach(async (modal) => { await this.close(modal, true); });
    return this;
  }

  showShadow(modal) {
    if (MyModal.getMode(modal) === 'menu' && !isMobile()) return this;
    if (MyModal.getMode(modal) === 'notification') return this;

    this.shadow.classList.add('active');
    return this;
  }

  async hideShadow() {
    // modal
    // if (MyModal.getMode(modal) === 'menu' && !isMobile()) return this;
    // if (MyModal.getMode(modal) === 'notification') return this;
    if (!this.shadow.classList.contains('active')) return this;

    this.shadow.classList.remove('active');
    await animateCSS(this.shadow, 'disabling');
    document.querySelector('body').style.overflow = null;
    return this;
  }
}
