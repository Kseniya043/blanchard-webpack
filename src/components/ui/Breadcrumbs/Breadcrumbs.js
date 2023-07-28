// import throttle from '@/js/throttle';
//
// const resizeHandler = () => {
//   let isMobile = window.matchMedia('(max-width: 768px)').matches;
//   let flag = isMobile;
//
//   const breadcrumbs = document.querySelector('.breadcrumbs');
//
//   return throttle(() => {
//     if (window.matchMedia('(max-width: 768px)').matches) isMobile = true;
//     else isMobile = false;
//
//     if (flag !== isMobile) {
//       const items = [...breadcrumbs.querySelectorAll('.breadcrumbs__item .breadcrumbs__item')];
//
//       items.forEach((item) => {
//         const parent = item.parentNode.closest('.breadcrumbs__item');
//         parent.after(item.cloneNode(true));
//         console.log('-> parent', parent);
//       });
//       flag = isMobile;
//     }
//   }, 1000);
// };
//
// window.addEventListener('resize', resizeHandler());
