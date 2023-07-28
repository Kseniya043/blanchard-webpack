import { delegate } from 'tippy.js';

delegate('body', {
  target: '[data-tippy-content]',
  theme: 'roi',
  hideOnClick: false,
  allowHTML: true,
});
