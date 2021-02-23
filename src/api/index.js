/**
 * 包含n个接口请求函数
 */
import ajax from "./ajax";
//根据经纬度获取位置详情
export const reqAddress = (longitude, latitude) =>
  ajax(`/position/${latitude},${longitude}`);

//获取食品分类列表
export const reqCategorys = () => ajax("/index_category");

//根据经纬度获取商铺列表
export const reqShops = ({ longitude, latitude }) =>
  ajax("/shops", {
    params: {
      longitude,
      latitude,
    },
  });
//发送短信验证码
export const sendCode = ({ phone }) =>
  ajax("/sendcode", {
    params: {
      phone,
    },
  });
//用户名密码登陆

export const LoginWithUsername = ({ name, pwd, captcha }) =>
  ajax.post("/login_pwd", {
    data: { name, pwd, captcha },
    headers: { fistLogin: false },
  });

//手机号验证码登陆
export const LoginWithPhone = ({ phone, code }) =>
  ajax("/login_sms", {
    method: "post",
    data: {
      phone,
      code,
    },
  });
//自动登陆
export const autoLogin = () =>
  ajax("/auto_login", {
    headers: {
      firstLogin: true,
    },
  });
//获取商店信息
export const getShopData = () => ajax("/getShopData");

export const getShop = (id) => ajax("/getShop/" + id);
