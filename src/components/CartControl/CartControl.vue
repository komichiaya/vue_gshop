<!-- -->
 <template>
  <div class="cartcontrol">
    <transition name="move">
      <div
        class="iconfont icon-xianxingtubiaozhizuomoban-02"
        v-show="food.count"
        @click.stop="changeFoodCount(false)"
      ></div>
    </transition>
    <div class="cart-count" v-show="food.count">{{ food.count }}</div>
    <div class="iconfont icon-jiahao" @click.stop="changeFoodCount(true)"></div>
  </div>
</template> 


<script>
import throttle from 'lodash/throttle'
export default {
  props: {
    food: {
      require: true,
      type: Object,
    },
  },
  methods: {
    //对处理事件进行节流
    changeFoodCount  :throttle(function (isAdd) {
      // 不在此处处理数据
      // 1. 数据在哪 处理数据的方法在哪
      // 2. count刚开始是undefined ++之后变成NaN 
      this.$store.dispatch("changeFoodCount", { isAdd, food: this.food });
    },1000,{trailing: false})
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl'
.cartcontrol
  font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)
  .icon-xianxingtubiaozhizuomoban-02
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: $green
    &.move-enter-active, &.move-leave-active
      transition: all 0.5s
    &.move-enter, &.move-leave-to
      opacity: 0
      transform: translateX(15px) rotate(180deg)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 6px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)
  .icon-jiahao
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: $green
</style>
