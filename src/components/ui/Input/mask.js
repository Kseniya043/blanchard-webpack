export default class Mask {
  static init() {
    document.addEventListener('keypress', Mask.keypressHandler);
    document.addEventListener('focusin', Mask.focusHandler);
    document.addEventListener('keydown', Mask.keydownHandler);
    document.addEventListener('focusout', Mask.focusoutHandler);
  }

  // EventHandlers
  static keypressHandler(e) {
    if (e.target.dataset.mask === 'phone') Mask.keypressPhone(e);
  }

  static focusHandler(e) {
    if (e.target.dataset.mask === 'phone') Mask.focusPhone(e);
  }

  static keydownHandler(e) {
    if (e.target.dataset.mask === 'phone') Mask.keydownPhone(e);
  }

  static focusoutHandler(e) {
    if (e.target.dataset.mask === 'phone') Mask.focusoutPhone(e);
  }

  // Phone
  static keypressPhone(e) {
    if (e.keyCode < 48 || e.keyCode > 57) {
      e.preventDefault();
    }
  }

  static focusPhone(e) {
    if (e.target.value.length === 0) {
      e.target.value = '+7 ';
    }
  }

  static keydownPhone(e) {
    const input = e.target;

    if (e.key === 'Backspace' && input.value.length <= 3) {
      e.preventDefault();
    }

    if (input.value.substr(0, 3) !== '+7 ') {
      input.value = `+7 ${input.value}`;
    }

    if (input.value.length === 6 && e.key !== 'Backspace') {
      input.value = `${input.value.slice(0, 7)} `;
    }
    if (input.value.length === 10 && e.key !== 'Backspace') {
      input.value = `${input.value.slice(0, 10)}-`;
    }
    if (input.value.length === 13 && e.key !== 'Backspace') {
      input.value = `${input.value.slice(0, 13)}-`;
    }
    if (input.value.length > 15 && e.key !== 'Backspace' && e.key !== 'Tab') {
      e.preventDefault();
    }
  }

  static focusoutPhone(e) {
    const input = e.target;

    if (input.value === '+7 ') {
      input.value = null;
    }
  }
}
