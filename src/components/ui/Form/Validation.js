export default class Validation {
  constructor() {
    // Elemetns
    this.forms = [...document.querySelectorAll('form')];
  }

  init() {
    this.forms.forEach((form) => {
      form.noValidate = true;
    });

    document.addEventListener('submit', Validation.submitHandler);
    document.addEventListener('reset', Validation.resetHandler);
  }

  static resetHandler(e) {
    const form = e.target;

    const inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('textarea')];

    inputs.forEach((input) => {
      Validation.clearError(input);
    });
  }

  static async submitHandler(e) {
    e.preventDefault();

    const form = e.target;

    // ЕСЛИ ВАЛИДАЦИЯ НЕ ПРОШЛА
    if (!Validation.checkFormValidity(form)) return;

    // ЕСЛИ ВАЛИДАЦИЯ ПРОШЛА
    const formData = new FormData(form);
    const url = form.action;

    // Чистим формДату от пустых файлов
    Array.from(formData.entries()).forEach(([k, v]) => {
      if (v instanceof File && !v.size) formData.delete(k);
    });

    const loader = Validation.templateLoader();
    const parent = form;
    parent.prepend(loader);

    let res = {};
    let json = {};
    try {
      res = await fetch(url, { method: 'POST', body: formData });
      json = await res.json();
    } catch (err) {
      console.warn(err.message);
    }

    // TODO закоментить на проде
    await Validation.debug(form, res);

    if (res.status === 200 && json.success) Validation.formSuccess();
    if (res.status !== 200) Validation.formError();

    loader.remove();
    form.reset();
  }

  static async debug(form, res) {
    console.warn('Пауза 2000 мс. Отключить на проде!!!');
    await new Promise((resolve) => { setTimeout(resolve, 2000); });
    console.log('form.id', form.id);
    console.log('status', res.status);
  }

  static checkFormValidity(form) {
    const inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('textarea')];

    inputs.forEach((input) => {
      // Если есть атрибут с маской то проводим свою валидацию
      if (input.dataset.mask === 'phone') {
        if (input.value.length < 16) input.setCustomValidity('phone min length = 16');
        else input.setCustomValidity('');
      }

      // Если поле валидно то return
      if (input.validity.valid) return;

      const wrapper = input.closest('.input');
      if (!wrapper) {
        console.warn('input wrapper not found');
        return;
      }

      // Добавляет текст об ошибки валидации
      const labelText = wrapper.querySelector('label')?.innerText;
      let blockMsg = wrapper.querySelector('.input__validation');
      if (!blockMsg) {
        blockMsg = Validation.createBlockMsg(labelText);
        wrapper.append(blockMsg);
      }

      wrapper.classList.add('input_error');

      input.addEventListener('input', (e) => {
        Validation.clearError(e.target);
      }, { once: true });
    });

    return form.checkValidity();
  }

  static templateLoader = () => {
    const loader = document.createElement('div');
    loader.classList.add('loading');

    loader.innerHTML = `
      <div class="loading__animation">
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="loading__text">Пожалуйста подождите<br>заявка отправляется</div>
    `;

    return loader;
  }

  static clearError(input) {
    const wrapper = input.closest('.input');
    wrapper.classList.remove('input_error');
  }

  static createBlockMsg(text) {
    const blockMsg = document.createElement('div');
    blockMsg.classList.add('input__validation');
    blockMsg.innerText = `Введите ${text}`;
    return blockMsg;
  }

  static formSuccess() {
    console.log('form success handler');
  }

  static formError() {
    console.log('form error handler');
  }
}
