import axios from 'axios';
import _ from 'lodash';
import {
  getPosts, getFeed, parse, validate, allOrigins, makePostsPreview,
} from './auxiliaryFunctions';

export default (state, wathchedState) => (e) => {
  e.preventDefault();
  const wathchedStateHandler = wathchedState;
  wathchedStateHandler.processState = 'filling';
  const formData = new FormData(e.target);
  const data = formData.get('url');
  wathchedStateHandler.rssForm.url = data;
  validate(state.rssForm.url, state.rssForm.urlList)
    .then((url) => {
      wathchedStateHandler.rssForm.urlList.push(url);
      wathchedStateHandler.rssForm.errors = {};
      wathchedStateHandler.processState = 'loading';
      return url;
    })
    .then((url) => axios.get(`${allOrigins}${encodeURIComponent(url)}`))
    .then((response) => parse(response.data.contents))
    .then((doc) => {
      wathchedStateHandler.processState = 'loaded';
      const feed = getFeed(doc);
      const feedId = feed.id;
      const posts = getPosts(doc, feedId);
      wathchedStateHandler.rssForm.urlList.push(state.rssForm.url);
      wathchedStateHandler.rss.feedList.push(feed);
      wathchedStateHandler.rss.postList = [...posts, ...state.rss.postList];
      const postsPreview = makePostsPreview(posts);
      wathchedStateHandler.uiState.postsPreview = [...state.uiState.postsPreview, ...postsPreview];
    })
    .catch((err) => {
      if (!(_.has(err, 'errors'))) {
        wathchedStateHandler.rssForm.valid = false;
        wathchedStateHandler.rssForm.valid = null;
        const errors = { err: 'errors.networkErrors.networkError' };
        wathchedStateHandler.rssForm.errors = errors;
      } else {
        const errors = { err: err.errors[0] };
        wathchedStateHandler.rssForm.errors = errors;
      }
      wathchedStateHandler.processState = 'failed';
    });
};
