<template>
    <transition>
        <ul class="t-tree-children" v-show="data.visible">
            <li class="t-tree-children-item" @click.stop="handleSelect">
                <div class="t-tree-children-item-content"
                     :class="{'is-select': isSelect === data.nodeKey,'is-disabled':data.disabled}">
                <span :class="[
                't-tree-children-item-arrow',
                {'t-tree-children-item-arrow-open':
                expand && (data[props.children] && data[props.children].length) && !data.loading}
                 ]"
                      @click="handleExpand">
                    <i class="iconfont icon-right-fill t-tree-children-item-arrow-expand"
                       v-if="showArrow"></i>
                    <i class="ball-clip-rotate"
                       v-if="'loading' in data && data.loading && !data.disabled"></i>
                </span>
                <t-checkbox v-if="showCheck"
                            v-model="data.checked"
                            :disable="data.disabled"
                            :halfCheck="data.halfCheck"
                            @click.stop
                            @change="handleChange"></t-checkbox>
                  <i :class="['iconfont', data.icon]"
                     v-if="data.icon" style="vertical-align: middle;"></i>
                <span
                      :class="[
                      't-tree-children-item-text',

                      ]" v-html="displayFormat(data)"></span>
                </div>
                <!-- v-if="showArrow" -->
                <t-tree-item v-show="expand"
                             v-if="showArrow"
                             :isSelect="isSelect"
                             v-for="(item, ind) in data[props.children]"
                             :key="ind"
                             :data="item"
                             :disabledKeys="disabledKeys"
                             :displayMethod="displayMethod"
                             :defaultExpandAll="defaultExpandAll"
                             :showCheck="showCheck"
                             :props="props"></t-tree-item>
            </li>
        </ul>
    </transition>
</template>
<script>
import tCheckbox from '../checkbox/index';
import Emitter from '../utils/emitter';

export default {
  name: 't-tree-item',
  components: { tCheckbox },
  mixins: [Emitter],
  data() {
    return {
      expand: !('loading' in this.data) && this.defaultExpandAll,
      checked: false,
      state: 0,
      disabled: false,
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    showCheck: {
      type: Boolean,
      default: true,
    },
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    // 禁用多选框的数据集
    disabledKeys: {
      type: Array,
      default: () => [],
    },
    isSelect: {
      type: Number,
      default: null,
    },
    // 展示选择时，自定义显示的内容
    displayMethod: {
      type: [String, Function],
      default: 'label',
    },
    props: {
      default: () => {
        const obj = {
          children: 'children',
          value: 'value',
          label: 'label',
        };
        return obj;
      },
    },
  },
  computed: {
    showArrow() {
      return (this.data[this.props.children] && this.data[this.props.children].length) ||
          ('loading' in this.data && !this.data.loading);
    },
  },
  watch: {
    defaultExpandAll(val) {
      this.expand = !('loading' in this.data) && val;
    },
  },
  methods: {
    // 内容自定义显示
    displayFormat(data) {
      if ({}.toString.call(this.displayMethod) === '[object Function]') {
        return this.displayMethod(data);
      }
      return data[this.displayMethod];
    },
    handleExpand() {
      if (!this.data[this.props.children]) {
        // 异步加载数据
        if (this.data.loading !== undefined && !this.data[this.props.children]) {
          let tree = this.$parent;
          let name = tree.$options.name;
          // 向上查找名为t-tree的父组件
          while (tree && (!name || ['t-tree'].indexOf(name) < 0)) {
            tree = tree.$parent;
            if (tree) {
              name = tree.$options.name;
            }
          }
          if (this.data.disabled) return;
          // 找到名为t-tree的父组件，并且父组件上有loadData方法
          if (tree && tree.loadData) {
            // 设置loading图标的显示
            this.$set(this.data, 'loading', true);
            tree.loadData(this.data, (children) => {
              this.$set(this.data, 'loading', false);
              if (children.length) {
                this.$set(this.data, this.props.children, children);
                this.handleExpand();
              } else {
                // 如果没有子节点，则删掉loading字段
                this.$delete(this.data, 'loading');
              }
            });
            return;
          }
        }
      }
      if (this.data[this.props.children] && this.data[this.props.children].length) {
        this.expand = !this.expand;
      }
    },
    handleChange(val) {
      const changes = {
        checked: val,
        nodeKey: this.data.nodeKey,
      };
      this.dispatch('t-tree', 'on-check', changes);
    },
    handleSelect() {
      this.dispatch('t-tree', 'on-select', this.data);
    },
  },
};
</script>
<style lang="less">
ul, li {
  list-style: none;
}
.t-tree-children {
    padding-left: 10px;
    &-item {
        color: #1d1c1d;
        line-height: 32px;
        &-content:hover {
            cursor: pointer;
            background-color: #e7f0ff;
         }
        & .is-disabled{
          cursor: not-allowed;
        }
        &-text {
          vertical-align: middle;
        }
        & .is-select {
              background-color: #e7f0ff;
              color: #4385ff;
          }
        &-arrow {
             cursor: pointer;
             min-width: 20px;
             text-align: center;
             position: relative;
             line-height: 32px;
             display: inline-block;
             height: 32px;
             vertical-align: middle;
            & .ball-clip-rotate {
                  margin-left: 20px;
                  vertical-align: text-bottom;
              }
            &-open {
                & .t-tree-children-item-arrow-expand{
                      -webkit-transform: rotate(90deg);
                      -moz-transform: rotate(90deg);
                      -ms-transform: rotate(90deg);
                      -o-transform: rotate(90deg);
                      transform: rotate(90deg);
                  }
            }
            &-expand {
                 position: absolute;
                 left: 0;
                 transition: all .2s ease-in-out;
                 -webkit-transition: all .2s ease-in-out;
                  -moz-transition: all .2s ease-in-out;
                  -ms-transition: all .2s ease-in-out;
                  -o-transition: all .2s ease-in-out;
             }
         }
    }
}
@keyframes rotate {
  0% {
      transform: rotate(0deg);
  }
  50% {
      transform: rotate(180deg);
  }
  100% {
      transform: rotate(360deg);
  }
}
@-webkit-keyframes rotate {
    0% {
        -webkit-transform: rotate(0deg);
    }
    50% {
        -webkit-transform: rotate(180deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
@-moz-keyframes rotate {
    0% {
        -moz-transform: rotate(0deg);
    }
    50% {
        -moz-transform: rotate(180deg);
    }
    100% {
        -moz-transform: rotate(360deg);
    }
}
@-ms-keyframes rotate {
    0% {
        -ms-transform: rotate(0deg);
    }
    50% {
        -ms-transform: rotate(180deg);
    }
    100% {
        -ms-transform: rotate(360deg);
    }
}
@-o-keyframes rotate {
    0% {
        -o-transform: rotate(0deg);
    }
    50% {
        -o-transform: rotate(180deg);
    }
    100% {
        -o-transform: rotate(360deg);
    }
}

.ball-clip-rotate {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    margin: 2px;
    animation-fill-mode: both;
    border: 2px solid #4385ff;
    border-bottom-color: transparent;
    background: transparent !important;
    display: inline-block;
    animation: rotate 0.75s 0s linear infinite;
}
</style>
