/* eslint-disable no-undef */

const addElm = (elm) => document.createElement(elm);
const addCls = (elm, ...classes) => elm.classList.add(...classes);

const changeLocale = (
  { title, subTitle, label, addBtn, example, modalRead, modalClose },
  i18next
) => {
  modalRead.textContent = i18next.t('modal.read');
  modalClose.textContent = i18next.t('modal.close');
  title.textContent = i18next.t('trans.title');
  subTitle.textContent = i18next.t('trans.subTitle');
  label.textContent = i18next.t('trans.label');
  addBtn.textContent = i18next.t('trans.button');
  example.textContent = i18next.t('trans.example');
};

const renderError = (error, { input, feedback }, i18next) => {
  if (error) {
    addCls(input, 'is-invalid');
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = error;
  } else {
    feedback.textContent = i18next.t('success');
    feedback.classList.replace('text-danger', 'text-success');
    input.classList.remove('is-invalid');
    input.value = '';
  }
  input.focus();
};

const initContainer = (node, i18next) => {
  if (node.hasChildNodes()) return node.querySelector('.card'); // если нода имеет контейнер есть.
  const container = document.createElement('div');
  addCls(container, 'card', 'border-0');
  const ul = document.createElement('ul');
  addCls(ul, 'list-group', 'border-0', 'rounded-0');
  const title = addElm('h2');
  addCls(title, 'card-title', 'h4', 'px-3', 'py-3');
  title.textContent = i18next.t(`cards.${node.id}`);

  container.append(title, ul);
  node.appendChild(container);
  return container;
};

const renderFeeds = (feeds, { feedNode }, i18next) => {
  const container = initContainer(feedNode, i18next); // Делается единожды.
  const children = feeds.map((feed) => {
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
  container.querySelector('ul').replaceChildren(...children);
};

const renderPosts = (posts, { postsNode }, i18next) => {
  const container = initContainer(postsNode, i18next); // Делается единожды.
  const children = posts.map(({ id, title, wasRead, url }) => {
    const [a, button, li] = [addElm('a'), addElm('button'), addElm('li')];
    a.classList.remove('fw-bold');
    if (wasRead) {
      a.classList.replace('fw-bold', 'fw-normal')
      addCls(a, 'link-secondary');
    } else {
      addCls(a, 'fw-bold');
    }
    addCls(button, 'btn', 'btn-outline-primary', 'btn-sm');
    addCls(
      li,
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0'
    );
    a.href = url;
    a.textContent = title;
    a.setAttribute('target', '_blank');
    button.textContent = i18next.t('cards.button');
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    li.append(a, button);
    return li;
  });
  container.querySelector('ul').replaceChildren(...children);
};

const renderFormLock = (readonly, { input, addBtn }) => {
  readonly ? input.setAttribute('readonly', '') : input.removeAttribute('readonly');
  readonly
    ? addBtn.setAttribute('disabled', '')
    : addBtn.removeAttribute('disabled');
};

const renderOpenPost = (id) => {
  const a = document.querySelector(`button[data-id="${id}"]`).previousElementSibling;
  console.log(a)
  a.classList.remove('fw-bold');
  addCls(a, 'fw-normal', 'link-secondary');
}
// Представление — этот компонент отвечает за взаимодействие с пользователем.
// То есть код компонента view определяет внешний вид приложения и способы его использования.
const render = (elems, i18next) => (path, val) => {
  console.log(path, val)
  if (path === 'readonly') renderFormLock(val, elems);
  if (path === 'feeds') renderFeeds(val, elems, i18next);
  if (path === 'posts') renderPosts(val, elems, i18next);
  if (path === 'error') renderError(val, elems, i18next);
  if (path === 'lng') changeLocale(elems, i18next);
  if (path === 'openPost') renderOpenPost(val);
};

export default render;