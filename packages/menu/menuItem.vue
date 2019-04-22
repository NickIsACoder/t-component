<template>
  <li @click.stop="mainHandler" class="t-menu-item" :style="activeLiStyle"
      @mouseenter.stop="hoverHandler" >
    <!--一般情况的显示，图标加文字-->
    <span :style="liPadding" style="white-space: nowrap;" v-show="ifExpand && menuDepth >= 1">
        <span class="t-menu-item-icon-container" v-if="$slots.icon||direction !== 'horizontal'">
          <slot name="icon" v-if="ifExpand && ($slots.icon || icon)">
            <span class="iconfont" style="font-size: 28px;transition: all 0.3s ease" :class="icon"
                  :style="{color: activeTextStyle.color}"></span>
          </slot>
        </span>
        <span  class="t-menu-item-text-warpper"
          :style="[activeTextStyle,
          {width: (!($slots.icon||$slots.right)&&direction === 'horizontal')&&'100%',
          textAlign: (!($slots.icon||$slots.right)&&direction === 'horizontal')&&'center'}]"
          style="transition: all 0.3s ease;" >{{menuName}}</span>
        <span class="t-menu-item-right-slot"
          v-if="$slots.right||direction === 'horizontal'">
          <slot name="right"></slot>
        </span>
    </span>
    <!--根目录的收起来的显示图标-->
    <span class="t-menu-item-icon-container" v-if="!ifExpand && menuDepth === 1" style="left: 50%">
          <slot name="icon" v-if="!ifExpand && menuDepth === 1">
            <span class="iconfont" style="font-size: 28px;" :class="icon"
                  :style="{color: activeTextStyle.color}"></span>
          </slot>
        </span>
    <!--收起来并且为非根菜单项的时候显示的名字-->
    <span v-if="!ifExpand && menuDepth > 1"  :style="activeTextStyle" style="padding: 8px;">
      {{menuName}}
    </span>
    <!--收起来并且为根菜单项的时候显示的tooltip-->
    <tooltip :target="target" v-model="hoverIt" :refTarget="reft"
             v-show="!ifExpand && menuDepth === 1"
             deltaPos="rightCenter" :position="'rightTop'">
      <span style="display: block;width: 100px;" :style="{color: '#333'}">{{menuName}}</span>
    </tooltip>
  </li>
</template>

<script>
import dimissMixin from '../utils/dimissMixin'; // 引用dimiss来处理hover事件
import tooltip from '../tooltip/tooltip'; // 使用tooltip来处理收起来的时候要显示文字的情况

