/* eslint-disable no-param-reassign */
export default (state, formElements) => () => {
  // console.log(path, value, previousValue, applyData);
  const { input, feedback } = formElements;
  if (state.error.message) {
    feedback.textContent = state.error.message; // Set feedback text
    input.classList = 'form-control is-invalid'; // Set form(border) color
  } else {
    feedback.textContent = '';
    input.classList = 'form-control';
  }
};
