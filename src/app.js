/* eslint-disable no-undef */
import i18next from 'i18next';
import onChange from 'on-change';
import view from './view.js';
import resources from './locale/index.js';
import Validator from './Validator.js';
import controllerLogic from './asyncLogic/controllerLogic.js';

const elements = { // Для исключения повторного поиска элемента в dom (optimization).
  form: document.getElementById('form'),
  input: document.getElementById('input'),
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
const validator = new Validator(state);

const app = () => {
  elements.form.addEventListener('submit', (e) => { // Controller
    e.preventDefault();
    const input = e.target.input.value;
    controllerLogic(watchedState, validator, input); // async. controller logic
  });
};

export default app;
