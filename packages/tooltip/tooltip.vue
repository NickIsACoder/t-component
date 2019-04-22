<template>
  <div>
    <transition name="t-tooltip">
      <div v-show="visible || value" class="t-tooltip" :style="renderPos" ref="body">
        <!--两种控制显隐的方式一种是data属性，另一种是v-model，方便两种方法调用-->
        <span class="t-tooltip-triangle" :class="`delta-${renderDeltaClass}-border`"
        :style="renderDeltaPos"></span>
        <span class="t-tooltip-triangle" :class="`delta-${renderDeltaClass}-body`"
        :style="renderDeltaPos"></span>
        <!--这两个是那个小尖尖，css三角形写法一个白一个灰，用错位来显示边线-->
        <slot> <!--单文件方式引用的话，可以使用插槽来达到高度定制化的可互动内容，如果是简单提示可以使用函数式组件来进行浮出式提示-->
          <div v-if="!customTpl"><!--函数式组件也可以定制模板，不过内容不可互动-->
            <p style="margin: 0;">
              <span class="iconfont"
                    v-if="icon"
                    :class="icon"
                    :style="{color: iconColor}"
                    style="font-size: 20px;">
              </span>
              <!--icon图标-->
              {{title}}
              <!--内容-->
            </p>
          </div>
          <div v-else style="padding: 5px;">
            <div v-html="customTpl"></div>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import dimissMixin from '../utils/dimissMixin'; // 引入自动关闭mixin，用于自动关闭的效果

