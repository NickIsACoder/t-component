<template>
    <button :class="classes"
            @click="handleClick"
            :disabled="disable">
        <i v-if="icon" :class="['iconfont', icon ? icon : '']"></i>
        <span v-if="showSlot"><slot></slot></span>
    </button>
</template>
<script>
export default {
  name: 't-button',
  data() {
    return {
      showSlot: true,
    };
  },
  props: {
    size: {
      type: String,
      default: 'normal',
    },
    type: {
      type: String,
      default: 'default',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    shape: {
      type: String,
      default: 'default',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
    classes() {
      return [
        't-btn',
        `t-btn-${this.type}`,
        `t-btn-${this.size}`,
        {
          [`t-btn-${this.shape}`]: this.shape !== 'default',
        },
      ];
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e);
    },
  },
  mounted() {
    this.showSlot = this.$slots.default !== undefined;
  },
};
</script>
<style lang="less">
    @import '../assets/var.less';
    @btn-padding-base: 10px 20px;
    @btn-padding-lg: 12px 20px;
    @btn-padding-sm: 9px 15px;

    @btn-default-color: @text-color;
    @btn-default-bg: #fff;
    @btn-default-border: @border-color-base;

    @btn-primary-color: #fff;
    @btn-primary-bg: @normal-color;
    @btn-primary-border: @normal-color;

    @btn-warning-color: #fff;
    @btn-warning-bg: @warning-color;
    @btn-warning-border: @warning-color;

    @btn-danger-color: #fff;
    @btn-danger-bg: @danger-color;
    @btn-danger-border: @danger-color;

    @btn-success-color: #fff;
    @btn-success-bg: @success-color;
    @btn-success-border: @success-color;

    @btn-info-color: #fff;
    @btn-info-bg: @info-color;
    @btn-info-border: @info-color;

    @btn-text-color: @text-color;
    .btn-color(@color; @background-color; @border-color) {
        color: @color;
        background-color: @background-color;
        border-color: @border-color;
    }
    .btn-size(@font-size; @padding; @border-radius) {
        font-size: @font-size;
        padding: @padding;
        border-radius: @border-radius;
    }
    .t-btn {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: @color-white;
        border: 1px solid;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 400;
        user-select: none;
        .btn-size(@body-text-size; @btn-padding-base; @border-radius-normal);

        &[disabled],
        &.disabled {
            cursor: not-allowed;
            background-color: #f5f5f5;
        }

        & > .icon + span {
            margin-left: 4px;
        }

        &-large {
            .btn-size(@body-text-size; @btn-padding-lg; @border-radius-normal);
        }

        &-small {
            .btn-size(@remark-text-size; @btn-padding-sm; @border-radius-normal);
        }

    }
    .t-btn-default {
        .btn-color(@btn-default-color; @btn-default-bg; @btn-default-border);
        &:hover {
            .btn-color(tint(@normal-color, 15%); @btn-default-bg; tint(@normal-color, 15%));
        }
        &:active {
          .btn-color(tint(@normal-color, 65%); @btn-default-bg; tint(@normal-color, 65%));
        }
    }

    .t-btn-primary {
        .btn-color(@btn-primary-color; @btn-primary-bg; @btn-primary-border);
        &:hover {
            .btn-color(@btn-primary-color;
                        tint(@btn-primary-bg, 15%);
                        tint(@btn-primary-border, 15%));
        }
        &:active {
          .btn-color(@btn-primary-color;
            tint(@btn-primary-bg, 35%);
            tint(@btn-primary-border, 35%));
        }
    }

    .t-btn-warning {
        .btn-color(@btn-warning-color; @btn-warning-bg; @btn-warning-border);
        &:hover {
         .btn-color(@btn-warning-color;
                     tint(@btn-warning-bg, 15%);
                     tint(@btn-warning-border, 15%));
        }
        &:active {
          .btn-color(@btn-warning-color;
            tint(@btn-warning-bg, 35%);
            tint(@btn-warning-border, 35%));
        }
    }

    .t-btn-danger {
        .btn-color(@btn-danger-color; @btn-danger-bg; @btn-danger-border);
        &:hover {
            .btn-color(@btn-danger-color;
                        tint(@btn-danger-bg, 15%);
                        tint(@btn-danger-border, 15%));
        }
        &:active {
          .btn-color(@btn-danger-color;
            tint(@btn-danger-bg, 35%);
            tint(@btn-danger-border, 35%));
        }
    }

    .t-btn-success {
        .btn-color(@btn-success-color; @btn-success-bg; @btn-success-border);
        &:hover {
            .btn-color(@btn-success-color;
                        tint(@btn-success-bg, 15%);
                        tint(@btn-success-border, 15%));
        }
        &:active {
          .btn-color(@btn-success-color;
            tint(@btn-success-bg, 35%);
            tint(@btn-success-border, 35%));
        }
    }

    .t-btn-info {
        .btn-color(@btn-info-color; @btn-info-bg; @btn-info-border);
        &:hover {
            .btn-color(@btn-info-color; tint(@btn-info-bg, 15%); tint(@btn-info-border, 15%));
        }
        &:active {
          .btn-color(@btn-info-color; tint(@btn-info-bg, 35%); tint(@btn-info-border, 35%));
        }
    }

    .t-btn-text {
        .btn-color(@btn-text-color; transparent; transparent);
        &:hover {
            color: @normal-color;
        }
        &:active {
          color: tint(@normal-color, 35%);;
        }
    }

    .t-btn-circle {
        border-radius: @border-radius-circle;
        padding: 12px;
    }

    .t-btn-ellipse {
        border-radius: @border-radius-ellipse;
    }
</style>
