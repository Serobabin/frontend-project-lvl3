import axios from 'axios';
import _ from 'lodash';
import {
  allOrigins, parse,
} from './auxiliaryFunctions.js';

const updateRss = (state, wathchedState) => {
  if (state.rss.feedList.length === 0) {
    setTimeout(updateRss, 5000, state, wathchedState);
    return;
  }
  const promises = state.rss.feedList.map((feed) => axios.get(`${allOrigins}${encodeURIComponent(feed.url)}`)
    .then((response) => {
      const [, posts] = parse(response.data.contents);
      const postsFromState = state.rss.postList.filter((post) => post.feedId === feed.id);
      const newPosts = _.differenceBy(posts, postsFromState, 'link');
      newPosts.forEach((post) => {
        post.feedId = feed.id;
        post.id = _.uniqueId();
      });
      return newPosts;
    })
    .catch(() => []));
  const promise = Promise.all(promises);
  promise.then((data) => {
    data.forEach((newPosts) => {
      wathchedState.rss.postList = [...newPosts, ...state.rss.postList];
    });
    setTimeout(updateRss, 5000, state, wathchedState);
  });
};
export default updateRss;
