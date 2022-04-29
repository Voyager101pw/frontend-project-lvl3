/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import validator from './validator.js';
import parser from './parser';

const makeRequest = (url) => {
  try {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
      .then(({ data }) => data.contents);
  } catch {
    throw Error('errors.request');
  }
};

const updateState = ({ receivedFeed, receivedPosts }, state, url) => {
  state.feeds = [...state.feeds, receivedFeed];
  state.posts = [...state.posts, ...receivedPosts];
  state.urls = [...state.urls, url];
  state.error = null;
  return url;
};

const getIds = (posts) => posts.map(({ id }) => id);
const separateNewPosts = ({ receivedPosts }, state) => {
  try {
    const oldPosts = state.posts;
    const [receivedIds, oldIds] = [receivedPosts, oldPosts].map(getIds);
    const newIds = receivedIds.filter((receivedId) => !oldIds.includes(receivedId));
    const newPosts = newIds.length ? receivedPosts.filter(({ id }) => newIds.includes(id)) : [];
    return newPosts;
  } catch (e) {
    state.error = e;
    return [];
  }
};

const addNewPostsInState = (state, newPosts) => {
  if (newPosts.length) { // Обновление стейта, только когда есть новые посты.
    state.posts = [...state.posts, ...newPosts];
    state.error = null;
  }
};

const addUlListener = (state) => {
  // Предыдущий шаг возбудил рендер, который в свою очередь создал в DOM элемент Ul
  // Что бы не вешать на каждый элемент списка(li) событие клика(для модалки)
  // делегируем обработчки только родителю(ul)
  try {
    const ul = document.getElementById('posts').querySelector('ul');
    ul.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      const btn = e.target;
      const selectedId = btn.getAttribute('data-id');
      const selectedPost = state.posts.filter(({ id }) => id === selectedId);
      selectedPost[0].wasRead = true;
      const { title, description, url } = selectedPost[0]; // [0] Из-за proxy

      const modal = document.getElementById('modal');
      const [modalTitle, modalContent] = [modal.querySelector('.modal-title'), modal.querySelector('#modal-content')];
      const a = modal.querySelector('a');
      a.href = url;
      modalTitle.textContent = title;
      modalContent.textContent = description;
    });
  } catch {
    throw Error('errors.modal');
  }
};
// Сценарий-2: запрос > парс > добав. в стейт новое > возбуждение рендера > сценарий-2 (таймером)
const checkNewPosts = (state, url) => Promise.resolve(url)
  .then(makeRequest)
  .then(parser)
  .then((data) => separateNewPosts(data, state))
  .then((newPosts) => addNewPostsInState(state, newPosts))
  .then(() => setTimeout(() => checkNewPosts(state, url), 5000));

// Сценарий-1: валид. > запрос > парс > добав.в стейт > возбуждение рендера (view) > сценарий-2
const controllerLogic = (state, i18next, url) => {
  validator(state).validate(url)
    .then(makeRequest)
    .then(parser)
    .then((data) => updateState(data, state, url))
    .then(() => addUlListener(state))
    .then(() => checkNewPosts(state, url)) // Переход к Сценарию-2
    .catch(({ message }) => { state.error = i18next.t(message); });
};

export default controllerLogic;
// https://lorem-rss.herokuapp.com/feed?length=1&unit=second&interval=4
// const watchUpdate = (state, url) => getUpdatedPosts(state, url);
