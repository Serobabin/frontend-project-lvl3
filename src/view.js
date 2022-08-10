import onChange from 'on-change';
import { setAttributes } from './auxiliaryFunctions.js';

const renderModal = (selectedPostId, state, elements) => {
  const data = state.rss.postList.filter((el) => el.id === selectedPostId)[0];

  const a = document.querySelector(`[data-id="${selectedPostId}"]`);
  a.classList.remove('fw-bold');
  a.classList.add('fw-normal', 'link-secondary');

  const { modalTitle } = elements;
  modalTitle.textContent = data.title;

  const { modalBody } = elements;
  modalBody.textContent = data.description;

  const { fullArticle } = elements;
  fullArticle.setAttribute('href', `${data.link}`);
};

const renderErrors = (state, elements, i18nInstance) => {
  const { feedback } = elements;
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18nInstance.t(state.rssForm.errors.err);

  const { rssFormInput } = elements;
  rssFormInput.classList.add('is-invalid');
};

const renderFeeds = (state, elements, i18nInstance) => {
  const { feedContainer } = elements;
  let feedList;
  if (!feedContainer.querySelector('.card-body')) {
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18nInstance.t('containers.feeds');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.append(h2);

    const cardBorder = document.createElement('div');
    cardBorder.classList.add('card', 'border-0');
    cardBorder.append(cardBody);

    feedContainer.append(cardBorder);

    feedList = document.createElement('ul');
  } else {
    feedList = feedContainer.querySelector('ul');
    feedList.textContent = '';
  }
  feedList.classList.add('list-group', 'border-0', 'rounded-0');

  state.rss.feedList.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    li.append(h3, p);
    feedList.append(li);
  });
  feedContainer.append(feedList);
};

const renderPosts = (state, elements, i18nInstance, ws) => {
  const wathchedUiState = ws;
  let postList;
  const { postContainer } = elements;
  if (!postContainer.querySelector('.card-body')) {
    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18nInstance.t('containers.posts');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.append(h2);

    const cardBorder = document.createElement('div');
    cardBorder.classList.add('card', 'border-0');
    cardBorder.append(cardBody);

    postContainer.append(cardBorder);

    postList = document.createElement('ul');
  } else {
    postList = postContainer.querySelector('ul');
    postList.textContent = '';
  }
  postContainer.classList.add('list-group', 'border-0', 'rounded-0');

  state.rss.postList.forEach((post) => {
    const postState = state.uiState.postsPreview.filter((el) => el.postId === post.id)[0].state;
    const aClassList = postState === 'not viewed';

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const button = document.createElement('button');
    button.addEventListener('click', () => {
      wathchedUiState.selectedPostId = post.id;
      state.uiState.postsPreview.forEach((postPreview) => {
        const postPrev = postPreview;
        if (postPrev.postId === post.id) {
          postPrev.state = 'viewed';
        }
      });
    });
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18nInstance.t('posts.buttons');
    const buttonsAttributes = [['type', 'button'], ['data-id', `${post.id}`], ['data-bs-toggle', 'modal'], ['data-bs-target', '#modal']];
    setAttributes(button, buttonsAttributes);

    const a = document.createElement('a');
    a.addEventListener('click', () => {
      wathchedUiState.selectedPostId = post.id;
      state.uiState.postsPreview.forEach((postPreview) => {
        const postPrev = postPreview;
        if (postPrev.postId === post.id) {
          postPrev.state = 'viewed';
        }
      });
    });
    if (aClassList === true) {
      a.classList.add('fw-bold');
    } else {
      a.classList.add('fw-normal', 'link-secondary');
    }
    a.textContent = post.title;
    const aAttributes = [['href', `${post.link}`], ['data-id', `${post.id}`], ['target', '_blank'], ['rel', 'noopener noreferer']];
    setAttributes(a, aAttributes);

    li.append(a, button);
    postList.append(li);
  });
  postContainer.append(postList);
};

const renderRssForm = (elements, i18nInstance) => {
  const form = elements.rssForm;
  form.reset();
  form.focus();

  const { rssFormInput } = elements;
  rssFormInput.classList.remove('is-invalid');

  const { feedback } = elements;
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18nInstance.t('rssForm.success');
};

export default (state, elements, i18nInstance) => {
  const wathchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'processState':
        if (value === 'loaded') {
          renderRssForm(elements, i18nInstance);
        }
        if (value === 'failed') {
          renderErrors(state, elements, i18nInstance);
        }
        break;
      case 'rss.feedList': renderFeeds(state, elements, i18nInstance);
        break;
      case 'rss.postList': renderPosts(state, elements, i18nInstance, wathchedState);
        break;
      case 'selectedPostId': renderModal(value, state, elements);
        break;
      default:
        break;
    }
  });
  return wathchedState;
};
