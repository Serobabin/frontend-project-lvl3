import onChange from 'on-change';

const renderErrors = (value, elements, i18nInstance) => {
  const formFeedback = elements.feedback;
  formFeedback.textContent = i18nInstance.t(value.err);
};

const renderRssForm = (value, elements) => {
  const form = elements.rssForm;
  const input = elements.rssFormInput;
  const formFeedback = elements.feedback;
  if (value === true) {
    form.reset();
    form.focus();
    input.classList.remove('is-invalid');
    formFeedback.textContent = '';
  }
  if (value === false) {
    input.classList.add('is-invalid');
  }
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'rssForm.valid': renderRssForm(value, elements);
      break;
    case 'rssForm.errors': renderErrors(value, elements, i18nInstance);
      break;
    default:
      break;
  }
};

const view = (state, elements, i18nInstance) => onChange(state, render(elements, i18nInstance));

export default view;
