/**
 * 对axios进行二次封装 一个能触发ajax的函数
 */
import axios from "axios";
import qs from "qs";
import router from "@/router";
import { Indicator } from "mint-ui";

const instance = axios.create({
  // baseURL : "http://localhost:4000",  出现跨域
  baseURL: "/api", //让代理服务器转发请求4000
  timeout: 20000, //配置请求超时的时间
});

//添加请求拦截器：即将要发送请求时，将请求拦截，对当前请求进行批量处理
instance.interceptors.request.use((config) => {
  //显示加载提示框
  Indicator.open({
    text: "加载中...",
    spinnerType: "triple-bounce",
  });
  // 1.config包含当前请求的所有请求信息: method url data
  // 2.对请求体参数进行urlencode处理，而不适用默认的json方式（后台接口不支持
  const data = config.data;
  if (data instanceof Object) {
    config.data = qs.stringify(data);
  }
  //3携带token的方式 1.cookie 2. 请求参数 3请求头[authorization]
  let token = localStorage.getItem("token_key");
  if (config.headers.firstLogin) {
    if (token) {
      config.headers.authorization = token;
      config.headers.firstLogin = false;
    } else {
      //没有token的情况，没有必要自动登录
      // throw Error("请先登录");
    }
  }
  return config;
});
//设置响应拦截器
instance.interceptors.response.use(
  (response) => {
    //隐藏加载提示框
    Indicator.close();

    // console.log("res interceptor");

    // return response;
    // 请求成功的数据不是response 而是 response.data
    return response.data;
  },
  (error) => {
    //隐藏加载提示框
    Indicator.close();
    if (!error.response) {
      console.log('error.response', error.response)
      //请求没有真正发出去，在请求拦截器报的错
      alert(error.message);
      //跳转至登录页
      if (router.currentRoute.path !== "/login") {
        // location.href = "http://localhost:8080/login";
        router.replace("/login");
      }
    } else {
      //发送请求后获取错误信息对象
      if (error.response.status === 401) {
        alert("token过期，重新登录");
      } else if (error.response.status === 404) {
        alert("请求资源未找到");
      } else {
        alert("请求错误");
      }
    }
    // return Promise.reject(error)
    // 统一处理请求异常
    // alert("请求出错：" + error.message);
    return new Promise(() => {}); //返回一个pending状态的promise =>中断promise链
  }
);
export default instance;
