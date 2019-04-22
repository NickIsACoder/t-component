<template>
   <span class="t-breadcrumb-item">
     <span :class="['t-breadcrumb-item-inner', to ? 'is-link' : '']" @click="handlerClick">
       <slot></slot>
     </span>
     <span class="t-breadcrumb-item-separator" v-html="separator"></span>
   </span>
</template>

<script>
export default {
  name: 'breadcrumbItem',
  data() {
    return {
      separator: '',
    };
  },
  inject: ['breadcrumb'],
  props: {
    to: {
      type: [String, Object],
      default: '',
    },
    replace: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handlerClick() {
      if (!this.to || !this.$router) return;
      if (this.replace) {
        this.$router.replace(this.to);
      } else {
        this.$router.push(this.to);
      }
    },
  },
  mounted() {
    this.separator = this.breadcrumb.separator;
  },
};
</script>

