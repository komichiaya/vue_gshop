<!--  -->
<template>
  <div id="shopContainer" v-if="shops.id">
    <ShopHeader />
    <div class="tabs">
      <div class="tab-item">
        <router-link :to="`/shop/${id}/good`" replace>订餐</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="`/shop/${id}/rating`" replace>评价</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="`/shop/${id}/info`" replace>商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { RECEIVE_SHOPDATA, SAVE_CARTSHOPS, RECEIVE_SHOP } from "@/vuex/types";
import ShopHeader from "@/components/ShopHeader/ShopHeader";
export default {
  name : "shop",
  props: ["id"],
  data() {
    return {
    };
  },
  components: {
    ShopHeader,
  },
  computed: {
    ...mapState({
      // shop: (state) => state.shop.value,
      // shopData: (state) => state.shop.shopData,
      shops: (state) => state.shop.shop,
    }),
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    const id = this.id * 1;
    console.log("id", id);
    
    // let result = await this.$API.getShopData();
    // console.log("result", result);
    let ShopDatas = JSON.parse(sessionStorage.getItem(id));
    // if (ShopDatas) {
    //   //判断是否有缓存
    //   if (ShopDatas.id === id) {
    //     // 当前点击和上次点击是否是同一个店家
    //     //将读取的数据存入vuex中
    //     // this.$store.commit(RECEIVE_SHOPDATA, ShopDatas);
    //     this.$store.commit(RECEIVE_SHOP, ShopDatas);
    //     //计算最新的购物车数据 food.count > 0
    //     let cartShops = ShopDatas.goods.reduce((pre, good) => {
    //       pre.push(...good.foods.filter((food) => food.count));
    //       return pre;
    //     }, []);
    //     //将cartShops存入vuex中
    //     this.$store.commit(SAVE_CARTSHOPS, cartShops);
    //   } else {
    //     this.toUpdata();
    //   }
    // } else {
    //   this.toUpdata();
    // }
    if (ShopDatas ? (ShopDatas.id === id ? true : false) : false) {
      // ShopDatas判断是否有缓存
      // ShopDatas.id === id 判断当前点击和上次点击是否是同一个店家

      //将读取的数据存入vuex中
      // this.$store.commit(RECEIVE_SHOPDATA, ShopDatas);
      this.$store.commit(RECEIVE_SHOP, ShopDatas);

      //计算最新的购物车数据 food.count > 0
      let cartShops = ShopDatas.goods.reduce((pre, good) => {
        pre.push(...good.foods.filter((food) => food.count));
        return pre;
      }, []);
      //将cartShops存入vuex中
      this.$store.commit(SAVE_CARTSHOPS, cartShops);
    } else {
      //发送请求
      this.toUpdata();
    }

    //分发action 发请求获取数据
    // this.$store.dispatch("getShopDataActions")

    //unload事件在页面确定刷新，但是还没有真正刷新的时候，页面即将刷新之前触发
    window.addEventListener("unload", () => {
      //将最新的shopData存入sessionStorage
      sessionStorage.setItem(id, JSON.stringify(this.shops));
    });

    //得到当前请求的商家id
    // const id = this.$route.params.id

    // this.$store.dispatch('getShopDataActions',id)
  },
  beforeDestroy() {
    // sessionStorage.setItem("shopDatas", JSON.stringify(this.shopData));
    sessionStorage.setItem(this.id, JSON.stringify(this.shops));
  },
  watch: {
    // shops: {
    //   someTing() {
    //     console.log("数据发生了改变");
    //   },
    // },
  },
  methods: {
    async toUpdata() {
      await this.$store.dispatch("getShopData", this.id);
      await sessionStorage.setItem(this.id, JSON.stringify(this.shops));
      this.$store.commit(SAVE_CARTSHOPS, []);
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
/* @import url(); 引入css类 */
@import '../../common/stylus/mixins.styl'
#shopContainer
  .tabs
    display: flex
    bottom-border-1px(#eeeeee)
    .tab-item
      // width 33.3333%
      flex: 1
      text-align: center
      height: 40px
      line-height: 40px
      font-size: 14px
      a
        display: block
        position: relative
        &.router-link-active
          color: $green
          &:after
            content: ''
            height: 4px
            width: 40px
            background: $green
            transform: scaleY(0.5)
            position: absolute
            left: 50%
            bottom: 0
            margin-left: -20px
</style>