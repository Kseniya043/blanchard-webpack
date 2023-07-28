(function _() {
// asked choosing city
  const storageName = 'askedCity';

  const submitHandler = () => { localStorage.setItem(storageName, 'submit'); };

  const loadedHandler = () => {
    const choosingCity = document.querySelector('.choosing-city');

    if (!choosingCity || localStorage.getItem(storageName)) return;

    const choosingCityBtn = choosingCity.querySelector('[data-my-modal="#choosing-city-dropdown"]');
    choosingCityBtn.click();

    const choosingCityDropdown = choosingCity.querySelector('#choosing-city-dropdown');
    const choosingCitySubmit = choosingCityDropdown.querySelector('[data-my-modal-submit]');

    choosingCitySubmit.addEventListener('click', submitHandler, { once: true });
  };

  document.addEventListener('DOMContentLoaded', loadedHandler);

  // modal city list handlers
  const modalChoosingCity = document.querySelector('#choosing-city');
  if (!modalChoosingCity) return;

  const cityList = modalChoosingCity.querySelector('.city-list');
  if (!cityList) return;
  const inputSearch = cityList.querySelector('input[name="citySearch"]');
  const cityLinks = [...cityList.querySelectorAll('.city-list__link')];

  const citySearchHandler = (e) => {
    const val = e.target.value.trim().toLowerCase();

    cityLinks.forEach((link) => {
      const linkText = link.textContent.trim().toLowerCase();

      if (linkText.includes(val)) link.style.display = null;
      else link.style.display = 'none';
    });
  };

  const clickHandler = (e) => {
    const cityLink = e.target.closest('#choosing-city .city-list__link');
    if (cityLink) submitHandler();
  };

  cityList.addEventListener('click', clickHandler);
  inputSearch.addEventListener('input', citySearchHandler);
}());
