import onChange from 'on-change';
import initValidator from './initValidator.js';
import renderView from './renderView.js';

const formElements = {
  // eslint-disable-next-line no-undef
  form: document.getElementById('form'),
  // eslint-disable-next-line no-undef
  input: document.getElementById('input'),
  // eslint-disable-next-line no-undef
  feedback: document.getElementById('feedback'),
};

const initState = () => {
  const state = {
    lng: 'ru',
    links: [],
    error: {},
  };
  const watchedState = onChange(state, renderView(state, formElements), { ignoreKeys: 'links' });
  return watchedState;
};

const app = () => {
  const state = initState();

  const validator = initValidator(state, formElements);

  formElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const textFromInput = e.target.input.value;
    validator.validate(textFromInput); // Выполняет обязанности контроллера
  });
};

export default app;