export default {
  name: 't-tooltip',
  mixins: [dimissMixin],
  data() {
    return {
      visible: false,
      dimissTimer: null,
      body: null,
    };
  },
  computed: {
    renderPos() { // 根据position属性来计算tooltip出现的位置
      const { target, position, refTarget } = this;
      if (!target) {
        return {};
      }
      const node = target.refTarget || refTarget;
      const offsetObj = this.getOffset(node, position);
      const tooltip = offsetObj.tooltip;
      const targetRect = offsetObj.targetOffset;
      switch (position) {
        case '':
        case 'topLeft':
          return {
            top: `${tooltip.top - 15}px`,
            left: `${tooltip.left}px`,
            transform: 'translate(0,-100%)',
          };
        case 'topCenter':
          return {
            top: `${tooltip.top - 15}px`,
            left: `${tooltip.left + (targetRect.width / 2)}px`,
            transform: 'translate(-50%,-100%)',
          };
        case 'topRight':
          return {
            top: `${tooltip.top - 15}px`,
            left: `${tooltip.left - (targetRect.width / 2)}px`,
            transform: 'translate(0,-100%)',
          };
        case 'leftTop':
          return {
            top: `${tooltip.top - (tooltip.height / 2)}px`,
            left: `${tooltip.left - 15}px`,
            transform: 'translate(-100%, 0)',
          };
        case 'leftCenter':
          return {
            top: `${tooltip.top + (targetRect.height / 2)}px`,
            left: `${tooltip.left - 15}px`,
            transform: 'translate(-100%, -50%)',
          };
        case 'leftBottom':
          return {
            top: `${tooltip.top + tooltip.height}px`,
            left: `${tooltip.left - 15}px`,
            transform: 'translate(-100%, -100%)',
          };
        case 'bottomLeft':
          return {
            top: `${tooltip.top + (targetRect.height / 2)}px`,
            left: `${tooltip.left}px`,
          };
        case 'bottomCenter':
          return {
            top: `${tooltip.top + (targetRect.height / 2)}px`,
            left: `${tooltip.left + (targetRect.width / 2)}px`,
            transform: 'translate(-50%, 0)',
          };
        case 'bottomRight':
          return {
            top: `${tooltip.top + (targetRect.height / 2)}px`,
            left: `${tooltip.left + targetRect.width}px`,
            transform: 'translate(-100%, 0)',
          };
        case 'rightTop':
          return {
            top: `${tooltip.top - (tooltip.height / 2)}px`,
            left: `${tooltip.left + 15}px`,
          };
        case 'rightCenter':
          return {
            top: `${targetRect.top + (targetRect.height / 2)}px`,
            left: `${tooltip.left + 15}px`,
            transform: 'translate(0, -50%)',
          };
        case 'rightBottom':
          return {
            top: `${tooltip.top + tooltip.height}px`,
            left: `${tooltip.left + 15}px`,
            transform: 'translate(0, -100%)',
          };
        default: // 如果是自定义，只要转换成对象即可
          return JSON.parse(position);
      }
    },
    renderDeltaClass() { // 根据position属性来计算tooltip小三角要使用的类
      const position = this.deltaPos || this.position;
      switch (position) {
        case 'topLeft':
        case 'topCenter':
        case 'topRight':
          return 'bottom';
        case 'leftTop':
        case 'leftCenter':
        case 'leftBottom':
          return 'right';
        case 'bottomLeft':
        case 'bottomCenter':
        case 'bottomRight':
          return 'top';
        case 'rightTop':
        case 'rightCenter':
        case 'rightBottom':
          return 'left';
        default:
          return 'bottom';
      }
    },
    renderDeltaPos() { // 根据position属性来计算tooltip小三角出现的位置
      const { target, position, refTarget, deltaPos } = this;
      if (!target) {
        return {};
      }
      const fpos = deltaPos || position;
      const node = target.refTarget || refTarget;
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      const thiswidth = this.thisSize.width;
      const thisheight = this.thisSize.height;
      switch (fpos) {
        case 'topLeft':
        case 'bottomLeft':
          return { // 比较一般长度+16（小三角的长度）和全部长度，那个短用哪个，（不这样做某些情况会小三角掉出去）
            left: (width / 2) + 16 > thiswidth ? '50%' : '15px',
            transform: (width / 2) + 16 > thiswidth ? 'translate(-50%, 0)' : undefined,
          };
        case 'topRight':
        case 'bottomRight':
          return { // 这个要从右边算起所以要用总长度减掉
            left: (width / 2) + 16 > thiswidth ? '50%' : `${thiswidth - 30}px`,
            transform: (width / 2) + 16 > thiswidth ? 'translate(-50%, 0)' : undefined,
          };
        case 'topCenter':
        case 'bottomCenter':
          return {
            left: '50%',
            transform: 'translate(-50%, 0)',
          };
        case 'leftTop':
        case 'rightTop':
          return {
            top: '50%',
            transform: (height / 2) + 16 > thisheight ? 'translate(-50%, 0)' : undefined,
          };
        case 'leftBottom':
        case 'rightBottom':
          return {
            top: (height / 2) + 16 > thisheight ? '50%' : `${height / 2}px`,
            transform: (height / 2) + 16 > thisheight ? 'translate(-50%, 0)' : undefined,
          };
        case 'leftCenter':
        case 'rightCenter':
          return {
            top: '50%',
            transform: 'translate(0, -50%)',
          };
        default:
          return {
            left: (width / 2) + 16 > thiswidth ? `${thiswidth / 2}px` : `${width / 2}px`,
            transform: (width / 2) + 16 > thiswidth ? 'translate(-50%, 0)' : undefined,
          };
      }
    },
    thisSize() { // 由于refs元素要渲染了才知道具体属性，所以要实时计算出来，以供上一个计算属性的使用
      if (this.body) {
        return {
          width: this.body.offsetWidth,
          height: this.body.offsetHeight,
        };
      }
      return { width: 0, height: 0 };
    },
  },
  methods: {
    // 查找有可能滚动的父级元素
    getScrollParent(element) {
      const parent = element.parentNode;
      if (!parent) {
        return element;
      }
      if (parent === window.document) {
        if (window.document.body.scrollTop || window.document.body.scrollLeft) {
          return window.document.body;
        }
        return window.document.documentElement;
      }
      if (
        ['scroll', 'auto'].indexOf(window.getComputedStyle(element).overflow) !== -1 ||
        ['scroll', 'auto'].indexOf(window.getComputedStyle(element).overflowY) !== -1 ||
        ['scroll', 'auto'].indexOf(window.getComputedStyle(element).overflowX) !== -1
      ) {
        return parent;
      }
      return this.getScrollParent(parent);
    },
    // 获取距离该子元素最近的进行过定位的父元素
    getOffsetParent(target) {
      const element = target;
      let offsetParent;
      if (element) {
        const displayEle = element.style.display;
        element.style.display = 'block';
        offsetParent = element.offsetParent;
        element.style.display = displayEle;
      }
      return !offsetParent ? window.document.documentElement : offsetParent;
    },
    // getBoundingClientRect获取某个元素相对于视窗的位置集合
    getBoundingClientRect(target) {
      const targetRec = target.getBoundingClientRect();
      const rectTop = target.tagName === 'HTML'
        ? -target.scrollTop
        : targetRec.top;
      return {
        top: rectTop,
        left: targetRec.left,
        bottom: targetRec.bottom,
        right: targetRec.right,
        width: targetRec.right - targetRec.left,
        height: targetRec.bottom - rectTop,
      };
    },
    // 该元素于距离该元素最近的进行过定位的父元素的相对位置集合
    getOffsetRectToParent(target, parent, isFixed) {
      const targetRect = this.getBoundingClientRect(target);
      const parentRect = this.getBoundingClientRect(parent);
      if (isFixed) {
        const scrollParent = this.getScrollParent(parent);
        parentRect.top += scrollParent.scrollTop;
        parentRect.bottom += scrollParent.scrollTop;
        parentRect.left += scrollParent.scrollLeft;
        parentRect.right += scrollParent.scrollLeft;
      }
      return {
        top: targetRect.top - parentRect.top,
        left: targetRect.left - parentRect.left,
        bottom: (targetRect.top - parentRect.top) + targetRect.height,
        right: (targetRect.left - parentRect.left) + targetRect.width,
        width: targetRect.width,
        height: targetRect.height,
      };
    },
    // 根据position获取tooltip显示的位置
    getOffset(target, position) {
      const upperCase = position.match('[A-Z]');
      let positionFirst = '';
      const tooltipRect = {};
      const isFixed = target.style.position === 'fixed';
      const targetOffset =
        this.getOffsetRectToParent(target, this.getOffsetParent(this.$refs.body), isFixed);
      const tooltipSize = this.thisSize;
      if (!upperCase) {
        positionFirst = position;
      } else {
        positionFirst = position.slice(0, upperCase.index);
      }
      if (['left', 'right'].indexOf(positionFirst) !== -1) {
        if (positionFirst === 'left') {
          tooltipRect.left = targetOffset.left;
        } else {
          tooltipRect.left = targetOffset.right;
        }
        tooltipRect.top = targetOffset.top;
      } else {
        if (positionFirst === 'top') {
          tooltipRect.top = targetOffset.top;
        } else {
          tooltipRect.top = targetOffset.bottom;
        }
        tooltipRect.left = targetOffset.left;
      }
      tooltipRect.width = tooltipSize.width;
      tooltipRect.height = tooltipSize.height;
      return {
        tooltip: tooltipRect,
        targetOffset,
      };
    },
  },
  props: {
    title: { type: String }, // 标题内容
    value: { type: Boolean }, // v-model绑定，用于控制显隐
    position: { type: String, default: 'topLeft' }, // 位置属性，tooltip要显示的元素的哪个位置
    deltaPos: { type: String }, // 位置属性，tooltip的小三角显示的哪个位置，用于自定义position的时候用
    customTpl: { type: String, default: '' }, // 自定义的html模板
    icon: { type: String }, // 图标名称
    iconColor: { type: String }, // 图标颜色
    target: { type: [Object, MouseEvent], default() { return null; } }, // 必须要绑定的触发事件对象
    refTarget: { type: HTMLElement }, // 单页引用的时候要绑的dom元素
  },
  watch: {
    target(val) { // 当有target的时候自动绑定自动关闭属性
      if (val) {
        let eventType;
        let scope;
        switch (val.type) { // 根据不同的类型事件绑定不同取消事件的监听
          case 'click': // 点击事件绑定点击其他元素的事件
            eventType = 'click';
            scope = 'other';
            break;
          case 'mouseenter': // 鼠标进入的事件绑定鼠标移出时间
            eventType = 'mouseover';
            scope = 'other';
            break;
          case 'focus': // 获得焦点事件绑定绑定焦点移出时间
            eventType = 'focusout';
            scope = 'self';
            break;
          case 'keyup':
          case 'keydown': // 键盘上输入事件绑定失去焦点事件
            eventType = 'blur';
            scope = 'self';
            break;
          default:
            eventType = 'mouseout';
            scope = 'self';
        } // 设置自动关闭动作
        this.setDimiss(eventType, val.target, scope, () => {
          this.$emit('input', false);
          this.visible = false;
          this.cancelDimiss();
        });
      }
    },
    visible(val) { // 当显示打开的时候下一帧把refs绑到属性上便于访问
      if (val) {
        this.$nextTick(() => {
          this.body = this.$refs.body;
        });
      }
    },
    value(val) { // 当显示打开的时候下一帧把refs绑到属性上便于访问
      if (val) {
        this.$nextTick(() => {
          this.body = this.$refs.body;
        });
      }
    },
  },
  beforeDestroy() {
    const parent = this.$el.parentNode;
    if (parent) {
      parent.removeChild(this.$el);
      this.$destroy();
    }
  },
};
</script>

