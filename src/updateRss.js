import axios from 'axios';
import _ from 'lodash';
import {
  allOrigins, parse, makePostsPreview,
} from './auxiliaryFunctions.js';

const updateRss = (state, wathchedState) => {
  const updateRsswathchedState = wathchedState;
  if (state.rss.feedList.length === 0) {
    setTimeout(updateRss, 5000, state, updateRsswathchedState);
    return;
  }
  const promises = state.rss.feedList.map((feed) => axios.get(`${allOrigins}${encodeURIComponent(feed.url)}`)
    .then((response) => {
      const [, posts] = parse(response.data.contents);
      const temp = state.rss.postList.filter((post) => post.feedId === feed.id);
      const newPosts = _.differenceBy(posts, temp, 'link');
      newPosts.forEach((el) => {
        const post = el;
        post.feedId = feed.id;
        post.id = _.uniqueId();
      });
      return newPosts;
    }));
  const promise = Promise.all(promises);
  promise.then((data) => {
    data.forEach((newPosts) => {
      const postsPreview = makePostsPreview(newPosts);
      updateRsswathchedState.uiState.postsPreview = [
        ...state.uiState.postsPreview, ...postsPreview];
      updateRsswathchedState.rss.postList = [...newPosts, ...state.rss.postList];
    });
    setTimeout(updateRss, 5000, state, updateRsswathchedState);
  });
};
export default updateRss;
