import { fromLocalString, priceRoundUp } from '@/js/utils';

export default class GetLabels {
  static checkboxList(el) {
    return el?.querySelectorAll('input:checked').length;
  }

  static inputRange(el) {
    const inputMin = el.querySelector('.input-min input');
    const inputMax = el.querySelector('.input-max input');
    const slider = el.querySelector('.input-range__slider');

    const min = fromLocalString(inputMin.value);
    const max = fromLocalString(inputMax.value);

    const changeMin = min !== +slider.dataset.min;
    const changeMax = max !== +slider.dataset.max;

    if (changeMax) return max ? `до ${priceRoundUp(max)}` : '';

    if (changeMin) return min ? `от ${priceRoundUp(min)}` : '';

    return '';
  }
}
