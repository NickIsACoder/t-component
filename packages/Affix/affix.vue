<template>
  <div>
    <div :class="classes" :style="styles">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 't-affix',
  data() {
    return {
      styles: null,
      affixed: false,
      slotStyle: null,
    };
  },
  computed: {
    offsetType() {
      let type = 'top';
      if (this.offsetBottom >= 0) {
        type = 'bottom';
      }
      return type;
    },
    classes() {
      return [{
        't-affix': this.affixed,
      }];
    },
  },
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: Number,
  },
  methods: {
    onScroll() {
      // 滚动条滚动距离
      const scrollTop = this.getScroll(window, true);
      const targetOffset = this.getOffset(this.$el);
      const { affixed } = this;
      const windowHeight = window.innerHeight;
      const targetHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;
      if ((targetOffset.top - targetHeight) < scrollTop && this.offsetType === 'top' && !affixed) {
        this.styles = {
          position: 'fixed',
          width: `${this.$el.offsetWidth}px`,
          top: `${this.offsetTop}px`,
          left: `${targetOffset.left}px`,
        };
        this.affixed = true;
        this.$emit('on-change', this.affixed);
      } else if ((targetOffset.top - targetHeight) >= scrollTop && this.offsetType === 'top' && affixed) {
        this.styles = null;
        this.slotStyle = null;
        this.affixed = false;
        this.$emit('on-change', this.affixed);
      }
      if ((targetOffset.top + targetHeight + this.offsetBottom) - windowHeight > scrollTop && this.offsetType === 'bottom' && !affixed) {
        this.styles = {
          position: 'fixed',
          width: `${this.$el.offsetWidth}px`,
          bottom: `${this.offsetBottom}px`,
          left: `${targetOffset.left}px`,
        };
        this.affixed = true;
        this.$emit('on-change', this.affixed);
      } else if ((targetOffset.top + targetHeight + this.offsetBottom) - windowHeight <= scrollTop && this.offsetType === 'bottom' && affixed) {
        this.styles = null;
        this.affixed = false;
        this.$emit('on-change', this.affixed);
      }
    },
    // 获取滚动条的位置
    getScroll(target, top = false) {
      const pageOffset = top ? 'pageYOffset' : 'pageXOffset';
      const scrollPosition = top ? 'scrollTop' : 'scrollLeft';
      let rect = target[pageOffset];
      if (typeof rect !== 'number') {
        rect = window.document[scrollPosition];
      }
      return rect;
    },
    getOffset(target) {
      const rect = target.getBoundingClientRect();
      const docElement = window.document.body;
      const clientTop = docElement.clientTop || 0;
      const clientLeft = docElement.clientLeft || 0;
      const scrollTop = this.getScroll(window, true);
      const scrollLeft = this.getScroll(window);
      return {
        top: (rect.top + scrollTop) - clientTop,
        left: (rect.left + scrollLeft) - clientLeft,
      };
    },
  },
  mounted() {
    window.addEventListener('resize', this.onscroll);
    window.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onscroll);
    window.removeEventListener('scroll', this.onScroll);
  },
};
</script>

<style lang="less">
  .t-affix {
    position: fixed;
    z-index: 999;
  }
</style>
