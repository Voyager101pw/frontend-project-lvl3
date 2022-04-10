/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import { string, setLocale } from 'yup';
import resources from './locale/index.js';

// For create custom instance Validator with support locale (i18next)!
class Validator {
  constructor(state, formElements) {
    this.state = state;
    this.formElements = formElements;
  }

  // Imitation real interface from package yup (method "validate").
  validate(url) {
    // Init & Configuring "i18next" for messages from the validator instance

    const { form, input } = this.formElements;
    const { links } = this.state;
    const schema = string().url().notOneOf(links, i18next.t('uniq'));

    schema.validate(url)
      .then((urlValid) => {
        this.state.error = {};
        this.state.links.push(urlValid);
        form.reset();
      })
      .catch(({ message }) => {
        this.state.error = { message };
      })
      .finally(() => input.focus());
  }
}

const initValidator = (state = {}, formElements = []) => {
  const { lng } = state;

  i18next.init({
    lng,
    resources,
  });

  setLocale({
    string: { url: i18next.t('url') },
  });

  return new Validator(state, formElements);
};

export default initValidator;
