<template>
    <div>
      <transition name="t-loading">
        <div v-show="visible" class="t-loading" >
          <div class="t-loading-backdrop"
               :style="{backgroundColor:backdropColor, opacity: backdrop ? 0.4 : 0}">
          </div>
          <div v-if="!customTpl" class="t-loading-self">
            <div class="t-loading-spinner"
                 :style="{height: renderHeight + 'px'}">
              <component :is="returnSpinner"></component>
            </div>
            <p class="t-loading-title">{{title}}</p>
          </div>
          <div v-if="customTpl" v-html="customTpl" class="t-loading-self"
               style="padding: 10px;"></div>
        </div>
      </transition>
    </div>
</template>

<script>
import ballqueue from './spinners/ballQueueSp';
import ballRingSp from './spinners/ballRingSp';
import circle3Sp from './spinners/circle3Sp';
import walkingSquareSp from './spinners/walkingSquareSp';
import win8Sp from './spinners/win8Sp';
import stripper from './spinners/stripper';

export default {
  name: 't-loading',
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    returnSpinner() { // 根据icon属性来设置加载图标类型
      switch (this.icon) {
        case 'win8':
          return win8Sp;
        case 'ballqueue':
          return ballqueue;
        case 'circle3':
          return circle3Sp;
        case 'walkSquare':
          return walkingSquareSp;
        case 'ballring':
          return ballRingSp;
        case 'stripper':
          return stripper;
        default:
          return null;
      }
    },
    renderHeight() { // 每个加载图标需要容器高度都不同，分情况来设置
      switch (this.icon) {
        case 'win8':
          return 100;
        case 'ballqueue':
          return 30;
        case 'circle3':
          return 20;
        case 'walkSquare':
          return 60;
        case 'ballring':
          return 55;
        case 'stripper':
          return 40;
        default:
          return null;
      }
    },
  },
  components: { // css3的加载图标，根据选项来选用
    ballqueue,
    ballRingSp,
    circle3Sp,
    walkingSquareSp,
    win8Sp,
    stripper,
  },
  props: {
    backdrop: { type: Boolean, default: true },
    backdropColor: { type: String, default: '#767676' },
    title: { type: String, default: '加载中...' },
    customTpl: { type: String, default: '' },
    icon: { type: String, default: 'stripper' },
    duration: { type: Number },
  },
  // watch: {
  //   duration(val) { // 检查duration字段，如果有值的话就设置定时器关闭显示
  //     if (val) {
  //       const closeThis = setTimeout(() => {
  //         this.visible = false;
  //         clearTimeout(closeThis);
  //       }, val * 1000);
  //     }
  //   },
  // },
};
</script>

<style lang="less">
@import "../assets/var.less";

.t-loading{
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  transition:opacity 0.5s linear;
  -webkit-transition: opacity 0.5s linear;
  -moz-transition: opacity 0.5s linear;
  -ms-transition: opacity 0.5s linear;
  -o-transition: opacity 0.5s linear;
  z-index: 999;

  .t-loading-backdrop{
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0.4;
    height: 100vh;
    width: 100vw;
  }

  .t-loading-self{
    position: absolute;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
    background-color: #fff;
    padding-top:20px ;
    width: 120px;
    border-radius: 8px;

    .t-loading-title{
      text-align: center;
      margin-top: 10px;
      font-size: 16px;
    }

    .t-loading-spinner{
      width: 100px;
      margin: 0 auto;
      >div{
        margin: 0 auto;
      }
    }
  }
}
.t-loading-enter,
.t-loading-leave-active {
  opacity: 0;
}
</style>