<style scoped lang="less">
.t-tooltip{
  transition: opacity 0.3s;
  -webkit-transition: opacity 0.3s;
  -moz-transition: opacity 0.3s;
  -ms-transition: opacity 0.3s;
  -o-transition: opacity 0.3s;
  position: absolute;
  z-index: 799;
  background: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 1px 1px 1px #e0e0e0;
  cursor: default;
  &-triangle{
    display: block;
    position: absolute;
    width: 0;
    height: 0;
  }
}
.delta-bottom-body{
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 16px solid #fff;
  bottom: -13px;
}
.delta-bottom-border{
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 16px solid #e0e0e0;
  bottom: -16px;
}
.delta-top-body{
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid #fff;
  top:-13px;
}
.delta-top-border{
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid #e0e0e0;
  top:-16px;
}
.delta-left-body{
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
  border-right: 16px solid #fff;
  left: -13px;
}
.delta-left-border{
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
  border-right: 16px solid #e0e0e0;
  left: -16px;
}
.delta-right-body{
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
  border-left: 16px solid #fff;
  right: -13px;
}
.delta-right-border{
  border-bottom: 8px solid transparent;
  border-top: 8px solid transparent;
  border-left: 16px solid #e0e0e0;
  right: -16px;
}
// animate class
.t-tooltip-enter,
.t-tooltip-leave-active {
  opacity: 0;
}
</style>
