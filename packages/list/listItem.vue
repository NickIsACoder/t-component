<template>
  <div class="t-list-item">
    <div class="t-list-item-wrapper">
      <div class="t-list-item-avatar" v-if="$slots.avatar !== undefined">
        <slot name="avatar"></slot>
      </div>
      <div class="t-list-item-head">
        <slot name="title">
          {{title}}
        </slot>
      </div>
      <div class="t-list-item-content">
        <slot></slot>
      </div>
      <div class="t-list-item-action" v-if="$slots.action !== undefined">
        <slot name="action"></slot>
      </div>
    </div>
    <div class="t-list-item-extra" v-if="showExtra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 't-list-item',
  data() {
    return {};
  },
  props: {
    title: String,
  },
  computed: {
    showExtra() {
      return this.$slots.extra !== undefined;
    },
  },
  methods: {},
};
</script>

<style lang="less">
  @list-border: #e5e5e5;
  .t-list-item {
    padding: 10px;
    border-bottom: 1px solid @list-border;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: flex;
    &-wrapper {
      display: block;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
    &-extra {
      margin-left: 40px;
    }
    &-avatar {
      display: inline-block;
      vertical-align: top;
    }
    &-head {
      display: inline-block;
      margin-bottom: 10px;
    }
    &:last-child {
      border-bottom: none;
    }
  }
</style>
