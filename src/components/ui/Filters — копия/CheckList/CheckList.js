export default class CheckList {
  constructor(el) {
    this.checkList = el;
    this.input = this.checkList.querySelector('.input_search input');
    this.vars = [...this.checkList.querySelectorAll('.checkbox')];

    // Bind
    this.searchHandler = this.searchHandler.bind(this);
  }

  init() {
    this.input.addEventListener('input', this.searchHandler);
  }

  searchHandler(e) {
    const val = e.target.value.toLowerCase();

    this.vars.forEach((elem) => {
      const el = elem;
      const content = el.textContent.toLowerCase().trim();

      if (content.includes(val)) el.style.display = null;
      else el.style.display = 'none';
    });
  }
}
