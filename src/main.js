import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import "lib-flexible";

new Vue({
  el: "#app",
  render: (createElements) => createElements(App),
  router,//所有组件都能看到$router 和 $route  <router-link> 和 <router-view>
});
