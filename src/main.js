import Vue from "vue";
import "lib-flexible";
import "./validate"
import "./mock/mockserver"
import loading from '@/common/images/loading.jpg'
import VueLazyload from "vue-lazyload";

import * as API from "./api"

import router from "./router";
import store from "./vuex/store";
import i18n from "./i18n"
import './filters'

import App from "./App.vue";
import Header from "./components/Header/Header.vue";
import Stars from "@/components/Stars/Stars.vue";
import { Button, MessageBox } from "mint-ui";

Vue.component(Button.name, Button);
Vue.component(MessageBox.name, MessageBox);


Vue.use(VueLazyload,{
  loading,//在要显示的图片没有加载到前使用
})//内部定义了一个全局指令 lazy



// 注册全局组件
Vue.component("Header", Header);
Vue.component("Stars", Stars);

Vue.prototype.$API = API
new Vue({
  el: "#app",
  render: (createElements) => createElements(App),
  router, //所有组件都能看到$router 和 $route  <router-link> 和 <router-view>
  store, //所有组件都能看到$store
  i18n,
});
