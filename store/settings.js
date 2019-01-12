export const SET_IS_BOTTOM_TESTS = 'SET_IS_BOTTOM_TESTS';
export const SET_IS_PROXY = 'SET_IS_PROXY';
export const SET_IS_CONSOLE_REQUESTS = 'SET_IS_CONSOLE_REQUESTS';
export const SET_MESSAGE_LIMIT = 'SET_MESSAGE_LIMIT';
export const SET_MESSAGE_STORE_LIMIT = 'SET_MESSAGE_STORE_LIMIT';
export const SET_TIMEOUT = 'SET_TIMEOUT';

export const state = () => ({
  isBottomTests: false,
  isProxy: process.env.isProxy,
  isConsoleRequests: false,
  messageLimit: 200, // никогда не может быть больше этого
  messageStoreLimit: 20, // после обновления страницы
  timeout: 1500
});

export const mutations = {
  [SET_IS_BOTTOM_TESTS](state, isBottomTests) {
    state.isBottomTests = isBottomTests;
  },
  [SET_IS_PROXY](state, isProxy) {
    state.isProxy = isProxy;
  },
  [SET_IS_CONSOLE_REQUESTS](state, isConsoleRequests) {
    state.isConsoleRequests = isConsoleRequests;
  },
  [SET_MESSAGE_LIMIT](state, messageLimit) {
    state.messageLimit = messageLimit;
  },
  [SET_MESSAGE_STORE_LIMIT](state, messageStoreLimit) {
    state.messageStoreLimit = messageStoreLimit;
  },
  [SET_TIMEOUT](state, timeout) {
    state.timeout = timeout;
  }
};
