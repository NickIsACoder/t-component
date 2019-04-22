<template>
    <div
            :class="[
            't-input-wrapper',
            `t-input-wrapper-${this.size}`,
            {
            'is-error':isError,
             't-input-group' : this.showPrepend || this.showAppend
             }
             ]">
        <textarea v-if="type === 'textarea'"
                  :class="['t-textarea', {'t-input-disabled': disable}]"
                  :placeholder="placeholder"
                  :readonly="readonly"
                  :disabled="disable"
                  :autofocus="autofocus"
                  :value="currentValue"
                  :maxlength="maxLength"
                  :minlength="minLength"
                  :cols="cols"
                  @keyup="handleKeyup"
                  @keyup.enter="handleKeyupEnter"
                  @focus="handleFocus"
                  @input="handleInput"
                  @blur="handleBlur"
                  :rows="rows"></textarea>
        <template v-else>
            <div v-if="showPrepend" class="t-input-group-label t-input-group-label-left">
                <slot name="leftLabel"></slot>
            </div>
            <span class="left-icon" v-if="showPrefix">
                <slot name="leftIcon">
                    <i class="iconfont icon-add"></i>
                </slot>
            </span>
            <i class="t-input-close iconfont icon-error"
               v-if="clearable && currentValue"
               @click="clear"></i>
            <input :type="type"
                   :class="inputClass"
                   :style="{borderColor: errorColor}"
                   :placeholder="placeholder"
                   :disabled="disable"
                   :maxlength="maxLength"
                   :minlength="minLength"
                   :max="max"
                   :min="min"
                   :value="currentValue"
                   :readonly="readonly"
                   :autofocus="autofocus"
                   @keyup="handleKeyup"
                   @keyup.enter="handleKeyupEnter"
                   @focus="handleFocus"
                   @input="handleInput"
                   @change="handleChange"
                   @blur="handleBlur">
            <div v-if="showAppend" class="t-input-group-label t-input-group-label-right">
                <slot name="rightLabel"></slot>
            </div>
            <span class="right-icon" v-if="showSuffix">
                <slot name="rightIcon">
                    <i class="iconfont icon-add"></i>
                </slot>
            </span>
        </template>
        <span class="t-input-error" v-if="isError" :style="{color: errorColor}">{{errorText}}</span>
    </div>
