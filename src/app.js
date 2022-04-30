/* eslint-disable no-undef */
import 'bootstrap/js/dist/modal.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import onChange from 'on-change';
import view from './view.js';
import resources from './locale/index.js';
import controller from './controller.js';

const elements = { // Для исключения повторного поиска элемента в dom (optimization).
  form: document.getElementById('form'),
  // input: document.getElementById('input'),
  input: document.getElementById('url-input'),
  feedback: document.getElementById('feedback'),
};

// Модель — этот компонент отвечает за данные, а также определяет структуру приложения
const state = { // state определяет модель
  lng: 'ru',
  feeds: [],
  posts: [],
  urls: [],
  error: null,
};

i18next.init({
  lng: state.lng,
  resources,
});

const watchedState = onChange(state, () => view(state, elements, i18next), { ignoreKeys: ['feeds', 'posts, url'] });

const app = () => {
  console.log(JSON.stringify(document, null, '  '));
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.input.value;
    controller(watchedState, i18next, url);
  });
  // controller(watchedState, i18next, 'https://ru.hexlet.io/lessons.rss');
};

export default app;
