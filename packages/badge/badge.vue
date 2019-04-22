<template>
  <span class="t-badge">
    <slot></slot>
    <transition name="t-badge">
      <sup v-if="type === 'text' && show" class="t-badge-sup"
           :style="{backgroundColor:color, color: textColor}">
        {{content}}
      </sup>
      <span v-if="type === 'dot' && show" class="t-badge-dot"
            :style="{backgroundColor:color}"></span>
    </transition>
  </span>
</template>

<script>
export default {
  name: 't-badge',
  data() {
    return {};
  },
  computed: {
    show() {
      return this.isShow;
    },
  },
  props: {
    type: { type: String, default: 'dot' },
    isShow: { type: Boolean, default: true },
    color: { type: String, default: '#f24a4a' },
    textColor: { type: String, default: '#fff' },
    content: { type: [String, Number] },
  },
};
</script>

<style scoped lang="less">
  .t-badge{
    display: inline-block;
    position: relative;
    &-dot{
      position: absolute;
      // 兼容IE
      top: 0;
      right: 0;
      transform: translate(50%,-50%);
      -webkit-transform: translate(50%,-50%);
      -moz-transform: translate(50%,-50%);
      -ms-transform: translate(50%,-50%);
      -o-transform: translate(50%,-50%);
      width: 10px;
      height: 10px;
      border-radius: 100%;
      display: inline-block;
    }
    &-sup{
      display: inline-block;
      padding: 2px 6px 2px;
      border-radius: 5px;
      height: 12px;
      line-height: 12px;
    }
  }
</style>
