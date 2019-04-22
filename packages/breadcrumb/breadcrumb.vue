<template>
  <div class="t-breadcrumb">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',
  data() {
    return {};
  },
  provide() {
    return {
      breadcrumb: this,
    };
  },
  props: {
    separator: {
      type: String,
      default: '/',
    },
  },
};
</script>

<style lang="less">
  @import "../assets/var";
  .t-breadcrumb {
    font-size: @font-size-normal;
    color: @text-color;
    &-item {
      &-inner {
        font-weight: 500;
        &.is-link {
          font-weight: normal;
          cursor: pointer;
          color: @link-color;
          &:hover {
            color: tint(@link-color, 35%);
          }
        }
      }
      &-separator {
        padding: 0 5px;
        font-size: @font-size-sm;
        color: @border-color-base;
      }
      &:last-child .t-breadcrumb-item-separator{
        display: none;
      }
    }
  }
</style>
