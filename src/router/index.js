/**
 * 向外暴露路由器模块
 */
import Vue from "vue";
import VueRouter from "vue-router";
import { Indicator } from "mint-ui";

import routes from "./routes";
Vue.use(VueRouter);

//解决重复点击的报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  mode: "history",
  routes,
});
let paths = ["/order"]; //需要检查的路由路径数组
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token_key");
  let path = to.path;
  if (paths.indexOf(path) !== -1) {
    //如果没有登陆会强跳转登陆页面
    if (!token) {
      Indicator.open({
        text: "您尚未登录，正在为您跳转登录页面...",
        spinnerType: "fading-circle",
      });
      setTimeout(() => {
         Indicator.close();
        next("/login");
      }, 1000);
      return;
    }
  }
  next(); //放行
});

export default router;
