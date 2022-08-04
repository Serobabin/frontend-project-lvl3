import axios from 'axios';
import {
  allOrigins, parse, getFeed, getPosts, getNewPosts, makePostsPreview,
} from './auxiliaryFunctions';

const updateRss = (state, wathchedState) => {
  const updateRsswathchedState = wathchedState;
  if (state.rssForm.urlList.length !== 0) {
    state.rssForm.urlList.forEach((url) => {
      axios.get(`${allOrigins}${encodeURIComponent(url)}`)
        .then((response) => parse(response.data.contents))
        .then((doc) => {
          const feed = getFeed(doc);
          const feedLink = feed.link;
          const feedFromState = state.rss.feedList.filter(
            (feedRSS) => feedRSS.link === feedLink,
          )[0];
          const feedId = feedFromState.id;
          const posts = getPosts(doc, feedId);
          const postsFromState = state.rss.postList.filter((post) => post.feedId === feedId);
          const newPosts = getNewPosts(posts, postsFromState);
          if (newPosts.length > 0) {
            const postsPreview = makePostsPreview(newPosts);
            updateRsswathchedState.uiState.postsPreview = [
              ...state.uiState.postsPreview, ...postsPreview];
            updateRsswathchedState.rss.postList = [...newPosts, ...state.rss.postList];
          }
        });
    });
  }
  setTimeout(updateRss, 5000, state, updateRsswathchedState);
};
export default updateRss;
