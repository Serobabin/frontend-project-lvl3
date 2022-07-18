import onChange from 'on-change';

const renderRssForm = (value, elements) => {
  const form = elements.rssForm;
  const input = elements.rssFormInput;
  if (value === true) {
    form.reset();
    form.focus();
    input.classList.remove('is-invalid');
  }
  if (value === false) {
    input.classList.add('is-invalid');
  }
};

const render = (elements) => (path, value) => {
  switch (path) {
    case 'rssForm.valid': renderRssForm(value, elements);
      break;

    default:
      break;
  }
};

const view = (state, elements) => onChange(state, render(elements));

export default view;
