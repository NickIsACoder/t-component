<template>
    <div
            :class="[
            't-select',
            {
                't-select-signal': !multiple,
                't-select-multiple': multiple,
                't-select-show-drop': showDrop,
            }
            ]" ref="select">
        <div class="t-select-header" :style="disabledStyle" @click="showDropdown">
            <div v-if="multiple" class="dis-inline">
                <span v-for="(val, ind) in values" :key="ind" class="t-select-multi-text">
                     <span v-html="displayFormat(val)"></span>
                    <i class="iconfont icon-error" @click.stop="deleteItem(ind)"></i>
                </span>
            </div>
            <span :class="signalShowClasses" v-show="signalShowValue">
                {{signalShowValue}}
            </span>
            <input type="text"
                   v-if="canInput"
                   v-model="inputValue"
                   class="t-select-input"
                   :disabled="disable"
                   ref="input"
                   :style="inputStyle"
                   :placeholder="showPlaceholder ? placeholder : ''"
                   @keyup="handlerKeyup"
                   @focus="handlerFocus"
                   @blur="handlerBlur"/>
            <i class="iconfont icon-error t-select-arrow"
               v-if="resetSelect && !multiple && !disable"
               @click.stop="clearValue"></i>
            <i class="iconfont icon-down-line t-select-arrow"
               v-else-if="!resetSelect && !disable"></i>
        </div>
        <transition name="transition-drop">
            <div class="t-select-dropdown" v-show="showDrop">
                <ul class="t-select-dropdown-list">
                    <li v-for="(option, idx) in selectOptions"
                        :key="idx"
                        :class="[
                    't-select-dropdown-item',
                    {'is-select': values.findIndex(x => x.value === option.value) !== -1}]"
                        @click="selectOption(option)">
                        <span v-html="displayFormat(option)">
                        </span>
                        <i class="iconfont icon-correct"
                           v-if="values.findIndex(x => x.value === option.value) !== -1"></i>
                    </li>
                </ul>
                <ul class="t-select-dropdown-list" v-if="showNoData">
                    <li class="t-select-dropdown-item">
                        <span>无相关数据</span>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script>
import dimissMixin from '../utils/dimissMixin';

