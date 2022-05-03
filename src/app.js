/* eslint-disable no-undef */
import i18next from 'i18next';
import onChange from 'on-change';
import render from './render.js';
import resources from './locale/index.js';
import view from './view.js';

const app = () => {
  const elements = {
    modalRead: document.getElementById('modalRead'),
    modalClose: document.getElementById('modalClose'),
    form: document.getElementById('form'),
    title: document.getElementById('title'),
    subTitle: document.getElementById('subTitle'),
    input: document.getElementById('input'),
    label: document.getElementById('label'),
    addBtn: document.getElementById('addBtn'),
    example: document.getElementById('example'),
    feedback: document.getElementById('feedback'),
    feedNode: document.getElementById('feeds'),
    postsNode: document.getElementById('posts'),
  };

  const state = {
    lng: 'ru',
    feeds: [],
    posts: [],
    urls: [],
    error: null,
    readonly: false,
    openPost: null,
  };

  i18next.init({
    lng: state.lng,
    resources,
  });

  const watchedState = onChange(state, render(elements, i18next), {
    ignoreKeys: ['urls'],
  });

  view(watchedState, elements, i18next);
};

export default app;
