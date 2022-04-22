/* eslint-disable no-param-reassign */
import { string, setLocale } from 'yup';

class Validator {
  constructor(state) {
    this.state = state;
  }

  validate(url) {
    const { urls } = this.state;

    setLocale({
      string: {
        url: 'url',
      },
    });

    const schema = string().url().notOneOf(urls, 'uniq');
    return schema.validate(url).then((validUrl) => validUrl);
  }
}

export default Validator;
