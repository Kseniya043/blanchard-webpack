import '@/assets/img/svg/file.svg';

(function _() {
  const fileTemplate = (name, size, idx) => (`
    <div class="input-file__file" data-file-idx="${idx}">
      <div class="input-file__file-info">
        <div class="file-item">
          <div class="file-item__icon"><img class="file-item__img" src="assets/img/svg/file.svg"></div>
          <div class="file-item__info">
            <div class="file-item__text">${name}</div>
            <div class="file-item__size">${size} Kb</div>
          </div>
        </div>
      </div>
      <div class="input-file__file-actions">
        <button class="btn btn_square btn_md input-file__file-remove">
          <svg class="svg-icon icon-close">
            <use xlink:href="/assets/img/icons/sprite.svg#close"></use>
          </svg>
        </button>
      </div>
    </div>
  `);

  const dataTransferToInput = (input, filesList = []) => {
    const dt = new DataTransfer();
    filesList.forEach((el) => dt.items.add(el));
    input.files = dt.files;
  };

  const FILES = {};

  function handleFiles(e) {
    const input = e.target;

    if (input.type !== 'file') return;

    // Создаем html под каждый файл
    const inputFilesLen = FILES[input.name]?.length || 0;
    const filesHtml = [...e.target.files]
      .map((el, i) => (
        fileTemplate(
          el.name,
          (el.size / 1024).toFixed(1),
          i + inputFilesLen,
        )
      ))
      .join('');
    const filesWrap = document.createElement('div');
    filesWrap.insertAdjacentHTML('beforeend', filesHtml);

    // Вашаем событие для удаления (только на новые файлы)
    const btnsRemove = [...filesWrap.querySelectorAll('.input-file__file-remove')];
    btnsRemove.forEach((el) => {
      el.addEventListener('click', () => {
        const file = el.closest('.input-file__file');

        delete FILES[input.name][+file.dataset.fileIdx];
        file.remove();
        dataTransferToInput(input, FILES[input.name]);
      }, { once: true });
    });

    // Рендерим html
    const fileList = input.parentNode.querySelector('.input-file__list');
    fileList.append(...filesWrap.children);

    // Все загруженные файлы закидываем в хранилище FILES[input.name] = [File, ...]
    if (!FILES[input.name]) FILES[input.name] = [...e.target.files];
    else FILES[input.name].push(...e.target.files);

    dataTransferToInput(input, FILES[input.name]);
  }

  // По событию reset чистим временный массив файлов и html отображение
  const resetHandler = (e) => {
    const inputsFile = [...e.target.querySelectorAll('input[type="file"]')];
    const inputFileListBlock = [...e.target.querySelectorAll('.input-file__list')];

    inputFileListBlock.forEach((el) => { el.innerHTML = ''; });

    inputsFile.forEach((input) => {
      const inputName = input.name;
      delete FILES[inputName];
    });
  };

  document.addEventListener('reset', resetHandler);
  document.addEventListener('change', handleFiles);
}());
