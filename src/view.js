/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import validator from './validator.js';
import parser from './parser.js';

const makeRequest = (url) => {
  try {
    const uri = encodeURIComponent(url);
    const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${uri}`;
    return axios.get(proxy).then(({ data }) => data.contents);
  } catch (e) {
    throw Error('errors.request');
  }
};

const updateState = (state, url, parsedData) => {
  const { receivedFeed, receivedPosts } = parsedData;
  state.feeds = [...state.feeds, receivedFeed];
  state.posts = [...state.posts, ...receivedPosts];
  state.urls = [...state.urls, url];
  state.error = false;
  return url;
};

const getIds = (posts) => posts.map(({ id }) => id);
const extractUpdatedPosts = (state, { receivedPosts }) => {
  const oldPosts = state.posts;
  const [receivedIds, oldIds] = [receivedPosts, oldPosts].map(getIds);
  const newIds = receivedIds.filter(
    (receivedId) => !oldIds.includes(receivedId)
  );
  if (newIds.length) {
    const newPosts = receivedPosts.filter(({ id }) => newIds.includes(id));
    state.posts = [...state.posts, ...newPosts];
  }
};

// Делегируем оброботку события одному ul, а не всем элементам li
const addUlListener = (state) => () => {
  const ul = document.getElementById('posts').querySelector('ul');
  ul.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    const btn = e.target;
    const selectedId = btn.getAttribute('data-id');
    state.openPost = selectedId;
    const selectedPost = state.posts.filter(({ id }) => id === selectedId);
    selectedPost[0].wasRead = true;
    const { title, description, url } = selectedPost[0]; // [0] Из-за proxy

    const modal = document.getElementById('modal');
    const [modalTitle, modalContent] = [
      modal.querySelector('.modal-title'),
      modal.querySelector('#modal-content'),
    ];
    const a = modal.querySelector('a');
    a.href = url;
    modalTitle.textContent = title;
    modalContent.textContent = description;
  });
};

// Сценарий-2: запрос > парс > добав. в стейт новое > возбуждение рендера > сценарий-2 (таймером)
const observUpdate = (state, url) =>
  Promise.resolve(url)
    .then(makeRequest)
    .then(parser)
    .then((parsedData) => extractUpdatedPosts(state, parsedData))
    .then(() => {
      setTimeout(() => observUpdate(state, url), 5000);
    });

// Сценарий-1: валид. > запрос > парс > добав.в стейт > возбуждение рендера (view) > сценарий-2
const view = (state, i18next) => {
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    console.log(JSON.stringify(form, null, '  '));
    e.preventDefault();
    const url = e.target.input.value;
    state.readonly = true;
    validator(state)
      .validate(url)
      .then(makeRequest)
      .then(parser)
      .then((parsedData) => updateState(state, url, parsedData)) // render view
      .then(addUlListener(state))
      .then(() => observUpdate(state, url)) // Переход к Сценарию-2
      .catch((e) => {
        state.error = i18next.t(e.message);
      })
      .finally(() => {
        state.readonly = false;
      });
  });
};

export default view;
// https://lorem-rss.herokuapp.com/feed?length=1&unit=second&interval=4

