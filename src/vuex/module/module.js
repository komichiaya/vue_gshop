import Vue from "vue";
import {
  RECEIVE_SHOPDATA,
  ADD_FOOD_COUNT,
  DEL_FOOD_COUNT,
  CLEAR_CARTSHOPS,
  SAVE_CARTSHOPS,
  RECEIVE_SHOP,
} from "../types";
import { getShopData, getShop } from "@/api";
const state = {
  value: "测试用文字",
  shopData: {},//商家数据
  shopCart : [],//购物车的food
  shop :{}//当前商家
};

const mutations = {
  [RECEIVE_SHOPDATA](state, shopData) {
    state.shopData = shopData;
  },
  [RECEIVE_SHOP](state, data) {
    state.shop = data
  },
  [ADD_FOOD_COUNT](state, { food }) {
    if (food.count > 0) {
      food.count++;
    } else {
      Vue.set(food, "count", 1);
      state.shopCart.push(food);
    }
  },
  [DEL_FOOD_COUNT](state, { food }) {
    if (food.count > 0) {
      food.count--;
      if (food.count === 0) {
        state.shopCart.splice(state.shopCart.indexOf(food), 1);
      }
    }
  },
  [CLEAR_CARTSHOPS](state) {
    //将shopCart中所有food的count变成0
    state.shopCart.forEach((food) => (food.count = 0));
    //清空数组
    state.shopCart = [];
  },
  [SAVE_CARTSHOPS](state, cartShops) {
    state.shopCart = cartShops;
  },
};

const actions = {
  // async getShopDataActions({ commit }) {
  //   let result = await getShopData();
  //   if (result.code === 0) {
  //     commit(RECEIVE_SHOPDATA, result.data);
  //   }
  // },

  //根据id获取对应商家的异步action
  async getShopData({ commit ,state},id) {
      //如果指定id与原有的商家id一致，不需要发请求
      if(id === state.shop.id){
        return
      }

      //当前显示的是另一个商家 删除原本的数据
      if(state.shop.id){
          commit(RECEIVE_SHOP,{});
      }



    let result = await getShop(id);
    if (result.code === 0) {
      const data = result.data
      commit(RECEIVE_SHOP, data);
    }
  },

  changeFoodCount({ commit }, { isAdd, food }) {
    if (isAdd) {
      commit(ADD_FOOD_COUNT, { food });
    } else {
      commit(DEL_FOOD_COUNT, { food });
    }
  },
};

const getters = {
  // //计算一个数组 包含所有food.count > 0 的food
  // shopCart(state) {
  //   return state.shopData.goods.reduce((pre, good) => {
  //     let arr = good.foods.filter((food) => food.count > 0); //过滤出food.count > 0的数组
  //     pre.push(...arr);
  //     return pre;
  //   }, []);
  // }, //性能低下  food.count每改变一次就会重新计算整个数组
  totalCount(state) {
    return state.shopCart.reduce((pre, food) => {
      return (pre += food.count);
    }, 0);
  },
  totalPrice(state) {
    return state.shopCart.reduce((pre, food) => {
      return (pre += food.count * food.price);
    }, 0);
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
