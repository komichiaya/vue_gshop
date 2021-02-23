<!--  -->
<template>
  <div class="footer-guide">
    <span class="guide-item" @click="goto('/msite')">
      <span>
        <i class="iconfont icon-waimai" :class="{on : $route.path === '/msite'}"></i>
      </span>
      <span>首页</span>
    </span>
    <span class="guide-item" @click="goto('/search')">
      <span>
        <i class="iconfont icon-sousuo" :class="{on : $route.path === '/search'}"></i>
      </span>
      <span>搜索</span>
    </span>
    <span class="guide-item" @click="goto('/order')">
      <span>
        <i class="iconfont icon-ziyuan" :class="{on : $route.path === '/order'}"></i>
      </span>
      <span>订单</span>
    </span>
    <span class="guide-item" @click="goto('/profile')">
      <span>
        <i class="iconfont icon-geren" :class="{on : $route.path === '/profile'}"></i>
      </span>
      <span>个人</span>
    </span>
  </div>
</template>

<script>
export default {
  name : "",
  methods: {
    goto(path){
      // 1. 如果点击当前项，没有任何效果
      // if(path !== this.$route.path){
      //   // 编程式路由跳转
      //   this.$router.replace(path)
      // }
     //2 如果当前项，刷新界面
        if(path !== this.$route.path){
        // 编程式路由跳转
        this.$router.replace(path)
      }else{
        window.location = path //发送一般的http请求 ==>整个页面会刷新显示
      }
    }
  },
  data() {
    return {};
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
/* @import url(); 引入css类 */
@import '../../common/stylus/mixins.styl';

.footer-guide 
  top-border-1px(#cccccc);
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 50px;
  width: 100%;
  background #fff

  .guide-item 
    display: flex;
    flex-direction: column;
    text-align center
    width: 25%;
    & .on
        color  $IlluminatingYellow
  
  span 
    margin-top  3px
    font-size 12px
    i  
      font-size 22px

</style>