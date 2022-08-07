import i18next from 'i18next';
import ru from '../locales/ru.js';
import { viewState, viewUiState } from './view.js';
import rssFormHandler from './controller.js';
import updateRss from './updateRss.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
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
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    fullArticle: document.querySelector('.full-article'),
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
      selectedPostId: null,
      postsPreview: [],
    },
  };
  const wathchedUiState = viewUiState(state.uiState, state, elements);
  const wathchedState = viewState(state, elements, i18nInstance, wathchedUiState);
  updateRss(state.rssForm.urlList, state, wathchedState);
  elements.rssForm.addEventListener('submit', rssFormHandler(state, wathchedState));
};
