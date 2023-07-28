import tippy from 'tippy.js';

tippy('[data-menu]', {
  appendTo: () => document.body,
  theme: 'menu',
  trigger: 'click',
  hideOnClick: true,
  interactive: true,
  placement: 'bottom-start',
  content: (reference) => reference.parentNode.querySelector('.menu__content').cloneNode(true),
});

// TODO test
// import { delegate } from 'tippy.js';
//
// delegate('body', {
//   target: '[data-tippy-content]',
//   theme: 'roi',
//   hideOnClick: false,
//   allowHTML: true,
// });
