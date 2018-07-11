export const SET_IS_BOTTOM_TESTS = 'SET_IS_BOTTOM_TESTS';

export const state = () => ({
  isBottomTests: false
});

export const mutations = {
  [SET_IS_BOTTOM_TESTS](state, isBottomTests) {
    state.isBottomTests = isBottomTests;
    console.log(isBottomTests);
    // localStorage.setItem('isBottomTests', isBottomTests);
  }
};
