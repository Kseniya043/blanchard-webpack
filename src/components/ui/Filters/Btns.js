export default class Btns {
  static setStatus(btn, count = null) {
    if (count) btn.classList.add('filter__btn_checked');
    else btn.classList.remove('filter__btn_checked');

    const label = btn.querySelector('[data-filter-label]');

    label.innerText = `: ${count}!!`;
  }
}
