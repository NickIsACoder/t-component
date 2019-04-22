<template>
    <div :class="direction === 'horizontal' ? 't-steps-h' : 't-steps-v'"
         :style="{paddingLeft: paddingLeft + 'px', paddingRight: paddingRight + 'px'}">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 't-steps',
  data() {
    return {
      paddingLeft: 0,
      paddingRight: 0,
      partwidth: 0,
      partHeight: 0,
    };
  },
  computed: {
  },
  props: {
    direction: { type: String, default: 'horizontal' },
    active: Number,
    status: String,
    useNumber: { type: Boolean, default: true },
    iconProcess: { type: String, default: 'icon-hourglass' },
    iconWait: { type: String, default: 'icon-more' },
    iconSuccess: { type: String, default: 'icon-cc-check-circle' },
    iconFail: { type: String, default: 'icon-error-line' },
    iconColor: { type: Array, default() { return ['#4385ff', '#969696', '#4acd1f', '#f24a4a']; } },
  },
  methods: {
    getpaddingRight() {
      return parseInt(this.$children[this.$children.length - 1].textWidth, 10) / 2;
    },
    getpaddingLeft() {
      return parseInt(this.$children[0].textWidth, 10) / 2;
    },
    updateStyleH() {
      const nowWidth = parseFloat(window.getComputedStyle(this.$el.parentNode).width);
      this.paddingLeft = this.getpaddingLeft() ? this.getpaddingLeft() : 50;
      this.paddingRight = this.getpaddingRight() ? this.getpaddingRight() : 50;
      const newWidth = nowWidth - this.paddingLeft - this.paddingRight - 33;
      // this.$el.style.width = `${newWidth}px`;
      this.partwidth = (newWidth - this.paddingRight) / (this.$children.length - 1);
    },
    uodataStyleV() {
      const nowHeight = parseFloat(window.getComputedStyle(this.$el.parentNode).height);
      this.partHeight = (nowHeight - 48) / (this.$children.length - 1);
    },
  },
  mounted() {
    if (this.direction === 'horizontal') {
      this.updateStyleH();
    } else {
      this.uodataStyleV();
    }
  },
  updated() {
    if (this.direction === 'horizontal') {
      this.updateStyleH();
    } else {
      this.uodataStyleV();
    }
  },
};
</script>

<style scoped lang="less">
.t-steps-h{
  margin: 10px 0;
  padding-bottom: 100px;
}
  .t-steps-v{
    display: inline-block;
    height: 100%;
    margin-right: 100px;
    margin-bottom: 10px;
  }
</style>
