import { noUiSliderCreate } from '@/js/utils';

// TODO ПЕРЕДЕЛАТЬ ТИП ЦЕНЫ НА ЧЕКБОКСАХ

export default class InputRange {
  constructor(el) {
    this.range = el;
    this.slider = this.range.querySelector('.input-range__slider');

    this.inputRangeUnits = this.range.querySelector('.input-range__units');
    this.inputMin = this.range.querySelector('.input-min input');
    this.inputMax = this.range.querySelector('.input-max input');
    this.inputsUnit = this.range.querySelectorAll('.input-range__units input[type="radio"]');

    this.min = +this.slider.dataset.min;
    this.max = +this.slider.dataset.max;

    // custom events
    this.eventChange = new Event('change', { bubbles: true });

    // Bind
    this.inputRangeHandler = this.inputRangeHandler.bind(this);
    this.sliderHandler = this.sliderHandler.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
  }

  init() {
    this.slider = noUiSliderCreate(this.slider, this.min, this.max);

    // events
    this.range.addEventListener('input', this.inputRangeHandler);
    this.range.addEventListener('inputRange:reset', this.resetHandler);
    this.slider.on('update', this.sliderHandler);
  }

  sliderHandler(val, handle) {
    const value = val[handle];

    if (handle === 0) {
      this.inputMin.value = value;
      this.inputMin.dispatchEvent(this.eventChange);
    } else if (handle === 1) {
      this.inputMax.value = value;
      this.inputMax.dispatchEvent(this.eventChange);
    }
  }

  inputRangeHandler(e) {
    const checkbox = e.target.type === 'checkbox' ? e.target : null;
    const text = e.target.type === 'text' ? e.target : null;

    if (checkbox) {
      const same = [...this.inputRangeUnits.querySelectorAll(`input[type="checkbox"][name="${checkbox.name}"]`)];
      same.forEach((inp) => {
        if (inp !== checkbox) {
          inp.checked = false;
        }
      });
    }

    if (text) this.slider.set([this.inputMin.value, this.inputMax.value]);
  }

  resetHandler() {
    this.inputsUnit.forEach((el, k) => {
      if (k === 0) el.checked = true;
      else el.checked = false;
    });
    this.inputMax.value = this.max;
    this.inputMin.value = this.min;
    this.slider.set([this.min, this.max]);
  }
}
