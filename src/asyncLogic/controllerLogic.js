/* eslint-disable no-param-reassign */
import axios from 'axios';
import parser from './parser';

const makeRequest = (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then(({ data }) => data.contents);

const updateState = ({ receivedFeed, receivedPosts }, state, url) => {
  state.feeds = [...state.feeds, receivedFeed];
  state.posts = [...state.posts, ...receivedPosts];
  state.urls = [...state.urls, url];
  state.error = null;
  return url;
};

const getIds = (posts) => posts.map(({ id }) => id);
const updateDiff = ({ receivedPosts }, state) => {
  try {
    const oldPosts = state.posts;
    const [receivedIds, oldIds] = [receivedPosts, oldPosts].map(getIds);
    const newIds = receivedIds.filter((receivedId) => !oldIds.includes(receivedId));
    if (newIds.length) {
      const newPosts = receivedPosts.filter(({ id }) => newIds.includes(id));
      state.posts = [...state.posts, ...newPosts];
      state.error = null;
      return;
    }
  } catch (e) { state.error = e; }
};

const getUpdatedPosts = (state, url) => Promise.resolve(url)
  .then(makeRequest)
  .then(parser)
  .then((data) => updateDiff(data, state))
  .then(() => setTimeout(() => getUpdatedPosts(state, url), 5000));

const watchUpdate = (state, url) => getUpdatedPosts(state, url);

const asyncLogic = (state, validator, url) => {
  validator.validate(url)
    .then(makeRequest)
    .then(parser)
    .then((data) => updateState(data, state, url))
    .then(() => watchUpdate(state, url))
    .catch(({ message }) => { state.error = message; });
};

export default asyncLogic;
// https://lorem-rss.herokuapp.com/feed?length=1&unit=second&interval=4
