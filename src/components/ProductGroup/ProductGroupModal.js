(function _() {
  const beforeOpenHandler = (e) => {
    const modal = e.target;
    if (modal.id !== 'modal-preview') return;

    console.log(modal);
  };

  document.addEventListener('modal:beforeOpen', beforeOpenHandler);
}());
