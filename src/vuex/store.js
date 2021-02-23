/**
 * vuex最核心的管理对象
 */
import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

import shop from "./module/module";
import msite from "./module/msite";
import user from "./module/user";





Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    shop,
    msite,
    user
  },
  state,
  mutations,
  actions,
  getters,
});
