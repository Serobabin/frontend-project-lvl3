import axios from 'axios';
import _ from 'lodash';
import {
  parse, validate, allOrigins,
} from './auxiliaryFunctions';

export default (state, wathchedState) => (e) => {
  e.preventDefault();
  wathchedState.processState = 'filling';
  const formData = new FormData(e.target);
  const data = formData.get('url');
  wathchedState.rssForm.url = data;
  validate(state.rssForm.url, state.rssForm.urlList)
    .then((url) => {
      wathchedState.rssForm.errors = {};
      wathchedState.processState = 'loading';
      return axios.get(`${allOrigins}${encodeURIComponent(url)}`)
        .then((response) => {
          const [feed, posts] = parse(response.data.contents);
          wathchedState.processState = 'loaded';
          wathchedState.rssForm.urlList.push(state.rssForm.url);
          feed.id = _.uniqueId();
          feed.url = state.rssForm.url;
          const selectedFeedId = feed.id;
          wathchedState.rss.feedList.unshift(feed);
          posts.forEach((post) => {
            post.id = _.uniqueId();
            post.feedId = selectedFeedId;
          });
          wathchedState.rss.postList = [...posts, ...state.rss.postList];
        });
    })
    .catch((err) => {
      if (!(_.has(err, 'errors'))) {
        const errors = { err: 'errors.networkErrors.networkError' };
        wathchedState.rssForm.errors = errors;
      } else {
        const errors = { err: err.errors[0] };
        wathchedState.rssForm.errors = errors;
      }
      wathchedState.processState = 'failed';
    });
};