</template>
<script>
export default {
  name: 't-input',
  props: {
    value: {
      type: [String, Number],
    },
    type: {
      type: String,
      default: 'text',
    },
    size: {
      type: String,
      default: 'normal',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: [Function, RegExp],
    },
    errorMessage: {
      type: [Object, String],
    },
    placeholder: {
      type: String,
      default: '',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    rows: Number,
    cols: Number,
    max: Number,
    min: Number,
    maxLength: Number,
    minLength: Number,
  },
  data() {
    return {
      currentValue: this.value,
      isError: false,
      showPrefix: true,
      showSuffix: true,
      showPrepend: false,
      showAppend: false,
      errorColor: '',
      errorText: '',
    };
  },
  computed: {
    inputClass() {
      return [
        't-input',
        `t-input-${this.size}`,
        {
          't-input-disabled': this.disable,
          't-input-suffix': this.showSuffix,
          't-input-prefix': this.showPrefix,
          't-input-number': this.type === 'number',
        },
      ];
    },
  },
  methods: {
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleInput(e) {
      let value = e.target.value;
      if (this.type === 'number') value = Number.isNaN(Number(value)) ? value : Number(value);
      this.currentValue = value;
      this.$emit('input', value);
    },
    handleBlur(e) {
      this.handleValidate(this.currentValue);
      this.$emit('blur', e);
    },
    handleKeyup(e) {
      this.$emit('keyup', e);
    },
    handleKeyupEnter(e) {
      this.$emit('enter', e);
    },
    handleChange(e) {
      this.$emit('change', e);
    },
    clear() {
      this.currentValue = '';
      this.$emit('input', '');
      this.handleValidate(this.currentValue);
    },
    handleValidate(value) {
      if (this.validate) {
        if ({}.toString.call(this.validate) === '[object Function]') {
          this.isError = !this.validate(value);
        } else if (this.validate instanceof RegExp) {
          this.isError = !this.validate.test(value);
        }
      }
      this.$nextTick(() => {
        if (this.isError) {
          if (typeof this.errorMessage === 'string') {
            this.errorColor = '#f04b4b';
            this.errorText = this.errorMessage;
          } else if (typeof this.errorMessage === 'object') {
            this.errorColor = this.errorMessage.color ? this.errorMessage.color : '#f04b4b';
            this.errorText = this.errorMessage.text ? this.errorMessage.text : '';
          }
        } else {
          this.errorColor = '';
          this.errorText = '';
        }
      });
      return this.isError;
    },
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
  },
  mounted() {
    if (this.type !== 'textarea') {
      this.showPrefix = this.$slots.leftIcon !== undefined;
      this.showSuffix = this.$slots.rightIcon !== undefined;
      this.showPrepend = this.$slots.leftLabel !== undefined;
      this.showAppend = this.$slots.rightLabel !== undefined;
    } else {
      this.showPrefix = false;
      this.showSuffix = false;
    }
  },
};
</script>
<style lang="less">
    @input-normal-height: 32px;
    @input-small-height: 24px;
    @input-large-height: 40px;
    .t-input-wrapper {
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        display: inline-block;
        & .t-textarea:focus,
        & .t-input:focus {
            outline: none;
            border-color: #409eff;
        }
        &:hover {
         .t-input-close {
             display: inline-block;
         }
         }
    }

    .t-textarea {
        display: block;
        resize: none;
        padding: 5px 10px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        color: #606266;
        background-color: #fff;
        background-image: none;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    }
    .t-input {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: 14px;
        height: @input-normal-height;
        line-height: 1.5;
        outline: none;
        padding: 0 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        -webkit-transition:  border-color .2s cubic-bezier(.645,.045,.355,1);
        -ms-transition:  border-color .2s cubic-bezier(.645,.045,.355,1);
        -moz-transition:  border-color .2s cubic-bezier(.645,.045,.355,1);
        -o-transition:  border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        padding-right:26px;
        &-disabled {
            cursor: not-allowed;
            background: rgb(238, 238, 238);
        }
        &-prefix {
            padding-left: 32px;
        }
        &-suffix {
            padding-right: 32px;
        }
        &-number {
          ime-mode: disabled;
          padding-right: 25px;
        }
        &-close {
             width: 32px;
             height: @input-normal-height;
             line-height: @input-normal-height;
             font-size: 16px;
             text-align: center;
             color: #808695;
             position: absolute;
             right: 0;
             z-index: 1;
             display: none;
         }
        &-large {
             height: @input-large-height;
         }
        &-small {
             height: @input-small-height;
             font-size: 12px;
         }
    }
    .t-input-error {
        position: absolute;
        top: 100%;
        left: 0;
        font-size: 12px;
        color: #f04b4b;
    }
    .is-error .t-textarea,
    .is-error .t-textarea:focus,
    .is-error .t-input,
    .is-error .t-input:focus {
        border-color: #f04b4b;
    }
    .left-icon,.right-icon {
        width: 32px;
        height: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    & i {
          line-height: @input-normal-height;
      }
    }
    .right-icon {
        left: auto;
        right: 0;
    }
    .t-input-wrapper-large {
        .right-icon,.left-icon {
            & i {
                line-height: @input-large-height;
            }
        }
        .t-input-close {
            line-height: @input-large-height;
        }
     }
    .t-input-wrapper-small {
        .right-icon,.left-icon {
            & i {
                  line-height: @input-small-height;
              }
        }
        .t-input-close {
            line-height: @input-small-height;
        }
    }
    .t-input-group {
        display: table;
        border-collapse: separate;
        &-label {
            display: table-cell;
            white-space: nowrap;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            &-left {
                border-right: 0;
             }
             &-right {
                  border-left: 0;
              }
         }
        &>.t-input,
         &-label-left {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
          }
        &>.t-input,
         &-label-right {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
          }
        & .t-input:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
         }
        &>.t-input:last-child {
             border-top-right-radius: 4px;
             border-bottom-right-radius: 4px;
         }
    }
</style>
