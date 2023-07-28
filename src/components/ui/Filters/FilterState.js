const configProxyInputValue = {
  set(target, p, value) {
    target[p] = value;

    if (target.type === 'text') {
      const inputs = [...document.querySelectorAll(`input[name="${target.name}"]`)];

      inputs.forEach((input) => {
        input.value = target.value;
      });

      return true;
    }

    if (target.type === 'checkbox') {
      const inputs = [...document.querySelectorAll(`input[name="${target.name}"]`)]; // [value="${target.value}"]

      inputs.forEach((input) => {
        if (input.value === target.value) input.checked = target.checked;
        else input.checked = !target.checked;
      });

      return true;
    }

    return true;
  },
};

const configProxyInput = {
  set(target, p, value) {
    if (typeof value === 'object') {
      target[p] = new Proxy({}, configProxyInputValue);

      Object.keys(value).forEach((key) => {
        target[p][key] = value[key];
      });
    } else target[p] = value;

    return true;
  },
};

const configProxyFilter = {
  set(target, p, value) {
    if (typeof value === 'object') {
      target[p] = new Proxy({}, configProxyInput);

      Object.keys(value).forEach((key) => {
        target[p][key] = value[key];
      });
    } else target[p] = value;

    Object.defineProperty(target[p], 'getCount', { enumerable: false });
    Object.defineProperty(target[p], 'type', { enumerable: false });

    return true;
  },
};

export default new Proxy(
  {},
  configProxyFilter,
);
