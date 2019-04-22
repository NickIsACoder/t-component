<template>
    <div class="t-cascader">
        <div :class="['t-cascader-header', {'is-disable': disable}]" @click="toggleDropdown">
            <span :class="displayValueClass">{{displayValue}}</span>
            <i class="iconfont icon-down-line t-cascader-arrow"
               v-if="selected.length === 0 || !selected"></i>
            <i class="iconfont icon-error t-cascader-arrow"
               v-else-if="clearable && selected.length > 0"
               @click.stop="handlerClear"></i>
        </div>
        <transition name="transition-drop">
            <div class="t-cascader-dropdown" v-show="showDrop" :style="dropStyle">
                <div>
                    <cascader-item :data="options"
                                   :multiple="multiple"
                                   ref="cascaderItem"
                                   @handleChoose="handleChoose"></cascader-item>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import cascaderItem from './cascaderItem';
import dimissMixin from '../utils/dimissMixin';
import Emitter from '../utils/emitter';

export default {
  name: 't-cascader',
  components: { cascaderItem },
  mixins: [dimissMixin, Emitter],
  data() {
    return {
      selected: this.value,
      showDrop: false,
      itemSelected: [],
    };
  },
  // provide: function () {
  //   return {
  //     updateSelected: this.updateSelected
  //   }
  // },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    loadData: Function,
    displayMethod: {
      type: [String, Function],
      default: 'label',
    },
    popupPlacement: {
      type: String,
      default: 'bottomLeft',
    },
    anyState: {
      type: Boolean,
      default: false,
    },
    notFoundText: {
      type: String,
      default: '无相关数据',
    },
    resultFilter: {
      type: Function,
    },
  },
  computed: {
    // 选择后数据的显示
    displayValue() {
      const { selected, displayMethod, placeholder, multiple } = this;
      // 自定义显示格式的属性为函数时，直接调用
      if ({}.toString.call(displayMethod) === '[object Function]') {
        return this.displayMethod(selected);
      }
      // 默认显示label（自定义显示格式的属性为字符串时，则根据该字段显示）并用'/'隔开
      const label = [];
      let multiLastLabel = '';
      for (let i = 0; i < selected.length; i++) {
        // 多选时，最后一级用逗号隔开
        if (multiple && selected[i].length > 0) {
          const last = [].concat(selected[selected.length - 1]);
          for (let j = 0; j < last.length; j++) {
            multiLastLabel += `${last[j][displayMethod]},`;
          }
          label.push(multiLastLabel);
        } else {
          label.push(selected[i][displayMethod]);
        }
      }
      return label.length > 0 ? label.join('/') : (placeholder || '');
    },
    displayValueClass() {
      return [
        {
          't-cascader-placeholder': this.showPlaceholder,
          't-cascader-value': !this.showPlaceholder,
        },
      ];
    },
    // 是否显示占位文本
    showPlaceholder() {
      return !this.selected.length > 0;
    },
    // popupPlacement下拉框位置
    dropStyle() {
      const style = {};
      switch (this.popupPlacement) {
        case 'bottomRight':
          style.right = '0px';
          break;
        case 'topLeft':
          style.top = '-190px';
          break;
        case 'topRight':
          style.top = '-190px';
          style.right = '0px';
          break;
        default:
          style.left = '0';
          break;
      }
      return style;
    },
  },
  methods: {
    // 更新当前选择的选项
    updateResult(result) {
      this.itemSelected = result;
    },
    toggleDropdown() {
      if (!this.disable) {
        this.showDrop = !this.showDrop;
        if (this.showDrop) {
          this.setDimiss('click', this.$refs.select, 'other', () => {
            this.showDrop = false;
            if (this.selected.length === 0) {
              this.$children[0].subItem = [];
            }
            this.cancelDimiss();
          });
        }
      }
    },
    handleChoose(value, close = false, fromInit = false) {
      if (this.anyState && !this.multiple) {
        this.selected = this.itemSelected;
      } else {
        if (close) {
          this.selected = this.itemSelected;
          if (!fromInit) {
            this.showDrop = false;
          }
        }
        this.$emit('choose', value);
      }
    },
    updateSelected(init = false) {
      this.itemSelected = this.selected;
      if (!this.anyState || init) {
        this.broadcast('t-cascader-item', 'find-choose', {
          value: this.itemSelected,
          fromInit: init,
        });
      }
    },
    handlerClear() {
      if (!this.disable) {
        this.itemSelected = [];
        this.selected = [];
        this.$children[0].clear();
      }
    },
  },
  watch: {
    selected: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.$emit('input', newVal);
          this.$emit('change', newVal);
        }
      },
      deep: true,
    },
    value(val) {
      if (val.length === 0) {
        this.itemSelected = [];
        this.$children[0].clear();
      }
      this.selected = val;
    },
    showDrop(val) {
      if (val) {
        this.updateSelected(true);
      }
    },
  },
  mounted() {
    this.updateSelected(true);
  },
};
</script>
<style lang="less">
    .t-cascader {
        display: inline-block;
        width: 100%;
        line-height: 1.5;
        vertical-align: middle;
        position: relative;
        font-size: 14px;
        &-header {
             display: block;
             outline: 0;
             background-color: #fff;
             border: 1px solid #dcdcdc;
             border-radius: 4px;
             position: relative;
             cursor: pointer;
          &.is-disable {
            cursor: not-allowed;
            background-color: #f5f5f5;
          }
        }
        &-arrow {
             position: absolute;
             top: 50%;
             right: 8px;
             line-height: 1;
             margin-top: -7px;
             font-size: 14px;
             color: #808695;
             transition: all .2s ease-in-out;
        }
        &-value,
        &-placeholder {
             display: block;
             height: 32px;
             line-height: 32px;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
             padding-left: 8px;
             padding-right: 24px;
        }
        &-placeholder {
             color: #a8a8a8;
        }
        &-dropdown {
             width: auto;
             padding: 0;
             white-space: nowrap;
             overflow: visible;
             max-height: 200px;
             margin: 5px 0;
             position: absolute;
             z-index: 900;
        }
    }
</style>
