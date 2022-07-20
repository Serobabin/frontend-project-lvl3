import i18next from 'i18next';
import * as yup from 'yup';
import ru from '../locales/ru';
import view from './view';

const validate = (link, linksList) => {
  yup.setLocale({
    mixed: {
      default: 'field_invalid',
      notOneOf: 'errors.notUnique',
    },
    string: {
      url: 'errors.notValid',
    },
  });
  const schema = yup.string().required().url().notOneOf(linksList);
  return schema.validate(link);
};

export default async () => {
  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const elements = {
    rssForm: document.querySelector('form'),
    rssFormInput: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    processState: 'filling',
    rssForm: {
      linksList: [],
      valid: null,
      errors: {},
    },
  };

  const wathchedState = view(state, elements, i18nInstance);

  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = formData.get('url');
    validate(data, state.rssForm.linksList)
      .then((link) => {
        wathchedState.rssForm.linksList.push(link);
        wathchedState.rssForm.valid = true;
        wathchedState.rssForm.valid = null;
        wathchedState.rssForm.errors = {};
      })
      .catch((err) => {
        wathchedState.rssForm.valid = false;
        wathchedState.rssForm.valid = null;
        const errors = { err: err.errors[0] };
        wathchedState.rssForm.errors = errors;
      });
  });
};
