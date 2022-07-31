import i18next from 'i18next';
import ru from '../locales/ru';
import view from './view';
import rssFormHandler from './controller';
import updateRss from './updateRss';

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
    postContainer: document.querySelector('.posts'),
    feedContainer: document.querySelector('.feeds'),
    fade: document.querySelector('.fade'),
  };

  const state = {
    processState: 'filling',
    rssForm: {
      url: '',
      urlList: [],
      errors: {},
    },
    rss: {
      feedList: [],
      postList: [],
    },
    uiState: {
      postsPreview: [],
    },
  };

  const wathchedState = view(state, elements, i18nInstance);
  updateRss(state, wathchedState);
  elements.rssForm.addEventListener('submit', rssFormHandler(state, wathchedState));
};
