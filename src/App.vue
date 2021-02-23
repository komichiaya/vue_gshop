<!--  -->
<template>
  <div>
    <keep-alive exclude="search,shop"> <!--在管理的路由之中相互切换，不会死亡 -->
      <router-view></router-view>
    </keep-alive>
    <FooterGuide v-show="$route.meta.isShowFooter"></FooterGuide>
  </div>
</template>

<script>
import { RECEIVE_USER } from "./vuex/types";
import FooterGuide from "./components/FooterGuide/FooterGuide";
export default {
  components: {
    FooterGuide,
  },
  data() {
    return {};
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    this.$store.dispatch("getAddress");
    let result = await this.$API.autoLogin();
    //存入vuex中
    this.$store.commit(RECEIVE_USER, result.data);
    // console.log("result", result);
  },
};
</script>
<style scopelang="stylus" rel="stylesheet/stylus">
/* @import url(); 引入css类 */
</style>