export default {
  name: 't-select',
  mixins: [dimissMixin],
  data() {
    return {
      showDrop: false,
      inputValue: '',
      values: [],
      inputLength: 32,
    };
  },
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    canInput: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    filterMethod: {
      type: Function,
      default: (arr, str) => arr.filter(x => x.label.includes(str)),
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    options: {
      type: Array,
      default: () => [],
    },
    displayMethod: {
      type: [String, Function],
      default: 'label',
    },
  },
  computed: {
    // 单选时显示的样式
    signalShowClasses() {
      const { multiple, canInput, showPlaceholder } = this;
      return [{
        't-select-placeholder': showPlaceholder && !canInput,
        't-select-selected-value': !multiple && !canInput && !showPlaceholder,
      }];
    },
    // 单选时显示的内容
    signalShowValue() {
      if ((this.multiple && this.values.length > 0) || this.canInput) {
        return '';
      }
      const value = this.values[0];
      if ({}.toString.call(this.displayMethod) === '[object Function]') {
        return value ? this.displayMethod(value) : (this.placeholder || '');
      }
      return value ? value[this.displayMethod] : (this.placeholder || '');
    },
    // 是否显示占位文本
    showPlaceholder() {
      if (!this.multiple) {
        const value = this.values[0];
        return !(value && value.label);
      }
      return !this.values.length > 0;
    },
    // 是否有相关选项
    showNoData() {
      return !this.selectOptions.length > 0;
    },
    // 选项
    selectOptions() {
      if (!this.canInput) {
        return this.options;
      }
      const { inputValue, options } = this;
      return this.filterMethod(options, inputValue);
    },
    resetSelect() {
      return !this.showPlaceholder;
    },
    // 输入框样式
    inputStyle() {
      const style = {};
      if (this.multiple && this.canInput) {
        if (this.showPlaceholder) {
          style.width = '100%';
        } else {
          style.width = `${this.inputLength}px`;
        }
      }
      if (this.disable) {
        style.cursor = 'not-allowed';
      }
      return style;
    },
    disabledStyle() {
      const style = {};
      if (this.disable) {
        style.backgroundColor = '#eee';
        style.cursor = 'not-allowed';
      }
      return style;
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
    showDropdown(e) {
      if (this.disable) {
        return;
      }
      // 支持输入搜索时点击自动聚焦输入框
      if (this.canInput && e.target === this.$el.firstChild) {
        this.$refs.input.focus();
      }
      this.showDrop = !this.showDrop;
      if (this.showDrop) {
        // 当下拉框打开时，点击非本组件区域的时候，自动关闭下拉框
        this.setDimiss('click', this.$refs.select, 'other', () => {
          this.showDrop = false;
          // 支持输入搜索时关闭下拉框后的输入框的显示
          if (this.canInput) {
            if (!this.multiple && this.value[0]) {
              this.inputValue = this.value[0].label;
            } else {
              this.inputValue = '';
            }
          }
          this.cancelDimiss();
        });
      }
    },
    // 选中选项
    selectOption(option) {
      if (!this.multiple) {
        this.values = [];
        this.values.push(option);
        this.showDrop = false;
      } else {
        const index = this.values.findIndex(x => x.value === option.value);
        if (index !== -1) {
          this.values.splice(index, 1);
        } else {
          this.values.push(option);
        }
        this.inputValue = '';
      }
    },
    // 清空选中的数据
    clearValue() {
      this.inputValue = '';
      this.values = [];
    },
    handlerKeyup(e) {
      this.$emit('keyup', e);
    },
    handlerFocus(e) {
      this.$emit('focus', e);
    },
    handlerBlur(e) {
      this.$emit('blur', e);
    },
    deleteItem(index) {
      this.values.splice(index, 1);
    },
  },
  watch: {
    value(val) {
      this.values = val;
    },
    values(val) {
      // 单选并可输入搜索筛选时，输入框的显示内容
      if (!this.multiple && this.canInput) {
        this.inputValue = val[0] ? val[0].label : '';
      }
      this.$emit('input', val);
      this.$emit('change', val);
    },
  },
  mounted() {
    if (this.selectOptions.length > 0) {
      this.values = this.value;
    }
  },
};
</script>
<style lang="less">
.dis-inline {
    display: inline;
}
.t-select {
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
        cursor: pointer;
        padding: 0 3px;
    }
    &-input {
         display: inline-block;
         height: 32px;
         line-height: 32px;
         padding: 0 24px 0 8px;
         outline: 0;
         border: none;
         box-sizing: border-box;
         color: #515a6e;
         background-color: transparent;
         position: relative;
         cursor: pointer;
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
    &-selected-value, &-placeholder {
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
    &-signal {
        .t-select-input {
            width: 100%;
        }
    }
    &-multiple {
        .t-select-input {
            padding: 0 0 0 5px;
        }
     }
    &-multi-text {
         display: inline-block;
         padding: 0 5px;
         margin: 4px 0;
         font-size: 14px;
         height: 24px;
         line-height: 24px;
        & i {
            font-size: 14px;
              color: #b2b2b2;
          }
     }
    &-show-drop {
        .t-select-header {
            border-color: #4385ff;
        }
        .t-select-arrow {
            transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            -o-transform: rotate(180deg);
        }
    }
    &-dropdown {
        position: absolute;
        width: 100%;
        z-index: 2000;
        max-height: 200px;
        overflow: auto;
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
         &-list {
              min-width: 100%;
              list-style: none;
              margin:0;
              padding:0;
         }
          &-item {
               font-size: 14px;
               padding: 0 20px;
               position: relative;
               white-space: nowrap;
               overflow: hidden;
               text-overflow: ellipsis;
               color: #606266;
               height: 32px;
               line-height: 32px;
               box-sizing: border-box;
               cursor: pointer;
               &.is-select, &:hover {
                    color: #4385ff;
               }
               & i {
                     position: absolute;
                     right: 10px;
                     font-size: 12px;
                 }
           }
     }
}
</style>
