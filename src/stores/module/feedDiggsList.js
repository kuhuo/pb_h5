import { SHOWFEEDDIGGSLISTS, APPENDDIGGS, DIGGLISTS } from '../types';

const state = {
  diggLists: {
    show: false,
    diggs: {}
  }
};

const mutations = {
  [SHOWFEEDDIGGSLISTS] (state, diggList) {
    state.diggLists = { ...state.diggLists, ...diggList };
    if(diggList.show) {
      document.body.style.overflow='hidden';
    } else {
      document.body.style.overflow='auto';
    }
  },
  [APPENDDIGGS] (state, addedList) {
    state.diggLists.diggs = { ...state.diggLists.diggs, ...addedList };
  }
};

const actions = {
  [SHOWFEEDDIGGSLISTS]: (context, cb) => {
    cb( (diggList) => {
      context.commit(SHOWFEEDDIGGSLISTS, diggList);
    })
  },
  [APPENDDIGGS]: (context, cb) => {
    cb( (addedList) => {
      context.commit(APPENDDIGGS, addedList);
    });
  }
};

const getters = {
  [DIGGLISTS]: state => {
    return state.diggLists.diggs;
  }
};

const store = {
  state,
  mutations,
  actions,
  getters
};

export default store;