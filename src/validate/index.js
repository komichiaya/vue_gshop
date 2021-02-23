import Vue from "vue";
import VeeValidate from "vee-validate";
import zh_CN from "vee-validate/dist/locale/zh_CN";


Vue.use(VeeValidate);

VeeValidate.Validator.localize("zh_CN", {
  messages: zh_CN.messages,
  attributes: {
    phone: "手机号",
    code: "验证码",
    name : "用户名",
    pwd : "密码",
    captcha : "验证码"
  },
});

VeeValidate.Validator.extend("mobile", {
  validate: (value) => {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value);
  },
  getMessage: (field) => "必须是11位手机号码",
});


VeeValidate.Validator.extend("code", {
  validate: (value) => {
    return /^\d{4,6}$/.test(value);
  },
  getMessage: (field) => "必须是4到6位随机数字的验证码",
});