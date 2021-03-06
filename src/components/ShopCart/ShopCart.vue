<!--  -->
<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }">
              <i
                class="iconfont icon-gouwuchekong"
                :class="{ highlight: totalCount > 0 }"
              ></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{ highlight: totalCount > 0 }">
            ￥{{ totalPrice }}
          </div>
          <div class="desc" v-if="info">
            另需配送费￥{{ info.deliveryPrice }}元
          </div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{ payText }}
          </div>
        </div>
      </div>
      <transition name="move">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
          <div class="list-content" ref="foods">
            <ul>
              <li class="food" v-for="food in shopCart" :key="food.name">
                <span class="name">{{ food.name }}</span>
                <div class="price">
                  <span>￥{{ food.price }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { CLEAR_CARTSHOPS } from "@/vuex/types";
import CartControl from "../CartControl/CartControl";
import BScroll from "better-scroll";
import { MessageBox } from "mint-ui";
export default {
  props: ["id"],
  data() {
    return {
      listShow: false,
    };
  },
  components: {
    CartControl,
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
   
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    //使用mapGetter时 只能用数组
    ...mapGetters(["totalCount", "totalPrice"]),
    ...mapState({
      info: (state) =>  state.shop.shop.info || {},
      shopCart: (state) => state.shop.shopCart,
    }),
  
    payText() {
      let { totalPrice, info } = this;
      if (!info) {
        return;
      }
      let Text;
      if (totalPrice === 0) {
        Text = `${info.minPrice}元起送`;
      } else if (totalPrice > 0 && totalPrice < info.minPrice) {
        Text = `差${info.minPrice - totalPrice}元配送`;
      } else {
        Text = "去结算";
      }
      return Text;
    },
    payClass() {
      let { totalPrice, info } = this;
      if (!info) {
        return;
      }
      return totalPrice - info.minPrice >= 0 ? "enough" : "not-enough";
    },
  },
  methods: {
    toggleShow() {
      this.totalCount && (this.listShow = !this.listShow);

      /**
       * 问题 ： 如果创建了多个scroll对象,会导致事件有多次响应
       * 解决 ： 让BScroll对象创建一个实例对象
       * 单例 ： 单一的实例
       * 1.创建前 判断对象是否存在
       * 2.创建后 保存对象
       */

      //如果当前listShow是true
      if (this.listShow) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foods, {
              click: true,
              scrollY: true,
            });
          } else {
            //scroll已经创建了
            this.scroll.refresh(); //内部会重新统计内容的高度来决定是否形成滑动
          }
        });
      }
    },

    clearCart() {
      MessageBox.confirm("确认清除吗")
        .then(() => {
          this.$store.commit(CLEAR_CARTSHOPS);
        })
        .catch(() => {});
    },
  },
  watch: {
    shopCart(newValue) {
      !newValue.length && (this.listShow = false);
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl'
.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  .content
    display: flex
    background: #141d27
    font-size: 0
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        vertical-align: top
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        width: 56px
        height: 56px
        box-sizing: border-box
        border-radius: 50%
        background: #141d27
        .logo
          width: 100%
          height: 100%
          border-radius: 50%
          text-align: center
          background: #2b343c
          &.highlight
            background: $green
          .icon-gouwuchekong
            line-height: 44px
            font-size: 24px
            color: #80858a
            &.highlight
              color: #fff
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #ffffff
          background: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display: inline-block
        vertical-align: top
        margin-top: 12px
        line-height: 24px
        padding-right: 12px
        box-sizing: border-box
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        font-size: 16px
        font-weight: 700
        &.highlight
          color: #fff
      .desc
        display: inline-block
        vertical-align: top
        margin: 12px 0 0 12px
        line-height: 24px
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
  .shopcart-list
    position: absolute
    left: 0
    top: 0
    z-index: -1
    width: 100%
    transform: translateY(-100%)
    &.move-enter-active, &.move-leave-active
      transition: all 0.5s
    &.move-enter, &.move-leave-to
      opacity: 0
      transform: translateY(0)
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .title
        float: left
        font-size: 14px
        color: rgb(7, 17, 27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)
    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: #fff
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 6px
.list-mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 40
  backdrop-filter: blur(10px)
  opacity: 1
  background: rgba(7, 17, 27, 0.6)
  &.fade-enter-active, &.fade-leave-active
    transition: opacity 0.5s
  &.fade-enter, &.fade-leave-to
    opacity: 0
</style>