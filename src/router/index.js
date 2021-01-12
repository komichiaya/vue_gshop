/**
 * 向外暴露路由器模块
 */
import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
export default new VueRouter({
  mode: "history",
  routes,
});
