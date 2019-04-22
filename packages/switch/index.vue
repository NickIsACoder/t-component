<template>
    <div :class="classes" @click="change">
        <input type="hidden" :value="currentValue" :disabled="disable">
        <span class="t-switch-label">
            <slot name="openText" v-if="currentValue === activeValue"></slot>
            <slot name="closeText" v-if="currentValue === inactiveValue"></slot>
        </span>
    </div>
</template>
<script>
export default {
  name: 't-switch',
  props: {
    value: {
      type: [String, Number, Boolean],
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: 'normal',
    },
    // 启用状态的value
    activeValue: {
      type: [String, Number, Boolean],
      default: true,
    },
    // 禁用状态的value
    inactiveValue: {
      type: [String, Number, Boolean],
      default: false,
    },
  },
  data() {
    return {
      currentValue: this.value === this.activeValue ? this.activeValue : this.inactiveValue,
    };
  },
  computed: {
    classes() {
      return [
        't-switch',
        `t-switch-${this.size}`,
        `t-switch-${this.type}`,
        {
          't-switch-checked': this.currentValue === this.activeValue,
          't-switch-disabled': this.disable,
        },
      ];
    },
  },
  methods: {
    change(event) {
      event.stopPropagation();
      if (this.disable) {
        return;
      }
      const checked =
          this.currentValue === this.activeValue ? this.inactiveValue : this.activeValue;
      this.currentValue = checked;
      this.$emit('input', checked);
      this.$emit('change', checked);
    },
  },
  watch: {
    value(val) {
      if (val === this.activeValue || val === this.inactiveValue) {
        this.currentValue = val;
      }
    },
  },
};
</script>

<style lang="less">
    @import "../assets/var.less";
    @switch-default-color: @text-color;

    @switch-normal-width: 50px;
    @switch-normal-height: 22px;
    @switch-normal-after: 18px;

    @switch-large-width: 65px;
    @switch-large-height: 30px;
    @switch-large-after: 25px;

    @switch-small-width: 28px;
    @switch-small-height: 16px;
    @switch-small-after: 12px;
    .t-switch {
        display: inline-block;
        width: @switch-normal-width;
        height: @switch-normal-height;
        line-height: @switch-normal-height;
        border-radius: @switch-normal-height;
        vertical-align: middle;
        border: 1px solid #ccc;
        background-color: #ccc;
        position: relative;
        cursor: pointer;
        user-select: none;
        transition: all .2s ease-in-out;
        -webkit-transition: all .2s ease-in-out;
        -moz-transition: all .2s ease-in-out;
        -ms-transition: all .2s ease-in-out;
        -o-transition: all .2s ease-in-out;

        &:after {
            content: '';
            width: @switch-normal-after;
            height: @switch-normal-after;
            border-radius: @switch-normal-after;
            background-color: #fff;
            top: 2px;
            left: 1px;
            position: absolute;
            transition: left .2s ease-in-out, width .2s ease-in-out;
            -webkit-transition: left .2s ease-in-out, width .2s ease-in-out;
            -moz-transition: left .2s ease-in-out, width .2s ease-in-out;
            -ms-transition: left .2s ease-in-out, width .2s ease-in-out;
            -o-transition: left .2s ease-in-out, width .2s ease-in-out;
        }
        &-label {
            color: #fff;
            font-size: @remark-text-size;
            position: absolute;
            left: (@switch-normal-width + @switch-normal-after) / 2 - 2;

            i {
                width: 14px;
                height: 14px;
                font-size: 14px;
                text-align: center;
                position: relative;
            }
        }
        &-checked {
            background-color: @normal-color;
            border-color: @normal-color;

            &:after {
                 left: @switch-normal-width - @switch-normal-after - 2;
            }

            .t-switch-label {
                left: @switch-normal-after / 2 - 2;
            }
        }

        &-large {
             width: @switch-large-width;
             height: @switch-large-height;
             line-height: @switch-large-height;
            &:after {
                 width: @switch-large-after;
                 height: @switch-large-after;
             }

             &.t-switch-checked:after {
                  left: @switch-large-width - @switch-large-after - 2;
              }
        }
        &-small {
             width: @switch-small-width;
             height: @switch-small-height;
             line-height: @switch-small-height;
        &:after {
             width: @switch-small-after;
             height: @switch-small-after;
         }

        &.t-switch-checked:after {
             left: @switch-small-width - @switch-small-after - 2;
         }
        }

        &-disabled {
             cursor: not-allowed;
             background-color: #dcdcdc;
            border-color: #dcdcdc;
         }
    }

    .t-switch-warning {
        &.t-switch-checked {
            background-color: @warning-color;
            border-color: @warning-color;
         }
    }
    .t-switch-danger {
        &.t-switch-checked {
             background-color: @danger-color;
             border-color: @danger-color;
         }
    }
    .t-switch-success {
        &.t-switch-checked {
             background-color: @success-color;
             border-color: @success-color;
         }
    }
    .t-switch-info {
        &.t-switch-checked {
             background-color: @info-color;
             border-color: @info-color;
         }
    }
</style>
