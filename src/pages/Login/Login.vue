<!--  -->
<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a
            href="javascript:;"
            :class="{ on: isShowSms }"
            @click="isShowSms = true"
            >短信登录</a
          >
          <a
            href="javascript:;"
            :class="{ on: !isShowSms }"
            @click="isShowSms = false"
            >密码登录</a
          >
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{ on: isShowSms }">
            <section class="login_message">
              <input
                type="tel"
                maxlength="11"
                placeholder="手机号"
                v-model="phone"
                name="phone"
                v-validate="'required|mobile'"
              />
              <span style="color: red" v-show="errors.has('phone')">{{
                errors.first("phone")
              }}</span>
              <button
                :disabled="!isRightPhone || computeTime > 0"
                class="get_verification"
                :class="{ right_phone_number: isRightPhone }"
                @click.prevent="sendCode"
              >
                {{
                  computeTime > 0
                    ? `(${computeTime}s后可以重新获取)`
                    : "发送验证码"
                }}
              </button>
            </section>
            <section class="login_verification">
              <!-- <input type="text" maxlength="8" placeholder="验证码"
                v-model="code" name="code" v-validate="{required: true,regex: /^\d{6}$/}"> -->
              <input
                type="text"
                maxlength="8"
                placeholder="验证码"
                v-model="code"
                name="code"
                v-validate="'required|code'"
              />
              <span style="color: red" v-show="errors.has('code')">{{
                errors.first("code")
              }}</span>
            </section>
          </div>
          <div :class="{ on: !isShowSms }">
            <section>
              <section class="login_message">
                <input
                  type="text"
                  placeholder="用户名"
                  v-model="name"
                  name="name"
                  v-validate="'required'"
                />
                <span style="color: red" v-show="errors.has('name')">{{
                  errors.first("name")
                }}</span>
              </section>
              <section class="login_verification">
                <input
                  :type="isShowPwd ? 'text' : 'password'"
                  placeholder="密码"
                  v-model="pwd"
                  name="pwd"
                  v-validate="'required'"
                />
                <div
                  class="switch_button"
                  :class="isShowPwd ? 'on' : 'off'"
                  @click="isShowPwd = !isShowPwd"
                >
                  <div
                    class="switch_circle"
                    :class="{ right: isShowPwd }"
                  ></div>
                  <span class="switch_text">{{ isShowPwd ? "abc" : "" }}</span>
                </div>
                <span style="color: red" v-show="errors.has('pwd')">{{
                  errors.first("pwd")
                }}</span>
              </section>
              <section class="login_message">
                <input
                  type="text"
                  maxlength="11"
                  placeholder="验证码"
                  v-model="captcha"
                  name="captcha"
                  v-validate="{ required: true, regex: /^[0-9a-zA-Z]{4}$/ }"
                />
                <!-- 当前发送是一个跨域的http请求(不是ajax请求), 没有跨域的问题 -->
                <img
                  class="get_verification"
                  src="http://localhost:4000/captcha"
                  alt="captcha"
                  @click="updateCaptcha"
                  ref="captcha"
                />
                <!-- 原本404, 利用代理服务器转发请求4000的后台接口 -->
                <!-- <img class="get_verification" src="/api/captcha" alt="captcha"> -->
                <span style="color: red" v-show="errors.has('captcha')">{{
                  errors.first("captcha")
                }}</span>
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">
            {{ $t("login_login") }}
          </button>
        </form>
        <a href="javascript:;" class="about_us">{{ $t("login_aboutUs") }}</a>
      </div>
      <a
        href="javascript:"
        class="go_back"
        @click="$router.replace('/profile')"
      >
        <i class="iconfont icon-jiantou2"></i>
      </a>

      <button @click="toggleLanguage">切换语言</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      isShowSms: false,
      phone: "",
      isShowPwd: false,
      computeTime: 0,
      code: "",
      name: "",
      pwd: "",
      captcha: ""
    };
  },
  computed: {
    isRightPhone() {
      return /^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone); //检查是否是一个正确的手机号码
    },
  },
  methods: {
    toggleLanguage() {
      // 根据当前语言得到新的语言
      const locale = this.$i18n.locale === "en" ? "zh_CN" : "en";
      // 指定新的语言
      this.$i18n.locale = locale;
      // 将新的语言保存到local
      localStorage.setItem("locale_key", locale);
    },
    updateCaptcha() {
      this.$refs.captcha.src =
        "http://localhost:4000/captcha?time=" + Date.now();
    },
    async sendCode() {
      //重置倒计时时间
      this.computeTime = 10;
      // 开启倒计时
      let id = setInterval(() => {
        this.computeTime--;
        this.computeTime === 0 && clearTimeout(id);
      }, 1000);
      //发送请求 请求验证码
      let result = await this.$API.sendCode({ phone: this.phone });
      if (result.code === 0) {
        alert("短信已发送");
      } else {
        alert(result.msg);
      }
    },
    async login() {
      //1.前端验证
      let { isShowSms, phone, code, name, pwd, captcha } = this;
      let names = !isShowSms ? ["name", "pwd", "captcha"] : ["phone", "code"];
      let result;
      const success = await this.$validator.validateAll(names);
      if (success) {
        //前端验证成功
        //2.后端验证
        //1#收集数据
        //2#发送请求
        //判断用户登陆方式
        if (!isShowSms) {
          //用户名
          result = await this.$API.LoginWithUsername({ name, pwd, captcha });
          if (result.code === 1) {
            alert("请检查用户名密码验证码是否正确");
            this.updateCaptcha();
            this.captcha = "";
          }
        } else {
          //验证码
          result = await this.$API.LoginWithPhone({ phone, code });
          if (result.code === 1) {
            alert("请检查输入是否正确");
            this.updateCaptcha();
            this.code = "";
          }
        }
        //统一处理登陆成功
        if (result.code === 0) {
          //登陆成功
          alert("登陆成功");
          this.$router.replace("/profile");
          //将用户数据传给vuex
          this.$store.dispatch("getUser", result.data);
        }
      } else {
        //前端验证失败
        alert("登录失败");
      }
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},

  //在当前组件对象被创建前调用,不能直接访问this(不是组件对象)
  //但可以通过next（component =>{}),在回调函数中访问组件对象
  beforeRouteEnter(to, from, next) {
    /**
     * next((component) =>{ //回调函数在组件对象创建后回调执行
      //如果要访问this
      //component.xxx
    })
     */

    let token = localStorage.getItem("token_key");
    // 如果已经登录,强制跳转到个人中心
    if (token) {
      next("/profile");
    } else {
      //否则放行

      next();
    }
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl'
.loginContainer
  width: 100%
  height: 100%
  background: #fff
  .loginInner
    padding-top: 60px
    width: 80%
    margin: 0 auto
    .login_header
      .login_logo
        font-size: 40px
        font-weight: bold
        color: #02a774
        text-align: center
      .login_header_title
        padding-top: 40px
        text-align: center
        >a
          color: #333
          font-size: 14px
          padding-bottom: 4px
          &:first-child
            margin-right: 40px
          &.on
            color: #02a774
            font-weight: 700
            border-bottom: 2px solid #02a774
    .login_content
      >form
        >div
          display: none
          &.on
            display: block
          input
            width: 100%
            height: 100%
            padding-left: 10px
            box-sizing: border-box
            border: 1px solid #ddd
            border-radius: 4px
            outline: 0
            font: 400 14px Arial
            &:focus
              border: 1px solid #02a774
          .login_message
            position: relative
            margin-top: 16px
            height: 48px
            font-size: 14px
            background: #fff
            .get_verification
              position: absolute
              top: 50%
              right: 10px
              transform: translateY(-50%)
              border: 0
              color: #ccc
              font-size: 14px
              background: transparent
              &.right_phone_number
                color: black
          .login_verification
            position: relative
            margin-top: 16px
            height: 48px
            font-size: 14px
            background: #fff
            .switch_button
              font-size: 12px
              border: 1px solid #ddd
              border-radius: 8px
              transition: background-color 0.3s, border-color 0.3s
              padding: 0 6px
              width: 30px
              height: 16px
              line-height: 16px
              color: #fff
              position: absolute
              top: 50%
              right: 10px
              transform: translateY(-50%)
              &.off
                background: #fff
                .switch_text
                  float: right
                  color: #ddd
              &.on
                background: #02a774
              >.switch_circle
                // transform translateX(27px)
                position: absolute
                top: -1px
                left: -1px
                width: 16px
                height: 16px
                border: 1px solid #ddd
                border-radius: 50%
                background: #fff
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)
                transition: transform 0.3s
                &.right
                  transform: translateX(27px)
          .login_hint
            margin-top: 12px
            color: #999
            font-size: 14px
            line-height: 20px
            >a
              color: #02a774
        .login_submit
          display: block
          outline: none
          width: 100%
          height: 42px
          margin-top: 30px
          border-radius: 4px
          background: #4cd96f
          color: #fff
          text-align: center
          font-size: 16px
          line-height: 42px
          border: 0
      .about_us
        display: block
        font-size: 12px
        margin-top: 20px
        text-align: center
        color: #999
    .go_back
      position: absolute
      top: 5px
      left: 5px
      width: 30px
      height: 30px
      >.iconfont
        font-size: 20px
        color: #999
</style>
