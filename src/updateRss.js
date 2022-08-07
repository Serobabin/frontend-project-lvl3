import axios from 'axios';
import _ from 'lodash';
import {
  allOrigins, parse, getNewPosts, makePostsPreview,
} from './auxiliaryFunctions.js';

const updateRss = (urlList, state, wathchedState) => {
  if (urlList.length === 0) {
    setTimeout(updateRss, 5000, state.rssForm.urlList, state, wathchedState);
  }
  const makeUpdate = (lList, sstate, wwathchedState) => {
    if (lList.length === 0) {
      setTimeout(updateRss, 5000, sstate.rssForm.urlList, sstate, wwathchedState);
      return;
    }
    const updateRsswathchedState = wwathchedState;
    const [url, ...rest] = lList;
    axios.get(`${allOrigins}${encodeURIComponent(url)}`)
      .then((response) => {
        makeUpdate(rest, sstate, wwathchedState);
        const [feed, posts] = parse(response.data.contents);
        const feedLink = feed.link;
        const feedDescription = feed.description;
        const feedsFromState = sstate.rss.feedList.filter(
          (feedRss) => feedRss.link === feedLink && feedRss.description === feedDescription,
        )[0];
        const { id } = feedsFromState;
        const temp = sstate.rss.postList.filter((post) => post.feedId === id);
        const newPosts = getNewPosts(posts, temp);
        if (newPosts.length > 0) {
          newPosts.forEach((el) => {
            const post = el;
            post.feedId = id;
            post.id = _.uniqueId();
          });
          const postsPreview = makePostsPreview(newPosts);
          updateRsswathchedState.uiState.postsPreview = [
            ...sstate.uiState.postsPreview, ...postsPreview];
          updateRsswathchedState.rss.postList = [...newPosts, ...sstate.rss.postList];
        }
      });
  };
  if (urlList.length > 0) {
    makeUpdate(urlList, state, wathchedState);
  }
};
export default updateRss;
