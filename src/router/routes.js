//常规加载方法
// import MSite from "@/pages/MSite/MSite.vue";
// import Search from "@/pages/Search/Search.vue";
// import Order from "@/pages/Order/Order.vue";
// import Profile from "@/pages/Profile/Profile.vue";
// import Login from "@/pages/Login/Login.vue";
// import Shop from "@/pages/Shop/Shop.vue";

// es10 懒加载 => 被引入模块会被单独打包(代码分割 code split)
// 配置的路由组件是函数（返回动态加载的路由组件模块
// 函数开始不执行(开始不请求加载单独加载打包的路由组件模块代码)
// 当请求对应路径需要显示组件界面时，去加载路由组件打包文件

// 作用 : 减小首页所需js文件大小 => 加快首页显示速度

const Search = () => import("@/pages/Search/Search.vue");
const Order = () => import("@/pages/Order/Order.vue");
const Profile = () => import("@/pages/Profile/Profile.vue");
const Login = () => import("@/pages/Login/Login.vue");
const Shop = () => import("@/pages/Shop/Shop.vue");

import Good from "@/pages/Shop/Good/Goods";
import Info from "@/pages/Shop/Info/Info";
import Rating from "@/pages/Shop/Rating/Ratings";

export default [
  {
    path: "/msite",
    component: () => import("@/pages/MSite/MSite.vue"),
    meta: {
      isShowFooter: true,
    },
  },
  {
    path: "/search",
    component: Search,
    meta: {
      isShowFooter: true,
    },
  },
  {
    path: "/order",
    component: Order,
    meta: {
      isShowFooter: true,
    },
  },
  {
    path: "/profile",
    component: Profile,
    meta: {
      isShowFooter: true,
    },
  },
  {
    path: "/login",
    component: Login,
  },
  {
    name: "shop",
    path: "/shop/:id",
    props: true, //将所有params参数转化成标签属性传递给子路由
    // props :toRouter => ({id : toRouter.params.id}),
    component: Shop,
    children: [
      {
        path: "good",
        component: Good,
      },
      {
        path: "rating",
        component: Rating,
      },
      {
        path: "info",
        component: Info,
      },
      {
        path: "",
        redirect: "good",
      },
    ],
  },
  {
    path: "/",
    redirect: "/msite",
  },
];
