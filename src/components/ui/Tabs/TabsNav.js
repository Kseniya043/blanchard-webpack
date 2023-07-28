import { animate } from '@/js/utils';

(function TabsNav() {
  const clickHandler = async (e) => {
    const tabBtn = e.target.closest('.tabs-nav__btn');
    if (!tabBtn) return;

    const tabsNav = tabBtn.parentElement;

    // hide
    const beforeActiveBtn = tabsNav.querySelector('.tabs-nav__btn.active');
    beforeActiveBtn.classList.remove('active');
    const activeTab = document.getElementById(beforeActiveBtn.dataset.tabTarget);
    await animate({
      draw(progress) {
        activeTab.style.opacity = 1 - progress;
      },
    });
    activeTab.style.display = 'none';
    activeTab.style.opacity = null;

    // show
    tabBtn.classList.add('active');
    const targetTab = document.getElementById(tabBtn.dataset.tabTarget);
    targetTab.style.opacity = 0;
    targetTab.style.display = null;
    await animate({
      draw(progress) {
        targetTab.style.opacity = progress;
      },
    });
    targetTab.style.opacity = null;
  };

  document.addEventListener('click', clickHandler);
}());
