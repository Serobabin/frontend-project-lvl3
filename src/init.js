import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import ru from '../locales/ru';
import view from './view';

function UserException(message) {
  this.errors = [message];
}
const parse = (rawData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawData, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new UserException('errors.parsingErrors.parsingFailed');
  }
  return doc;
};

const validate = (link, linksList) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'errors.validationErrors.notUnique',
    },
    string: {
      url: 'errors.validationErrors.notValid',
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
    postContainer: document.querySelector('.posts'),
    feedContainer: document.querySelector('.feeds'),
    fade: document.querySelector('.fade'),
  };

  const state = {
    processState: 'filling',
    rssForm: {
      url: '',
      urlList: [],
      valid: null,
      errors: {},
    },
    rss: {
      feedList: [],
      postList: [],
    },
  };

  const wathchedState = view(state, elements, i18nInstance);

  elements.rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    wathchedState.processState = 'filling';
    const formData = new FormData(e.target);
    const data = formData.get('url');
    state.rssForm.url = data;
    validate(state.rssForm.url, state.rssForm.urlList)
      .then((url) => {
        wathchedState.rssForm.urlList.push(url);
        wathchedState.rssForm.valid = true;
        wathchedState.rssForm.valid = null;
        wathchedState.rssForm.errors = {};
        wathchedState.processState = 'loading';
        return url;
      })
      .then((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
      .then((response) => parse(response.data.contents))
      .then((doc) => {
        const feedId = _.uniqueId();
        const feed = {
          id: feedId,
          title: doc.querySelector('channel').children[0].textContent,
          description: doc.querySelector('channel').children[1].textContent,
        };
        wathchedState.rss.feedList.push(feed);
        const posts = [];
        const items = doc.querySelectorAll('item');
        items.forEach((item) => {
          const obj = {
            id: _.uniqueId(),
            feedId,
            title: item.children[0].textContent,
            link: item.children[2].textContent,
            description: item.children[3].textContent,
          };
          posts.push(obj);
        });
        wathchedState.rssForm.urlList.push(state.rssForm.url);
        wathchedState.rss.postList = [...state.rss.postList, ...posts];
        wathchedState.processState = 'loaded';
      })
      .catch((err) => {
        if (!(_.has(err, 'errors'))) {
          wathchedState.rssForm.valid = false;
          wathchedState.rssForm.valid = null;
          const errors = { err: 'errors.networkErrors.networkError' };
          wathchedState.rssForm.errors = errors;
        } else {
          wathchedState.rssForm.valid = false;
          wathchedState.rssForm.valid = null;
          const errors = { err: err.errors[0] };
          wathchedState.rssForm.errors = errors;
        }
        wathchedState.processState = 'failed';
      });
  });
};
