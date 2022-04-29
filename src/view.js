/* eslint-disable no-undef */

const addElm = (elm) => document.createElement(elm);
const addCls = (elm, ...classes) => elm.classList.add(...classes);

const createContainer = (container, i18next) => {
  const card = document.createElement('div');
  const ul = document.createElement('ul');
  const title = addElm('h2');

  addCls(card, 'card', 'border-0');
  addCls(title, 'card-title', 'h4', 'px-3', 'py-3');
  addCls(ul, 'list-group', 'border-0', 'rounded-0');

  title.textContent = container.id === 'posts'
    ? i18next.t('cards.posts')
    : i18next.t('cards.feeds');
  card.append(title, ul);
  container.appendChild(card);
};

const renderPosts = (container, state, i18next) => {
  const { posts } = state;
  const ulChildren = posts.map(({ id, title, wasRead }) => {
    const [a, button, li] = [addElm('a'), addElm('button'), addElm('li')];
    addCls(a, (wasRead ? 'fw-normal' : 'fw-bold'));
    addCls(button, 'btn', 'btn-outline-primary', 'btn-sm');
    addCls(li, 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0');

    a.href = '#';
    a.textContent = title;
    button.textContent = i18next.t('cards.button');
    button.setAttribute('type', 'button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    li.append(a, button);
    return li;
  });
  container.querySelector('ul').replaceChildren(...ulChildren);
};

const renderFeeds = (container, state) => {
  const { feeds } = state;
  const ulChildren = feeds.map((feed) => {
    const { title, description } = feed;
    const li = addElm('li');

    li.append(addElm('h3'), addElm('p'));
    const [h3, p] = li.childNodes;

    addCls(li, 'list-group-item', 'border-0');
    addCls(h3, 'h6', 'm-0');
    addCls(p, 'text-muted', 'small');

    h3.textContent = title;
    p.textContent = description;

    return li;
  });
  container.querySelector('ul').replaceChildren(...ulChildren);
};

const applayLocale = (i18next) => {
  document.querySelector('h1').textContent = i18next.t('trans.title');
  document.querySelector('.lead').textContent = i18next.t('trans.subTitle');
  document.querySelector('label').textContent = i18next.t('trans.label');
  document.getElementById('add').textContent = i18next.t('trans.button');
  document.querySelector('p.text-muted').textContent = i18next.t('trans.example');
  document.querySelector('a.btn').textContent = i18next.t('modal.read');
  document.querySelector('button.btn-secondary').textContent = i18next.t('modal.close');
};

// Представление — этот компонент отвечает за взаимодействие с пользователем.
// То есть код компонента view определяет внешний вид приложения и способы его использования.
const view = (state, elements, i18next) => {
  applayLocale(i18next);
  if (state.error) {
    addCls(input, 'is-invalid');
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = i18next.t(state.error);
    input.focus();
    return;
  }
  if ([...feedback.classList].includes('text-danger')) {
    feedback.textContent = i18next.t('success');
    feedback.classList.replace('text-danger', 'text-success');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }

  const postsNode = document.getElementById('posts');
  const feedsNode = document.getElementById('feeds');

  [postsNode, feedsNode].forEach((node) => {
    if (!node.hasChildNodes()) createContainer(node, i18next);
  });

  const postContainer = postsNode.querySelector('div.card');
  const feedContainer = feedsNode.querySelector('div.card');
  renderPosts(postContainer, state, i18next);
  renderFeeds(feedContainer, state);
};

export default view;
