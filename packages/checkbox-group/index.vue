<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 't-checkbox-group',
  data() {
    return {};
  },
  props: {
    value: {},
    disable: Boolean,
    max: Number,
    min: Number,
  },
  methods: {},
};
</script>
