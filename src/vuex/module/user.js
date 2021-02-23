import { RECEIVE_USER, RECEIVE_TOKEN, RECEIVE_LOGINOUT } from "../types";
import { autoLogin } from "@/api";
export default {
  state: {
    user: {}, //用户信息
    token: "", //用户token
  },
  mutations: {
    [RECEIVE_USER](state, user) {
      state.user = user;
    },
    [RECEIVE_TOKEN](state, token) {
      state.token = token;
    },
    [RECEIVE_LOGINOUT](state) {
      state.user = {};
      state.token = "";
      localStorage.removeItem("token_key");
    },
  },
  actions: {
    //获取用户
    async getUser({ commit }, data) {
      commit(RECEIVE_TOKEN, data.token);
      localStorage.setItem("token_key", data.token);
      delete data.token;
      commit(RECEIVE_USER, data);
    },
    /* 
    自动登陆的异步action
    */
    async autoLogin({ commit, state }) {
      if (state.token && !state.user._id) {
        // 必须要有token且没有user信息
        // 发送自动登陆的请求
        const result = await autoLogin();
        if (result.code === 0) {
          const user = result.data; // 没有token
          commit(RECEIVE_USER, { user });
        }
      }
    },
    logout({ commit }) {
      localStorage.removeItem("token_key");
      commit(RESET_USER);
      commit(RESET_TOKEN);
    },
  },
  getters: {},
};
