/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
// Представление — этот компонент отвечает за взаимодействие с пользователем.
// То есть код компонента view определяет внешний вид приложения и способы его использования.

const addElm = (elm) => document.createElement(elm);
const addCls = (elm, ...classes) => elm.classList.add(...classes);

const createContainer = (container) => {
  const card = document.createElement('div');
  const ul = document.createElement('ul');
  const title = addElm('h2');

  addCls(card, 'card', 'border-0');
  addCls(title, 'card-title', 'h4', 'px-3', 'py-3');
  addCls(ul, 'list-group', 'border-0', 'rounded-0');

  title.textContent = container.id === 'posts' ? 'Посты' : 'Фиды'; // Need translate
  card.append(title, ul);
  container.appendChild(card);
};

const renderPosts = (container, state) => {
  const { posts } = state;
  const ulChildren = posts.map(({
    id, title, description, url,
  }) => {
    const [a, button, li] = [addElm('a'), addElm('button'), addElm('li')];
    addCls(a, 'fw-bold');
    addCls(button, 'btn', 'btn-outline-primary', 'btn-sm');
    addCls(li, 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0');

    a.href = url;
    a.textContent = title;
    button.textContent = 'Просмотр';
    button.dataset.id = id;

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
    addCls(p, 'text-muted');

    h3.textContent = title;
    p.textContent = description;

    return li;
  });
  container.querySelector('ul').replaceChildren(...ulChildren);
};

const view = (state, elements, i18next) => {
  if (state.error) {
    addCls(input, 'is-invalid');
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = i18next.t(state.error);
    input.focus();
    return;
  }
  if ([...feedback.classList].includes('text-danger')) {
    feedback.textContent = i18next.t('valid');
    feedback.classList.replace('text-danger', 'text-success');
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }

  const postsNode = document.getElementById('posts');
  const feedsNode = document.getElementById('feeds');

  [postsNode, feedsNode].forEach((node) => {
    if (!node.hasChildNodes()) createContainer(node);
  });

  const postContainer = postsNode.querySelector('div.card');
  const feedContainer = feedsNode.querySelector('div.card');
  renderPosts(postContainer, state);
  renderFeeds(feedContainer, state);
};

export default view;
