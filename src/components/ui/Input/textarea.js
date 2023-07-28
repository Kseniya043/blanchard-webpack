const inputTextarea = (e) => {
  const textarea = e.target;
  if (textarea.tagName !== 'TEXTAREA') return;

  const textareaInitRows = textarea.dataset.row || 2;

  const hasScroll = () => textarea.scrollHeight > textarea.clientHeight;
  const hasMoreOneRow = () => Number(textarea.getAttribute('rows')) > 1;

  const addRow = () => {
    let rows = Number(textarea.getAttribute('rows'));

    while (hasScroll()) {
      rows = Number(textarea.getAttribute('rows'));
      textarea.setAttribute('rows', rows + 1);
    }
  };

  const removeRow = () => {
    let rows = Number(textarea.getAttribute('rows'));

    while (rows >= textareaInitRows && !hasScroll()) {
      rows = Number(textarea.getAttribute('rows'));
      textarea.setAttribute('rows', rows - 1);
    }
  };

  if (!hasScroll() && hasMoreOneRow()) removeRow();
  if (hasScroll()) addRow();
};

document.addEventListener('input', inputTextarea);
