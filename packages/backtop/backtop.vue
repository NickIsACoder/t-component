<template>
    <div class="t-backtop" :style="position" v-show="show" @click="goTop">
        <slot>
            <div class="t-backtop-wrapper">
                <i class="iconfont icon-top"></i>
            </div>
        </slot>
    </div>
</template>
<script>
export default {
  name: 't-backtop',
  data() {
    return {
      show: false,
      scrollTimeFunc: null,
    };
  },
  props: {
    showHeight: {
      type: Number,
      default: 300,
    },
    position: {
      type: Object,
      default: () => {
        const obj = {
          bottom: '40px',
          right: '40px',
        };
        return obj;
      },
    },
    duration: {
      type: Number,
      default: 500,
    },
  },
  methods: {
    isScroll() {
      this.show = window.pageYOffset > this.showHeight;
    },
    goTop() {
      this.scrollTimeFunc = setInterval(this.scrollBy, this.duration / 10);
    },
    scrollBy() {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      const step = Math.floor((top / this.duration) * 100);
      if (step <= 0) {
        clearInterval(this.scrollTimeFunc);
      } else {
        window.scrollTo(0, step);
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.isScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.isScroll);
  },
};
</script>
<style lang="less">
    .t-backtop {
        position: fixed;
        cursor: pointer;
        z-index: 9999;
        &-wrapper {
             background-color: #e5e5e5;
             border-radius: 2px;
             box-shadow: 0 1px 3px rgba(0,0,0,.2);
             padding: 8px 10px;
             &:hover {
                background-color: #4385ff;
                  color: #fff;
              }
         }
    }
</style>
