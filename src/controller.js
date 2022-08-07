import axios from 'axios';
import _ from 'lodash';
import {
  parse, validate, allOrigins, makePostsPreview,
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
      wathchedStateHandler.rssForm.errors = {};
      wathchedStateHandler.processState = 'loading';
      return axios.get(`${allOrigins}${encodeURIComponent(url)}`)
        .then((response) => {
          const [feed, posts] = parse(response.data.contents);
          wathchedStateHandler.processState = 'loaded';
          wathchedStateHandler.rssForm.urlList.push(state.rssForm.url);
          feed.id = _.uniqueId();
          const selectedFeedId = feed.id;
          wathchedStateHandler.rss.feedList.unshift(feed);
          posts.forEach((el) => {
            const post = el;
            post.id = _.uniqueId();
            post.feedId = selectedFeedId;
          });
          const postsPreview = makePostsPreview(posts);
          wathchedStateHandler.uiState.postsPreview = [
            ...state.uiState.postsPreview, ...postsPreview];
          wathchedStateHandler.rss.postList = [...posts, ...state.rss.postList];
        });
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
