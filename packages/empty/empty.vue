<template>
  <div class="t-empty">
    <div class="t-empty-image">
      <slot name="image">
        <img :src="image" v-if="image" alt="empty">
        <img src="./empty.png" v-else alt="empty">
      </slot>
    </div>
    <div class="t-empty-description">
      <slot name="description">
        <p>{{description}}</p>
      </slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 't-empty',
  data() {
    return {};
  },
  props: {
    description: {
      type: String,
      default: '暂无数据',
    },
    image: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
  .t-empty {
    text-align: center;
    padding: 10px 0;
    &-image img {
      height: 80px;
    }
    &-description {
      font-size: 16px;
      color: #979797;
      padding: 5px 0;
    }
  }
</style>
