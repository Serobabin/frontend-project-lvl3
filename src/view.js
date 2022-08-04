import onChange from 'on-change';
import { setAttributes } from './auxiliaryFunctions';

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
  if (!feedContainer.querySelector('.card-body')) {
    const cardBorder = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">${i18nInstance.t('containers.feeds')}</h2></div></div>`;
    feedContainer.innerHTML = cardBorder;
  }

  const feedList = feedContainer.querySelector('ul') ? feedContainer.querySelector('ul') : document.createElement('ul');
  feedList.innerHTML = '';
  feedList.classList.add('list-group', 'border-0', 'rounded-0');
  const liList = state.rss.feedList.map((feed) => {
    const li = `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${feed.title}</h3><p class="m-0 small text-black-50">${feed.description}</p></li>`;
    return li;
  });
  feedList.innerHTML = liList.join('\n');
  feedContainer.append(feedList);
};

const renderPosts = (state, elements, i18nInstance, uiState) => {
  const wathchedUiState = uiState;

  const { postContainer } = elements;
  if (!postContainer.querySelector('.card-body')) {
    const cardBorder = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">${i18nInstance.t('containers.posts')}</h2></div></div>`;
    postContainer.innerHTML = cardBorder;
  }

  const postList = postContainer.querySelector('ul') ? postContainer.querySelector('ul') : document.createElement('ul');
  postList.innerHTML = '';
  postList.classList.add('list-group', 'border-0', 'rounded-0');
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

const renderState = (elements, i18nInstance, state, wathchedUiState) => (path, value) => {
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
    case 'rss.postList': renderPosts(state, elements, i18nInstance, wathchedUiState);
      break;
    default:
      break;
  }
};

export const viewState = (state, elements, i18nInstance, uiState) => onChange(
  state,
  renderState(
    elements,
    i18nInstance,
    state,
    uiState,
  ),
);

const renderUiState = (state, elements) => (path, value) => {
  if (path === 'selectedPostId') {
    renderModal(value, state, elements);
  }
};

export const viewUiState = (uiState, state, elements) => onChange(
  uiState,
  renderUiState(
    state,
    elements,
  ),
);
