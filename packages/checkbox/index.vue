<template>
    <label class="t-checkbox" :class="[{'is-disabled': disable}]">
        <span class="t-checkbox-wrapper"
              :class="[
              {'is-checked': isChecked,
               'is-disabled': disable,
               'is-halfCheck': halfCheck}]">
            <input v-if="isGroup"
                   type="checkbox"
                   class="t-checkbox-wrapper-input"
                   :value="value"
                   @change="change"
                   v-model="model"
                   :disabled="disable">
            <input v-else
                   type="checkbox"
                   class="t-checkbox-wrapper-input"
                   :value="value"
                   v-model="model"
                   @change="change"
                   :disabled="disable">
            <span class="t-checkbox-wrapper-inner"></span>
        </span>
        <span class="t-checkbox-label" v-if="$slots.default">
            <slot></slot>
        </span>
      <span v-if="!$slots.default && showLabel" class="t-checkbox-label">
              {{displayMethod ? displayMethod(value) : value}}
      </span>
    </label>
</template>

<script>
export default {
  name: 't-checkbox',
  data() {
    return {
      currentValue: false,
      isLimit: false,
      isGroup: false,
      checkboxGroup: null,
    };
  },
  props: {
    checked: {},
    value: {},
    disable: {
      type: Boolean,
      default: false,
    },
    showLabel: { type: Boolean, default: true },
    // 自定义显示的内容
    displayMethod: {
      type: Function,
    },
    // 值为对象时，传判断的标识键名
    objKeyValue: {
      type: String,
      default: 'value',
    },
    halfCheck: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
  computed: {
    model: {
      get() {
        if (this.isGroup) {
          return this.store;
        }
        return this.checked !== undefined ? this.checked : this.currentValue;
      },
      set(val) {
        if (this.isGroup) {
          this.isLimit = false;
          if ((this.checkboxGroup.min !== undefined
              && val.length < this.checkboxGroup.min)
              || (this.checkboxGroup.max !== undefined
              && val.length > this.checkboxGroup.max)) {
            this.isLimit = true;
          }
          if (this.isLimit === false) {
            this.checkboxGroup.$emit.apply(this.checkboxGroup, ['input', val]);
          }
        } else {
          this.$emit('change', val);
          this.currentValue = val;
        }
      },
    },
    store() {
      return this.checkboxGroup ? this.checkboxGroup.value : this.value;
    },
    isChecked() {
      if (Array.isArray(this.model)) {
        const { objKeyValue, value } = this;
        const index = this.model.findIndex((x) => {
          if (typeof x === 'object') {
            return x[objKeyValue] && x[objKeyValue] === value[objKeyValue];
          }
          return x === value;
        });
        return index !== -1;
      } else if (this.model !== undefined && this.model !== null) {
        return this.model;
      } else if (typeof this.model === 'boolean') {
        return this.model;
      }
      return undefined;
    },
  },
  methods: {
    change() {
      if (this.isLimit) {
        return;
      }
      this.$nextTick(() => {
        if (this.isGroup) {
          this.checkboxGroup.$emit.apply(this.checkboxGroup, ['change', this.checkboxGroup.value]);
        }
      });
    },
  },
  mounted() {
    let parent = this.$parent;
    let name = parent.$options.name;
    // 向上查找名称为't-checkbox-group'的父组件
    while (parent && (!name || ['t-checkbox-group'].indexOf(name) < 0)) {
      parent = parent.$parent;
      if (parent) {
        name = parent.$options.name;
      }
    }
    if (parent) {
      this.checkboxGroup = parent;
      this.isGroup = true;
    }
  },
};
</script>

<style lang="less">
  @import "../assets/var.less";
  .t-checkbox {
    display: inline-block;
    position: relative;
    white-space: nowrap;
    outline: none;
    line-height: 1;
    vertical-align: middle;
    cursor: pointer;
    &-wrapper {
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      cursor: pointer;
      line-height: 1;
      position: relative;
      &-input {
        margin: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        cursor: pointer;
        opacity: 0;
      }
      &-inner {
        display: inline-block;
        width: 14px;
        height: 14px;
        position: relative;
        top: 0;
        left: 0;
        border: 1px solid #dddee1;
        border-radius: 2px;
        background-color: #fff;
        transition: border-color .2s ease-in-out,
          background-color .2s ease-in-out,
          box-shadow .2s ease-in-out;
        -webkit-transition: border-color .2s ease-in-out,
          background-color .2s ease-in-out,
          box-shadow .2s ease-in-out;
        -moz-transition: border-color .2s ease-in-out,
          background-color .2s ease-in-out,
          box-shadow .2s ease-in-out;
        -ms-transition: border-color .2s ease-in-out,
          background-color .2s ease-in-out,
          box-shadow .2s ease-in-out;
        -o-transition: border-color .2s ease-in-out,
          background-color .2s ease-in-out,
          box-shadow .2s ease-in-out;
        &:before {
          content: "";
          width: 4px;
          height: 8px;
          left: 4px;
          border: 2px solid #fff;
          position: absolute;
          background-color: @normal-color;
          opacity: 0;
          transform: rotate(45deg) scale(0);
          -webkit-transform: rotate(45deg) scale(0);
          -moz-transform: rotate(45deg) scale(0);
          -ms-transform: rotate(45deg) scale(0);
          -o-transform: rotate(45deg) scale(0);
          transition: all .2s ease-in-out;
          -webkit-transition: all .2s ease-in-out;
          -moz-transition: all .2s ease-in-out;
          -ms-transition: all .2s ease-in-out;
          -o-transition: all .2s ease-in-out;
          }
        }
        &.is-checked &-input + span {
                          background-color: @normal-color;
                          border-color: @normal-color;
                      }
        &.is-checked &-input + span:before {
                          border: 2px solid #fff;
                          border-top: 0;
                          border-left: 0;
                          opacity: 1;
                          transform: rotate(45deg) scale(1);
                          -webkit-transform: rotate(45deg) scale(1);
                          -moz-transform: rotate(45deg) scale(1);
                          -ms-transform: rotate(45deg) scale(1);
                          -o-transform: rotate(45deg) scale(1);
                          transition: all .2s ease-in-out;
                          -webkit-transition: all .2s ease-in-out;
                          -moz-transition: all .2s ease-in-out;
                          -ms-transition: all .2s ease-in-out;
                          -o-transition: all .2s ease-in-out;
                      }
        &.is-disabled &-input {
                        cursor: not-allowed;
                        }
        &.is-disabled &-input + span, &.is-disabled.is-halfCheck &-input + span {
                            cursor: not-allowed;
                            background-color: #dcdfe6;
                            border-color: #edf2fc;
                      }
        &.is-disabled &-input + span:before {
                            cursor: not-allowed;
                            background-color: #dcdfe6;
                            border-color: #edf2fc;
                      }
        &.is-halfCheck &-input + span {
            background-color: @normal-color;
            }
        &.is-halfCheck &-input + span:before {
                            content: '';
                            width: 8px;
                            height: 0;
                            transform: scale(1);
                            -webkit-transform: scale(1);
                            -moz-transform: scale(1);
                            -ms-transform: scale(1);
                            -o-transform: scale(1);
                            position: absolute;
                            left: 2px;
                            border-width: 1px;
                            top: 6px;
                            opacity: 1;
                        }
    }
    &-label {
          padding-left: 10px;
      }
  }
  .is-disabled,.is-disabled .t-checkbox-label {
      cursor: not-allowed !important;
      color: #bcc0c8;
  }
</style>
