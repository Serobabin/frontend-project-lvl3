import * as yup from 'yup';

export const allOrigins = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

export const getFeed = (doc) => {
  const feed = {
    title: doc.querySelector('channel').children[0].textContent,
    description: doc.querySelector('channel').children[1].textContent,
    link: doc.querySelector('channel').children[2].textContent,
  };
  return feed;
};

export const getPosts = (doc) => {
  const items = doc.querySelectorAll('item');
  const list = Array.from(items);
  return list.map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      pubDate: item.querySelector('pubDate').textContent,
    };
    return post;
  });
};

export const parse = (rawData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawData, 'application/xml');
  if (doc.querySelector('parsererror')) {
    const error = new Error();
    error.errors = ['errors.parsingErrors.parsingFailed'];
    throw error;
  }
  return [getFeed(doc), getPosts(doc)];
};

export const validate = (link, linksList) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'errors.validationErrors.notUnique',
    },
    string: {
      url: 'errors.validationErrors.notValid',
      required: 'errors.validatonErrors.unfilled',
    },
  });
  const schema = yup.string().required().url().notOneOf(linksList);
  return schema.validate(link);
};

export const setAttributes = (el, attributes) => {
  attributes.forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
};
