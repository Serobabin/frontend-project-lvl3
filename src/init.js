import * as yup from 'yup';
import view from './view';

const validate = (link, linksList) => {
  const schema = yup.string().required().url().notOneOf(linksList);
  return schema.validate(link);
};

export default () => {
  const elements = {
    rssForm: document.querySelector('form'),
    rssFormInput: document.querySelector('input'),
  };

  const state = {
    rssForm: {
      linksList: [],
      valid: null,
    },
  };

  const wathchedState = view(state, elements);

  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = formData.get('url');
    validate(data, state.rssForm.linksList)
      .then((link) => {
        wathchedState.rssForm.linksList.push(link);
        wathchedState.rssForm.valid = true;
        wathchedState.rssForm.valid = null;
      })
      .catch(() => {
        wathchedState.rssForm.valid = false;
        wathchedState.rssForm.valid = null;
      });
  });
};
