<template>
<li @click.stop="mainHandler()"
    class="t-subMenu"
    @mouseenter="hoverHandler"
    :style="collapseLi"
    style="box-sizing: border-box;">
  <!--一般情况的显示，图标加文字-->
  <span  :style="liPadding" v-show="ifExpand && menuDepth >= 1" style="white-space: nowrap;">
    <span class="t-subMenu-icon-container" >
      <slot name="icon" v-if="ifExpand && ($slots.icon || icon)">
        <span class="iconfont" style="font-size: 28px;" :class="icon"
        :style="{color: activeTextStyle.color}"></span>
      </slot>
    </span>
    <span :style="activeTextStyle" class="t-subMenu-text-wapper" style="transition: all 0.3s ease">
      {{menuName}}
    </span>
    <span class="t-subMenu-right-slot"><slot name="right"></slot></span>
    <span class="iconfont t-subMenu-right-icon"
          :class="[rightIcon,showList ? 'icon-rotate-180' : '']"
          :style="rightIconPosition">
    </span>
  </span>
  <!--根目录的收起来的显示图标 todo 在混用iconfont和slot的时候图标会有不对齐问题-->
  <span :style="liPadding" v-show="!ifExpand && menuDepth === 1">
    <span  class="t-subMenu-icon-container" style="left: 42.5%;">
      <slot name="icon" v-if="!ifExpand && menuDepth === 1">
        <span class="iconfont" style="font-size: 28px;" :class="icon"
              :style="{color: activeTextStyle.color}"></span>
      </slot>
    </span>
  </span>
  <!--收起来并且为非根菜单项的时候显示的名字-->
  <span v-show="!ifExpand && menuDepth > 1" :style="activeTextStyle" style="padding: 8px;">
    {{menuName}}
  </span>
  <!--没有收起来的时候的伸展列表-->
  <transition :name="direction === 'horizontal' ? 't-subMenu-h' : 'transition-drop'">
    <ul :style="ulPosition" v-show="showList && ifExpand"
        class="t-subMenu-wholeList"
        :class="[ifExpand ? 't-subMenu-animate-ul' : '']">
      <slot v-if="ifExpand"></slot>
    </ul>
  </transition>
  <!--收起来并且为根菜单项的时候显示的tooltip-->
  <tooltip :target="target" v-model="hoverList" :refTarget="reft" v-show="!ifExpand"
           deltaPos="rightTop" :position="'rightTop'">
    <ul style="width: 100px;" class="t-subMenu-simpleList">
      <li v-if="menuDepth === 1" class="self-title" :style="activeTextStyle">{{menuName}}</li>
      <slot v-if="!ifExpand"></slot>
    </ul>
  </tooltip>

</li>
</template>

<script>
import dimissMixin from '../utils/dimissMixin'; // 引用dimiss来处理hover事件
import tooltip from '../tooltip/tooltip'; // 使用tooltip来处理收起来的时候要显示文字的情况

