/** 
 * store for user list;
 */

import _ from 'lodash';
import { addAccessToken, createAPI } from '../../utils/request';
import { USERS, USERS_APPEND, USERS_ITEM_UPDATE, ADD_USER_TO_VUEX } from '../types';

const state = {
    users: {}
};

const mutations = {
    // 增加单个用户
    [USERS_APPEND](state, user) {
        const users = { ...state.users, [`user_${user.id}`]: user };
        state.users = users;
    },
    // 修改单个用户信息
    [USERS_ITEM_UPDATE](state, user) {
        let {
            [user.id]: oldUser = {}
        } = state.users;
        state.users[`user_${user.id}`] = { ...oldUser, ...user };
    },
    // 批量增加用户信息
    [USERS](state, users) {
        const new_users = { ...state.users, ..._.keyBy(users, (o) => { return (`user_${o.id}`); }) };
        state.users = new_users;
    },

    [ADD_USER_TO_VUEX](state, users) {
        const new_users = { ...state.users, ..._.keyBy(users, (o) => { return (`user_${o.id}`); }) };
        state.users = new_users;
    }
};

const actions = {
    // 异步增加单个用户
    [USERS_APPEND]: (context, cb) => {
        cb((user) => {
            context.commit(USERS_APPEND, user);
        });
    },
    // 批量异步增加用户
    [USERS]: (context, cb) => {
        cb(users => {
            context.commit(USERS, users);
        })
    },

    [ADD_USER_TO_VUEX]({ commit }, users) {
        commit(USERS, users)
    }
};

const getters = {
    // 返回所有用户
    [USERS]: (state) => state.users
};

const store = {
    state,
    mutations,
    actions,
    getters
}

export default store;