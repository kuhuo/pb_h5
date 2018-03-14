import { SHOWPOST } from '../types';

const state = {
  showPost: {
    show: false,
    textOnly: false // 只发布文字动态
  }
};

const mutations = {
  [SHOWPOST] (state, options) {
    state.showPost = { ...state.showPost, ...options};
  }
};

const actions = {
  [SHOWPOST] (context, cb) {
    cb ( (options) => {
      context.commit(SHOWPOST, options);
    })
  }
};

const getters = {

};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;