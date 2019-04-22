<template>
  <div  class="t-menu" :class="directionClass" :style="expandDivStyle">
    <ul :style="expandUlStyle">
      <slot></slot>
    </ul>
    <!--收起/展开按钮-->
    <span v-if="canCollapse && direction === 'vertical'" class="t-menu-collapse-switch"
     :style="expandTextStyle" @mouseenter="hoverHandler" @click="expandHandler">
      <span class="iconfont" :class="expand ? 'icon-retract' : 'icon-expand'"
      style="font-size: 20px;">
      </span>
      <span>{{expand ? '收起' : '展开'}}</span>
    </span>
  </div>
</template>

<script>
import dimissMixin from '../utils/dimissMixin'; // 引入dimiss方法来做展开收取的状态

export default {
  name: 't-menu',
  mixins: [dimissMixin],
  data() {
    return {
      activeMenu: {}, // 激活的menu对象
      activeParent: '', // 激活的父menu
      menuHistoryList: [],
      expand: this.canCollapse ? this.collapse : true, // 展开状态值
      hoverExpand: false, // 展开按钮是否被hover的状态值
    };
  },
  computed: {
    directionClass() {
      return this.direction === 'horizontal' ? 'horizontal' : 'vertical';
    }, // 根据方向属性返回对应的class
    expandTextStyle() {
      if (this.hoverExpand) {
        return {
          color: this.activeTextColor,
          backgroundColor: this.bgColor,
        };
      }
      return {
        color: this.textColor,
        backgroundColor: this.bgColor,
      };
    }, // 根据hoverexpand来返回展开按钮的样式
    expandUlStyle() {
      return {
        backgroundColor: this.bgColor,
        width: this.direction === 'vertical' && this.expand ? this.width : '',
      };
    }, // 根据颜色属性返回ul的样式
    expandDivStyle() {
      if (this.direction === 'vertical' && this.canCollapse && !this.expand) {
        return {
          transform: 'translateX(-15px)',
          backgroundColor: this.bgColor,
        };
      }
      return {
        backgroundColor: this.bgColor,
      };
    }, // 根据展开状态添加div的动画
  },
  props: {
    value: { type: String }, // 唯一的菜单名为双向绑定的值，
    direction: { type: String, default: 'horizontal' }, // 菜单的方向
    routerHandler: { type: Function }, // 处理路由的方式
    canCollapse: { type: Boolean, default: false }, // 是否可以展开，竖式的时候生效并展示展开按钮
    collapse: { type: Boolean, default: true }, // 一开始是否出去展开/收缩状态
    activeTextColor: { type: String, default: '#4385ff' }, // 选中的项的文字颜色
    activeBgColor: { type: String, default: '#d5e5ff' }, // 选中的项的背景颜色
    textColor: { type: String, default: '#333' }, // 默认的文字颜色
    bgColor: { type: String, default: '#fff' }, // 默认的背景颜色
    width: { type: String, default: '200px' },
  },
  methods: {
    updateActiveMenu(menu, parent) { // 更新当前激活的菜单项
      if (parent) { // 判断是否为根菜单
        this.activeParent = menu;
      } else {
        this.activeMenu = menu;
        if (menu.link) { // 如果有路由链接就执行路由操作
          if (this.routerHandler) { // 如果有自定义路由操作就执行自定义的
            this.routerHandler(menu.link);
          } else {
            this.$router.push(menu.link);
          }
        }
      }
    },
    hoverHandler() { // 响应hover鼠标动作，更改hoverExpand状态
      this.hoverExpand = true;
      this.setDimiss('mouseover', this.$el, 'other', () => {
        this.hoverExpand = false;
      });
    },
    expandHandler() { // 展开按钮处理方法
      this.expand = !this.expand;
    },
    getValue() {
      return this.value;
    },
  },
  provide() { // 向后代注入的方法&属性，方便后代访问
    return {
      updateMenu: this.updateActiveMenu,
      menuRoot: this,
      activeMenu: this.activeMenu,
      activeParent: this.activeParent,
    };
  },
  watch: {
    activeMenu(val) {
      if (val.menuName) {
        this.$emit('input', val.menuName);
      }
    },
  },
};
</script>

<style scoped lang="less">
.t-menu{
  transition: all 0.3s ease 0.3s;
  -webkit-transition: all 0.3s ease 0.3s;
  -moz-transition: all 0.3s ease 0.3s;
  -ms-transition: all 0.3s ease 0.3s;
  -o-transition: all 0.3s ease 0.3s;
  &.horizontal{
    border-bottom: 1px solid #ddd;
    &>ul{
      display: inline-block;
    }
    li{
      display: inline-block;
      width: 150px;
      padding: 8px ;
    };
  }
  &.vertical{
    display: inline-block;
    padding-top: 15px;
    height: 100%;
    padding-bottom: 15px;
    li{
      display: block;
      padding-top: 8px ;
    };
    &>ul{
      transition: all 0.3s ease 0.3s;
      -webkit-transition: all 0.3s ease 0.3s;
      -moz-transition: all 0.3s ease 0.3s;
      -ms-transition: all 0.3s ease 0.3s;
      -o-transition: all 0.3s ease 0.3s;
    }
  }
  ul{
    list-style: none;
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    display: inline-block;
  };
  &-collapse-switch{
    display: block;
    text-align: right;
    cursor: default;
    width: calc(100% - 20px);
    padding: 40px 10px 10px;
  }
}
</style>
