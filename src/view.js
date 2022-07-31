import onChange from 'on-change';
import { setAttributes } from './auxiliaryFunctions';

const renderErrors = (state, elements, i18nInstance) => {
  const formFeedback = elements.feedback;
  const input = elements.rssFormInput;
  formFeedback.classList.remove('text-success');
  formFeedback.classList.add('text-danger');
  input.classList.add('is-invalid');
  formFeedback.textContent = i18nInstance.t(state.rssForm.errors.err);
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

const renderPosts = (state, elements, i18nInstance) => {
  const renderPostsState = state;
  const { postContainer } = elements;
  if (!postContainer.querySelector('.card-body')) {
    const cardBorder = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">${i18nInstance.t('containers.posts')}</h2></div></div>`;
    postContainer.innerHTML = cardBorder;
  }
  const postList = postContainer.querySelector('ul') ? postContainer.querySelector('ul') : document.createElement('ul');
  postList.innerHTML = '';
  postList.classList.add('list-group', 'border-0', 'rounded-0');
  state.rss.postList.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const button = document.createElement('button');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      renderPostsState.uiState.postsPreview.forEach((postPreview) => {
        const postPrev = postPreview;
        if (postPrev.postId === post.id) {
          postPrev.state = 'viewed';
        }
      });
      button.previousElementSibling.classList.add('fw-normal', 'link-secondary');
      const { fade } = elements;
      fade.classList.add('show');
      const fadeHeader = document.querySelector('.fade .modal-title');
      fadeHeader.textContent = post.title;
      const fadeBody = document.querySelector('.fade  .text-break');
      fadeBody.textContent = post.description;
      const fadeFooter = document.querySelector('.fade .full-article');
      fadeFooter.setAttribute('href', `${post.link}`);
    });
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18nInstance.t('posts.buttons');
    const buttonsAttributes = [['type', 'button'], ['data-id', `${post.id}`], ['data-bs-toggle', 'modal'], ['data-bs-target', '#modal']];
    setAttributes(button, buttonsAttributes);
    const a = document.createElement('a');
    a.classList.add('fw-bold');
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
  const input = elements.rssFormInput;
  const formFeedback = elements.feedback;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.add('text-success');
  form.reset();
  form.focus();
  input.classList.remove('is-invalid');
  formFeedback.textContent = i18nInstance.t('rssForm.success');
};

const render = (elements, i18nInstance, state) => (path, value) => {
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
    case 'rss.postList': renderPosts(state, elements, i18nInstance);
      break;
    default:
      break;
  }
};

const view = (state, elements, i18nInst) => onChange(state, render(elements, i18nInst, state));

export default view;
