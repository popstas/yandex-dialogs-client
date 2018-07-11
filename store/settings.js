export const SET_IS_BOTTOM_TESTS = 'SET_IS_BOTTOM_TESTS';
export const SET_IS_PROXY = 'SET_IS_PROXY';
export const SET_IS_CONSOLE_REQUESTS = 'SET_IS_CONSOLE_REQUESTS';

export const state = () => ({
  isBottomTests: false,
  isProxy: process.env.isProxy,
  isConsoleRequests: false
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
  }
};