export default {
  name: 't-menu-item',
  mixins: [dimissMixin],
  inject: ['updateMenu', 'menuRoot'], // 注入方法和本体
  components: { tooltip },
  data() {
    return {
      hoverIt: false, // hover的标志状态值
      reft: null, // tooltip 的选项
      target: null, // tooltip 的选项
    };
  },
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
    liPadding() { // 返回li的内边距，在竖式的时候要根据菜单的层数深度来调整缩进
      // if (this.direction === 'vertical') {
      //   const { menuDepth } = this;
      //   if (menuDepth !== 1) {
      //     return {
      //       paddingLeft: `${(menuDepth - 1) * 8}px`,
      //       height: '20px',
      //       lineHeight: '20px',
      //     };
      //   }
      //   return {
      //     paddingLeft: `${(menuDepth - 1) * 8}px`,
      //     height: '20px',
      //     lineHeight: '20px',
      //   };
      // }
      if (this.direction === 'vertical') {
        const { menuDepth } = this;
        if (menuDepth > 2) {
          return {
            paddingLeft: `${(menuDepth - 1) * 8}px`,
            height: '20px',
            lineHeight: '20px',
          };
        }
        // return {
        //   paddingLeft: `${(menuDepth - 1) * 8}px`,
        //   height: '20px',
        //   lineHeight: '20px',
        // };
      }
      return {};
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
          color: '#333',
        });
      }
      if (this.hoverIt) { // 展开并且被hover的状态
        return Object.assign({}, fontStyle, {
          color: this.ifExpand ? this.menuRoot.activeTextColor : '#4385ff',

        });
      }
      if (this.activeMenu.menuName && this.activeMenu.menuName === this.menuName) { // 被激活的状态
        return Object.assign({}, fontStyle, {
          color: this.menuRoot.activeTextColor,
        });
      }
      if (!this.ifExpand && this.menuDepth > 1) { // 收起来的状态
        return Object.assign({}, fontStyle, {
          color: '#333',
        });
      }
      return Object.assign({}, fontStyle, { // 其他状态
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
      if (this.hoverIt) { // hover状态
        if (this.direction === 'horizontal' && this.menuDepth === 1) { // 横式的根菜单显示下划线
          return {
            borderBottom: `1px solid ${this.menuRoot.activeTextColor}`,
          };
        } else if (this.direction === 'horizontal' && this.menuDepth !== 1) { // 横式的非根菜单显示底色
          return {
            backgroundColor: this.menuRoot.bgColor,
          };
        }
        if (this.direction === 'vertical' && this.menuDepth !== 1 && !this.ifExpand) {
          return {
            backgroundColor: this.menuRoot.activeBgColor,
          };
        }
        return { // 其他hover则右侧线+底色
          backgroundColor: this.menuRoot.activeBgColor,
          borderRight: `3px inset ${this.menuRoot.activeTextColor}`,
        };
      }
      if (this.activeMenu.menuName && this.activeMenu.menuName === this.menuName) { // 激活的时候
        if (this.direction === 'horizontal' && this.menuDepth === 1) { // 横式根菜单下划线
          return {
            borderBottom: `1px solid ${this.menuRoot.activeTextColor}`,
          };
        } else if (this.direction === 'horizontal' && this.menuDepth !== 1) { // 横式非根菜单底色
          return {
            backgroundColor: this.menuRoot.bgColor,
          };
        }
        if (this.direction === 'vertical' && this.menuDepth !== 1 && !this.ifExpand) {
          return {};
        }
        return { // 其他激活底色+左侧线
          backgroundColor: this.menuRoot.activeBgColor,
          // backgroundColor: this.mixColor(this.menuRoot.bgColor, 0.2),
          borderRight: `3px inset ${this.menuRoot.activeTextColor}`,
        };
      }
      // 2019.3.15修复item颜色(未展开时,气泡item默认底色为白色)
      if (!this.ifExpand && this.menuDepth > 1) {
        return {
          backgroundColor: '#fff',
        };
      }
      if (this.direction === 'vertical' && this.ifExpand && this.menuDepth > 1) { // 展开时,子菜单加深底色
        return {
          backgroundColor: this.mixColor(this.menuRoot.bgColor, 0.2),
        };
      }
      return { // 其他情况默认底色
        backgroundColor: this.menuRoot.bgColor,
      };
    },
    collapseLi() { // 收起来的li样式，合并各种状态的li样式
      return {};
    },
    bindMenu() { // 动态返回value方便watch更新
      return this.menuRoot.value;
    },
  },
  props: {
    disable: { type: Boolean, default: false }, // 是否被禁用
    link: {
      type: [Object, String], // 路由链接
    },
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
      if (this.activeMenu.menuName !== this.menuName) { // 不是当前激活的菜单，则构建菜单对象提交给主菜单注册
        const menuObject = {
          menuName: this.menuName,
          parents: [],
          link: this.link ? this.link : '',
        };
        let p = this.$parent;
        while (p !== this.menuRoot) {
          menuObject.parents.push(p);
          p = p.$parent;
        }
        this.updateMenu(menuObject);
      } else { // 是当前的且非根节点话重复点击就直接返回上一层
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
          this.updateMenu(menuObject);
        } else {
          this.updateMenu(menuObject);
        }
      }
      if ((this.direction === 'horizontal' || !this.ifExpand) && this.menuDepth > 1) { // 横式的非根菜单点击让所有的父级菜单收起来
        let p = this.$parent;
        let c = this.menuDepth;
        while (c > 1) {
          p.hoverList = false;
          p = p.$parent;
          c -= 1;
        }
      }
    },
    hoverHandler(e) { // hover处理函数
      if (this.disable) return; // 禁用直接返回
      if (!this.ifExpand && this.menuDepth === 1) { // 收起来的时候激活tooltip
        this.target = e;
        this.reft = e.currentTarget;
      }
      this.hoverIt = true;
      this.setDimiss('mouseover', this.$el, 'other', () => { // 移出目标之后重设值让它收起来
        this.hoverIt = false;
      });
    },
  },
  created() { // 创建的时候主动去检查父级value更新activeMenu
    if (this.bindMenu && this.bindMenu === this.menuName &&
      this.activeMenu.menuName !== this.menuName) {
      const menuObject = {
        menuName: this.menuName,
        parents: [],
        link: this.link ? this.link : '',
      };
      let p = this.$parent;
      while (p !== this.menuRoot) {
        menuObject.parents.push(p);
        p = p.$parent;
      }
      this.updateMenu(menuObject);
    }
  },
  watch: {
    bindMenu(val) { // watch主动去更新activeMenu
      if (val && val === this.menuName &&
        this.activeMenu.menuName !== this.menuName) {
        const menuObject = {
          menuName: this.menuName,
          parents: [],
          link: this.link ? this.link : '',
        };
        let p = this.$parent;
        while (p !== this.menuRoot) {
          menuObject.parents.push(p);
          p = p.$parent;
        }
        this.updateMenu(menuObject);
      }
    },
  },
};
</script>

<style scoped lang="less">
.t-menu.horizontal .t-menu-item{
  padding-left: 8px;
  border-bottom:1px solid transparent;
  .t-menu-item-text-warpper{
    display: inline-block;
    width: 60%;
  }
}
.t-menu.vertical .t-menu-item{
  border-right: 3px solid transparent;
  width: calc(100% - 11px);
  .t-menu-item-text-warpper{
    display: inline-block;
    width: 60%;
  }
 }
.t-menu-item{
  cursor: pointer;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 8px;
  transition: all .3s linear;
  -webkit-transition: all 0.3s linear;
  -moz-transition: all 0.3s linear;
  -ms-transition: all 0.3s linear;
  -o-transition: all 0.3s linear;
  &-icon-container, .t-menu-item-right-slot{
    position: relative;
    height: 18px;
    display: inline-block;
    margin-right: 10px;
    width: 20%;
  }
  &-icon-container *, .t-menu-item-right-slot *{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
  }
  .t-menu-item-right-slot *{
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
  }
}
</style>
