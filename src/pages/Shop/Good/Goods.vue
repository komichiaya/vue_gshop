<!--  -->
<template>
  <div id="goodContainer">
    <div class="leftContainer">
      <ul class="navlist" ref="leftUI">
        <li
          @click="changNavIndex(index)"
          :class="{ active: navIndex === index }"
          v-for="(good, index) in goods"
          :key="index"
        >
          <span class="text bottom-border-1px">
            <img
              class="icon icon-sm"
              :src="good.icon"
              v-if="good.icon"
              :style="{
                display: 'inline-block',
                width: ' 12px',
                height: '12px',
              }"
            />
            {{ good.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="rightContainer">
      <ul ref="rightUl">
        <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
          <h1 class="title">{{ good.name }}</h1>
          <ul>
            <li
              class="food-item bottom-border-1px"
              v-for="(food, index) in good.foods"
              :key="index"
              @click="showFood(food)"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-if="food.oldPrice"
                    >￥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food" />
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <ShopCart />
    <!-- 标签对象就是组件对象 -->
    <Food :food="food" ref="food" />
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapState } from "vuex";

import CartControl from "@/components/CartControl/CartControl";
import ShopCart from "../../../components/ShopCart/ShopCart.vue";
import Food from "../../../components/Food/Food.vue";
export default {
  data() {
    return {
      tops: [], //用于放置每个点距离当前滑动顶部的高度
      scrollY: 0, //页面滚动的距离,
      food: {},
    };
  },
  components: {
    CartControl,
    ShopCart,
    Food,
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    console.log("this.goods", this.goods);
    if (this.goods) {
      this._initScroll();
      this._initTop();
    }
  },
  updated() {
    // this.leftScroll.refresh();
    // this.rightScroll.refresh();
  },
  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    ...mapState({
      goods: (state) => state.shop.shop.goods 
    }),
    navIndex() {
      let { tops, scrollY } = this;
      let index = tops.findIndex(
        (item, index) => scrollY >= item && scrollY < tops[index + 1]
      );
      if (this.leftScroll && index !== this.index) {
        this.index = index;
        this.leftScroll.scrollToElement(
          this.$refs.leftUI.children[index],
          2500
        );
      }
      return index;
    },
  },
  methods: {
    _initScroll() {
      if (this.leftScroll || this.rightScroll) {
        //之前生成过的Scroll
        this.leftScroll.refresh(); //重新刷新当前的实例
        this.rightScroll.refresh(); //重新刷新当前的实例
      } else {
        //之前没有生成过
        this.leftScroll = new BScroll(".leftContainer", {
          scrollY: true, //纵轴滑动
          click: true, //允许点击
        });
        this.rightScroll = new BScroll(".rightContainer", {
          scrollY: true, //纵轴滑动
          // probeType : 1  //非实时
          // probeType : 2  //实时，无惯性滑动
          probeType: 3, //实时，有惯性滑动
          click: true,
        });

        this.rightScroll.on("scroll", ({ x, y }) => {
          this.scrollY = Math.abs(y);
        });
        //解决probeType : 2时 联动不生效
        // this.rightScroll.on("scrollEnd", ({ x, y }) => {
        //   this.scrollY = Math.abs(y);
        // });
      }
    },
    _initTop() {
      //把伪数组改为真数组
      // let lis =  Array.from(this.$refs.rightUl.children)
      let lis = [].slice.call(this.$refs.rightUl.children);
      // console.log("list:", lis);
      let top = 0;
      let tops = [];
      // for (let i = 0; i < lis.length; i++) {
      //   top += lis[i].clientHeight;
      //   tops.push(top);
      // }
      tops.push(top);
      lis.reduce((pre, listItem) => {
        pre += listItem.clientHeight;
        tops.push(pre);
        return pre;
      }, top);

      //统一更新，提高性能
      this.tops = tops;
    },
    changNavIndex(index) {
      //  得到对应的top   并更新 scrollY为目标值(立即选择当前分类项)
      this.scrollY = this.tops[index];

      //让右侧列表滑动到对应位置
      this.rightScroll.scrollTo(0, -this.scrollY, 2500);
    },
    showFood(food) {
      //更新数据
      this.food = food;
      //显示food组件对象
      this.$refs.food.toggleShow();
    },
  },

  watch: {
    goods() {
      this.$nextTick(() => {
        this._initScroll();
        this._initTop();
      });
    },
  },
  beforeDestroy() {
    // sessionStorage.removeItem("shops")
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
/* @import url(); 引入css类 */
@import '../../../common/stylus/mixins.styl'
#goodContainer
  display: flex
  overflow: hidden
  height: calc(100vh - 272px)
  .leftContainer
    width: 80px
    background: #f3f5f7
    // calc() 函数用于动态计算长度值。 运算符前后都需要保留一个空格

    // vh, vw 视口单位 1vh=1%视口高度

    // position absolute
    // bottom 0
    // top 224px
    // overflow hidden
    .navlist
      li
        width: 100%
        height: 50px
        text-align: center
        line-height: 50px
        position: relative
        &.active
          background: #fff
          color: $green
        &:after
          content: ''
          width: 80%
          height: 1px
          background: rgba(7, 17, 27, 0.1)
          position: absolute
          bottom: 0
          left: 10%
  .rightContainer
    width: 295px
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      bottom-border-1px(rgba(7, 17, 27, 0.1))
      &:last-child, border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
      .content
        flex: 1
      .name
        margin: 2px 0 8px 0
        height: 14px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .desc, .extra
        line-height: 10px
        font-size: 10px
        color: rgb(147, 153, 159)
      .desc
        line-height: 12px
        margin-bottom: 8px
      .extra
        .count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 0
        bottom: 12px
</style>