export default {
  name: 'sub-item',
  mixins: [dimissMixin],
  components: { tooltip },
  data() {
    return {
      hoverList: false, // hover的标志状态值
      target: null, // tooltip 的选项
      reft: null, // tooltip 的选项
    };
  },
  inject: ['updateMenu', 'menuRoot'], // 注入方法和本体
  computed: {
    direction() { // 返回菜单的方向信息
      return this.menuRoot.direction;
    },
    activeMenu() { // 返回当前激活的菜单项
      return this.menuRoot.activeMenu;
    },
    ifExpand() { // 返回当前是否展开/收缩状态
      return this.menuRoot.expand;
    },
    ulPosition() { // 返回ul的位置的值
      if (this.direction === 'horizontal') {
        if (this.$parent === this.menuRoot) { // 横式根子菜单在正下方
          return {
            bottom: 0,
            left: '50%',
            transform: 'translate(-50%, 100%)',
          };
        }
        return { // 横式非根子菜单则在右侧
          right: 0,
          top: 0,
          transform: 'translate(100%, 0)',
          position: 'absolute',
        };
      }
      return {}; // 竖式的不需要定位
    },
    menuDepth() { // 返回当前菜单的层数深度
      let depth = 1;
      let parent = this.$parent;
      while (parent !== this.menuRoot) {
        depth += 1;
        parent = parent.$parent;
      }
      return depth;
    },
    liPadding() { // 返回li的内边距，在竖式的时候要根据菜单的层数深度来调整缩进
      // if (this.direction === 'vertical') {
      //   return {
      //     paddingLeft: `${(this.menuDepth * 8) + 42}px`,
      //     width: this.ifExpand ? '100%' : '40px',
      //   };
      // }
      if (this.direction === 'vertical') {
        if (this.menuDepth > 2) {
          return {
            paddingLeft: `${(this.menuDepth - 1) * 6}px`,
          };
        }
      }
      return {
      };
    },
    rightIcon() { // 左边小箭头的图标，横式的向下，竖式的向右
      if (this.direction === 'horizontal') {
        if (this.$parent !== this.menuRoot) return 'icon-right-line';
      }
      return 'icon-down-line';
    },
    rightIconPosition() { // 竖式的小箭头需要根据菜单层数深度来确定位置，以达到对齐
      let position = {};
      if (this.direction === 'vertical') {
        position = {
          marginTop: '-12px',
        };
        position.color = this.activeTextStyle.color;

        // 当数据层级>1时,缩进
        if (this.menuDepth > 2) {
          position.marginRight = `${(this.menuDepth - 1) * 6}px`;
        }
      }
      return position;
    },
    activeParent() { // 返回当前激活的父元素
      return this.menuRoot.activeParent;
    },
    ifIncludeChild() { // 当前展开菜单是否在本子菜单集或后代里面
      if (!this.activeParent.menuName) return false;
      if (this.activeParent.menuName !== this.menuName) {
        return this.activeParent.parents.some(val => val.menuName === this.menuName);
      }
      return true;
    },
    ifInclude() { // 当前激活菜单是否在本子菜单集或后代里面
      if (!this.activeMenu.menuName) return false;
      if (this.activeMenu.menuName !== this.menuName) {
        return this.activeMenu.parents.some(val => val.menuName === this.menuName);
      }
      return true;
    },
    showList() { // 根据不同情况选择条件来显示子菜单列表
      if (this.direction === 'horizontal') return this.hoverList; // 横式的菜单只要鼠标滑过就展开
      if (this.direction === 'vertical' && this.menuRoot.canCollapse && !this.ifExpand) {
        return this.hoverList; // 竖式的收起菜单也需要滑过展开
      }
      return this.ifIncludeChild; // 竖式的展开菜单则需要包含才能展开
    },
    fontStyle() { // 根据菜单层数深度调整字体大小
      const fz = 16 - ((this.menuDepth - 1) * 2) > 12 ? 16 - ((this.menuDepth - 1) * 2) : 12;

      return {
        fontSize: `${fz}px`,
      };
    },
    activeTextStyle() { // 根据激活/hover/禁用/收起等的一系列状态来设置文字样式，合并了字体大小的样式
      const { fontStyle } = this;
      if (this.disable) { // 禁用状态
        return Object.assign({}, fontStyle, {
          opacity: 0.5,
          cursor: 'not-allowed',
        });
      }
      if (this.hoverList) { // 被hover的状态
        if (!this.ifExpand && this.menuDepth > 1) {
          return Object.assign({}, fontStyle, {
            color: '#4485ff',
          });
        }
        if (this.direction === 'vertical' && this.ifExpand && this.menuDepth > 1) {
          return Object.assign({}, fontStyle, {
            color: this.menuRoot.textColor,
          });
        }
        if ((this.direction === 'vertical' && this.ifExpand) && this.menuDepth === 1) {
          return Object.assign({}, fontStyle, {
            color: this.menuRoot.textColor,
          });
        }
        return Object.assign({}, fontStyle, {
          color: this.menuRoot.activeTextColor,
        });
      }
      if (this.activeMenu.menuName && this.activeMenu.menuName === this.menuName) { // 被激活的状态
        return Object.assign({}, fontStyle, {
          color: this.menuRoot.activeTextColor,
        });
      }
      if ((this.direction === 'horizontal' && this.ifInclude) || (!this.ifExpand && this.ifInclude && this.menuDepth === 1)) {
        return Object.assign({}, fontStyle, { //  横式包含了激活菜单或者收起之后根子菜单包含激活菜单的情况
          color: this.menuRoot.activeTextColor,
        });
      }
      if ((this.direction === 'vertical' && this.ifInclude && !this.ifExpand)) {
        return Object.assign({}, fontStyle, { // 竖式包含了激活菜单或者收起之后根子菜单包含激活菜单的情况
          color: this.menuRoot.activeTextColor,
        });
      }
      if (!this.ifExpand && this.menuDepth > 1) {
        return Object.assign({}, fontStyle, {
          color: '#333',
        });
      }
      return Object.assign({}, fontStyle, {
        color: this.menuRoot.textColor,
      });
    },
    activeLiStyle() { // 一系列状态下返回的li样式
      if (this.disable) { // 禁用的状态
        return {
          backgroundColor: this.menuRoot.bgColor,
          cursor: 'not-allowed',
        };
      }
      if (this.hoverList) {
        if (this.direction === 'horizontal' && this.menuDepth === 1) {
          return {
          };
        } else if (this.direction === 'horizontal' && this.menuDepth !== 1) {
          return {
            backgroundColor: this.menuRoot.bgColor,
          };
        } else if (this.ifExpand && this.direction === 'vertical' && this.menuDepth > 1) { // 竖版展开时,带子菜单的hover为加深的背景
          return {
            backgroundColor: this.mixColor(this.menuRoot.bgColor),
          };
        } else if (this.ifExpand && this.direction === 'vertical' && this.menuDepth === 1) {
          return {
            backgroundColor: this.menuRoot.bgColor,
          };
        }
        return {
          backgroundColor: this.menuRoot.activeBgColor,
          borderRight: `3px inset ${this.menuRoot.activeTextColor}`,
        };
      }
      if (this.activeMenu.menuName && this.activeMenu.menuName === this.menuName) {
        if (this.direction === 'horizontal' && this.menuDepth === 1) {
          return {
            borderBottom: `1px solid ${this.menuRoot.activeTextColor}`,
          };
        } else if (this.direction === 'horizontal' && this.menuDepth !== 1) {
          return {
            backgroundColor: this.menuRoot.bgColor,
          };
        } else if (this.direction === 'vertical' && this.menuDepth > 1) { // 竖版状态,默认显示底色
          return {
            backgroundColor: this.mixColor(this.menuRoot.bgColor, 0.2),
          };
        }
        return { // 注释在其他情况下,显示选中menu的hover底色
          // backgroundColor: this.menuRoot.activeBgColor,
        };
      }
      if (this.direction === 'horizontal' && this.ifInclude && this.menuDepth === 1) {
        return Object.assign({}, this.fontStyle, {
          borderBottom: `1px solid ${this.menuRoot.activeTextColor}`,
        });
      }
      if (!this.ifExpand && this.ifInclude && this.menuDepth === 1) {
        return Object.assign({}, this.fontStyle, {
          backgroundColor: this.menuRoot.activeBgColor,
          borderRight: `3px inset ${this.menuRoot.activeTextColor}`,

        });
      }
      if (this.direction === 'vertical' && this.ifExpand && this.menuDepth > 1) { // 展开时,子菜单加深底色
        return {
          backgroundColor: this.mixColor(this.menuRoot.bgColor, 0.2),
        };
      }
      return {
        backgroundColor: this.menuRoot.bgColor,
      };
    },
    collapseLi() { // 收起来的li样式，合并各种状态的li样式
      if (!this.ifExpand && this.menuDepth === 1) { // 收起来根菜单长度
        return Object.assign({}, this.activeLiStyle, {
          width: '100px',
        });
      } else if (!this.ifExpand && this.menuDepth > 1) { // 收起来非根菜单长度
        return {
          width: '100px',
        };
      }
      return Object.assign({}, this.activeLiStyle, {
        width: this.direction === 'horizontal' ? '150px' : '100%',
      });
    },
  },
  props: {
    disable: { type: Boolean, default: false }, // 是否被禁用
    menuName: { type: String }, // 菜单名字
    icon: String,
  },
  methods: {
    getColorChannels(color) {
      let newColor = color.replace('#', '');
      if (/^[0-9a-fA-F]{3}$/.test(newColor)) {
        newColor = newColor.split('');
        for (let i = 2; i >= 0; i--) {
          newColor.splice(i, 0, newColor[i]);
        }
        newColor = newColor.join('');
      }
      if (/^[0-9a-fA-F]{6}$/.test(newColor)) {
        return {
          red: parseInt(newColor.slice(0, 2), 16),
          green: parseInt(newColor.slice(2, 4), 16),
          blue: parseInt(newColor.slice(4, 6), 16),
        };
      }
      return {
        red: 255,
        green: 255,
        blue: 255,
      };
    },
    mixColor(color, percent) {
      let { red, green, blue } = this.getColorChannels(color);
      if (percent > 0) { // shade given color
        red *= 1 - percent;
        green *= 1 - percent;
        blue *= 1 - percent;
      } else { // tint given color
        red += (255 - red) * percent;
        green += (255 - green) * percent;
        blue += (255 - blue) * percent;
      }
      return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
    },
    mainHandler() { // 主要的点击处理函数
      if (this.disable) return; // 禁用直接返回退出
      if (!this.showList) { // 不是当前激活的菜单，则构建菜单对象提交给主菜单注册
        const menuObject = {
          menuName: this.menuName,
          parents: [],
          link: '',
        };
        let p = this.$parent;
        while (p !== this.menuRoot) {
          menuObject.parents.push(p);
          p = p.$parent;
        }
        this.updateMenu(menuObject, true);
      } else {
        let menuObject = {};
        if (this.$parent !== this.menuRoot) {
          menuObject = {
            menuName: this.$parent.menuName,
            parents: [],
            link: '',
          };
          let p = this.$parent.$parent;
          while (p !== this.menuRoot) {
            menuObject.parents.push(p);
            p = p.$parent;
          }
          this.updateMenu(menuObject, true);
        } else {
          this.updateMenu(menuObject, true);
        }
      }
    },
    hoverHandler(e) { // hover处理函数
      if (this.disable) return; // 禁用直接返回
      this.hoverList = true;
      if (!this.ifExpand) { // 收起来的时候激活tooltip
        this.reft = e.currentTarget;
        this.target = e;
      }
      this.setDimiss('mouseover', this.$el, 'other', () => {
        this.hoverList = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
.ban-select(){
  -moz-user-select:none;/*火狐*/
  -webkit-user-select:none;/*webkit浏览器*/
  -ms-user-select:none;/*IE10*/
  -khtml-user-select:none;/*早期浏览器*/
  user-select:none;
}
.t-menu.horizontal .t-subMenu{
  display: inline-block;
  position: relative;
  /*transition: all .3s linear;*/
  border-bottom:1px solid transparent;
  cursor: pointer;
  .ban-select();
  &>span{
    cursor: inherit;
    .ban-select();
  }
  &-text-container{
    display: inline-block;
    width: 100%;
  }
  &-right-icon{
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -9px;
    font-size: 18px;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
  }
  ul{
    display: inline-block;
    position: absolute;
    width: 100%;
    list-style: none;
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    border: 1px solid #ddd;
  }
  li{
    width: calc(100% - 16px);
    padding: 8px;
  }
  .t-menu-item{
    padding: 8px;
  }
}

.t-menu.vertical .t-subMenu{
  display: block;
  cursor: pointer;
  .ban-select();
  width: 100%;
    &>span{
      width: 100%;
      padding: 0 0 8px;
      display: inline-block;
      position: relative;
      cursor: inherit;
      .ban-select();
    }
    &-right-icon{
      display: inline-block;
      position: absolute;
      right: 10px;
      top: 50%;
      font-size: 18px;
      transition: all 0.3s;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -ms-transition: all 0.3s;
      -o-transition: all 0.3s;
    }
  &-wholeList{
      list-style: none;
    }
  &-simpleList{
      list-style: none;
      width: 100px;
    .self-title{
      width: 100%;
      padding: 5px;
      border-bottom: 1px solid #ccc;
    }
    }
    li{
      padding-top: 8px;
    }
  }
.t-subMenu-icon-container, .t-subMenu-right-slot{
  position: relative;
  height: 18px;
  display: inline-block;
  margin-right: 10px;
  width: 20%;
}
.t-subMenu-icon-container * {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
}
.t-subMenu-right-slot *{
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
}
.t-subMenu-text-wapper{
  display: inline-block;
  width: 60%;
}
.t-subMenu-text-wapper{
  display: inline-block;
  width: 70%;
}
/*animate class*/
.t-subMenu-animate-ul{
  transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
}

.t-subMenu-h-enter,.t-subMenu-h-leave-active{
  opacity: 0;
}
.t-subMenu-v-enter,.t-subMenu-v-leave-active{
  transform: scale(1,0);
  -webkit-transform: scale(1,0);
  -moz-transform: scale(1,0);
  -ms-transform: scale(1,0);
  -o-transform: scale(1,0);
  transform-origin: top center;
  -webkit-transform-origin: top center;
  -ms-transform-origin: top center;
  -moz-transform-origin: top center;
  -o-transform-origin: top center;
}
.icon-rotate-180{
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
}
</style>
