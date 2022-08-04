import * as yup from 'yup';
import _ from 'lodash';

export const allOrigins = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

export const makePostsPreview = (posts) => posts.map((post) => {
  const postId = post.id;
  const state = 'not viewed';
  return { postId, state };
});

export const getNewPosts = (posts, contributedPosts) => {
  const sortedcontributedPosts = _.sortBy(contributedPosts, ({ pubDate }) => Date.parse(pubDate));
  const newestContributedPost = sortedcontributedPosts[sortedcontributedPosts.length - 1];
  const pubDateNewestContributedPost = Date.parse(newestContributedPost.pubDate);
  return posts.reduce((acc, post) => {
    const postPubDate = Date.parse(post.pubDate);
    if (postPubDate > pubDateNewestContributedPost) {
      acc.push(post);
    }
    return acc;
  }, []);
};

export const getFeed = (doc) => {
  const feed = {
    id: _.uniqueId(),
    title: doc.querySelector('channel').children[0].textContent,
    description: doc.querySelector('channel').children[1].textContent,
    link: doc.querySelector('channel').children[2].textContent,
  };
  return feed;
};

export const getPosts = (doc, feedId) => {
  const posts = [];
  const items = doc.querySelectorAll('item');
  items.forEach((item) => {
    const obj = {
      id: _.uniqueId(),
      feedId,
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      pubDate: item.querySelector('pubDate').textContent,
    };
    posts.push(obj);
  });
  return posts;
};

function UserException(message) {
  this.errors = [message];
}

export const parse = (rawData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawData, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new UserException('errors.parsingErrors.parsingFailed');
  }
  return doc;
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
