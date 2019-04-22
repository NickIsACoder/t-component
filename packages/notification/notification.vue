<template>
  <div>
    <transition name="t-notification" :enter-class="renderEnterClass">
      <div v-show="visible" :style="renderStyle"
           :class="/%/.test(position.left) ? 't-notification-after-enter_center'
           : 't-notification-after-enter_default'"
           class="t-notification">
        <!--根据是否需要居中来设置显示之后匹配的class，不同class代表不同的transform，达到不同的进入效果-->
        <div v-if="!customTpl" @click="clickhandler()">
          <div class="t-notification-icon">
            <span class="iconfont"
                  :class="renderIcon"
                  :style="renderIconColor"
                  style="font-size: 20px;">
            </span>
          </div>
          <div class="t-notification-content">
            <i @click.stop="closehandler()" class="iconfont icon-close"></i>
            <h3 :style="{fontWeight:text ? '700' : '500', fontSize: text ? '18px' : '15px'}">
              {{title}}
            </h3>
            <p v-if="text">{{text}}</p>
          </div>
        </div>
        <div v-else class="t-notification-content" @click="clickhandler()">
          <i @click.stop="closehandler()" class="iconfont icon-close"></i>
          <div v-html="customTpl"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 't-notification',
  data() {
    return {
      visible: false,
      dimissTimer: null,
    };
  },
  computed: {
    renderStyle() { // 根据position属性来设置渲染位置
      return Object.assign({}, this.position);
    },
    renderEnterClass() { // 根据不同的position来选择不同的进入动画class，以达到不同的动画效果
      const { position } = this;
      if (position.right !== undefined) {
        return 't-notification-right-enter';
      } else if (position.left !== undefined && !/%/.test(position.left)) {
        return 't-notification-left-enter';
      } else if (position.top !== undefined) {
        return 't-notification-top-enter';
      } else if (position.bottom !== undefined) {
        return 't-notification-bottom-enter';
      }
      return '';
    },
    renderIcon() { // 根据不同的选项渲染不同的图标
      if (this.icon) {
        return this.icon;
      }
      switch (this.theme) {
        case 'info':
          return 'icon-info-fill';
        case 'warning':
          return 'icon-warn-fill';
        case 'error':
          return 'icon-error';
        case 'success':
          return 'icon-radio-choosed';
        default:
          return '';
      }
    },
    renderIconColor() { // 设置图标的颜色
      if (this.iconColor) {
        return { color: this.iconColor };
      }
      switch (this.theme) {
        case 'info':
          return { color: '#4185ff' };
        case 'warning':
          return { color: '#feae38' };
        case 'error':
          return { color: '#f24a4a' };
        case 'success':
          return { color: '#4acd1f' };
        default:
          return '';
      }
    },
  },
  props: {
    title: { type: String, default: '标题' },
    icon: { type: String },
    iconColor: { type: String },
    text: { type: String, default: '内容' },
    theme: { type: String, default: 'info' },
    position: { type: [String, Object], default: 'topRight' },
    customTpl: { type: String, default: '' },
    delay: { type: Number, default: 5 },
    autoDimiss: { type: Boolean, default: true },
    onClose: { type: Function,
      default() {
        return '';
      },
    },
    onClick: { type: Function,
      default() {
        return '';
      },
    },
    queue: { type: Object },
  },
  methods: {
    clickhandler() { // 点击之后触发的时间
      this.onClick();
      this.visible = false;
      const dimiss = setTimeout(() => {
        this.queue.splice(this);
        clearTimeout(dimiss);
        clearTimeout(this.dimissTimer); // 注意要同时解除自动消失的计时器，否则会报错
      }, 500);
    },
    closehandler() {
      this.onClose();
      this.visible = false;
      const dimiss = setTimeout(() => {
        this.queue.splice(this);
        clearTimeout(dimiss);
        clearTimeout(this.dimissTimer); // 注意要同时解除自动消失的计时器，否则会报错
      }, 500);
    },
  },
  watch: {
    autoDimiss(val) { // 检测设置属性的时候是否更改了默认的自动消失选项，如果是就要解除自动消失的定时器
      if (!val) {
        clearTimeout(this.dimissTimer);
      }
    },
    delay(val) { // 检测设置属性的时候是否更改了默认的显示时长的选项，如果是就要解除自动消失的定时器并重新设置
      clearTimeout(this.dimissTimer);
      if (this.autoDimiss) {
        this.dimissTimer = setTimeout(() => {
          if (this.visible) {
            this.visible = false;
            const destory = setTimeout(() => {
              this.queue.splice(this);
              clearTimeout(destory);
            }, 500);
          }
          clearTimeout(this.dimissTimer);
        }, val * 1000);
      }
    },
  },
  mounted() {
    if (this.autoDimiss) { // 设置了自动消失选项之后，自动设置定时器
      this.dimissTimer = setTimeout(() => {
        if (this.visible) {
          this.visible = false;
          const destory = setTimeout(() => {
            this.queue.splice(this);
            clearTimeout(destory);
          }, 500);
        }
        clearTimeout(this.dimissTimer);
      }, this.delay * 1000);
    }
  },
};
</script>

<style scoped lang="less">
  .t-notification{
    transition: all .3s ease;
    -webkit-transition: all .3s ease;
    -moz-transition:all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    position: fixed;
    margin-right: 20px;
    margin-left: 20px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 1px 1px 1px #e0e0e0;
    cursor: default;
    background-color: #fff;
    z-index: 699;

    .t-notification-icon{
      display: inline-block;
      width: 20px;
      height: 20px;
    }

    .t-notification-content{
      display: inline-block;
      vertical-align: top;
      padding-right: 20px;
      position: relative;

      h3{
        margin: 0;
        padding-right: 16px;
      }

      i{
        position: absolute;
        top: 0;
        right: -5px;
      }
    }
  }

  /*animate class*/
  .t-notification-after-enter_center{
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    -o-transform: translate(-50%, 0);
  }
  .t-notification-after-enter_default{
    transform: translate(0, 0);
    -webkit-transform: translate(0, 0);
    -moz-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
  }
  .t-notification-leave-active{
    opacity: 0;
  }
  .t-notification-top-enter{
    transform: translate(-50%, -100%);
    -webkit-transform: translate(-50%, -100%);
    -moz-transform: translate(-50%, -100%);
    -ms-transform: translate(-50%, -100%);
    -o-transform: translate(-50%, -100%);
  }
  .t-notification-bottom-enter{
    transform: translate(-50%, 100%);
    -webkit-transform: translate(-50%, 100%);
    -moz-transform: translate(-50%, 100%);
    -ms-transform: translate(-50%, 100%);
    -o-transform: translate(-50%, 100%);
  }
  .t-notification-right-enter{
    transform: translate(100%, 0);
    -webkit-transform: translate(100%, 0);
    -moz-transform: translate(100%, 0);
    -ms-transform: translate(100%, 0);
    -o-transform: translate(100%, 0);
  }
  .t-notification-left-enter{
    transform: translate(-100%, 0);
    -webkit-transform: translate(-100%, 0);
    -moz-transform: translate(-100%, 0);
    -ms-transform: translate(-100%, 0);
    -o-transform: translate(-100%, 0);
  }
</style>
