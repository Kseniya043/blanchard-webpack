import noUiSlider from 'nouislider';

export const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

export const fromLocalString = (val) => (+val.replace(/[^0-9]/g, ''));

export const noUiSliderCreate = (el, min, max) => (
  noUiSlider.create(el, {
    start: [min, max],
    connect: true,
    step: 1,
    range: {
      min,
      max,
    },
    format: {
      to: (val) => (val.toLocaleString()),
      from: (val) => (fromLocalString(val)),
    },
  })
);

export const priceRoundUp = (val) => {
  const str = val.toString();
  const len = str.length;

  let name = '';
  let to = 0;
  if (len > 6) {
    name = 'млн.';
    to = 6;
  } else if (len > 3) {
    name = 'тыс.';
    to = 3;
  }
  const num = [...str].reverse().slice(to).reverse().join('');

  return `${num} ${name}`;
};

export function animateCSS(element, animation) {
  return new Promise((resolve) => {
    const animationName = animation;
    const node = (element.nodeType === 1) ? element : document.querySelector(element);

    node.classList.add(...animationName.split(' '));

    function handleAnimationEnd() {
      node.classList.remove(...animationName.split(' '));
      resolve('End');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
}

function linear(timeFraction) {
  return timeFraction;
}

export function animate({ draw, timing = linear, duration = 300 }) {
  return new Promise((resolve) => {
    const start = performance.now();

    const anim = (time) => {
      // timeFraction изменяется от 0 до 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      // вычисление текущего состояния анимации
      const progress = timing(timeFraction);

      draw(progress); // отрисовать её

      if (timeFraction < 1) {
        requestAnimationFrame(anim);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(anim);
  });
}

export function debounce(func, wait = 500, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function _() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

export function throttle(func, ms = 500) {
  let isThrottled = false;
  let savedArgs;
  let savedThis;

  function wrapper(...args) {
    if (isThrottled) { // (2)
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args); // (1)

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        // eslint-disable-next-line no-param-reassign
        args = null;
      }
    }, ms);
  }

  return wrapper;
}

export function throttleOnce(callback, ms = 300) {
  let timeout;
  return function _(argument) {
    const self = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(self, argument), ms);
  };
}
