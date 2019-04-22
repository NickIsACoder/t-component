<template>
  <div :class="['t-list', {'t-list-border': border}]">
    <div class="t-list-head" v-if="showHead">
      <slot name="title">
        {{title}}
      </slot>
    </div>
    <div class="t-list-content">
      <slot></slot>
    </div>
    <div class="t-list-footer" v-if="showFooter">
      <slot name="footer">
        {{footer}}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 't-list',
  data() {
    return {};
  },
  props: {
    title: String,
    footer: String,
    border: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    showHead() {
      return this.title || this.$slots.title !== undefined;
    },
    showFooter() {
      return this.footer || this.$slots.footer !== undefined;
    },
  },
  methods: {},
};
</script>

<style lang="less">
  @list-border: #e5e5e5;
  @list-padding: 10px;
  .t-list {
    overflow: auto;
    &-border {
      border: 1px solid @list-border;
    }
    &-head {
      border-bottom: 1px solid @list-border;
      padding: @list-padding;
    }
  }
</style>
