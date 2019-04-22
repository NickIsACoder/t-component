<template>
   <div :class="classes">
     <div class="t-card-head" v-if="showHead">
       <div class="t-card-head-wrapper t-card-head-title">
         <slot name="title">
           <p>
             <slot name="avatar"></slot>
             {{title}}
           </p>
         </slot>
       </div>
       <div class="t-card-head-wrapper t-card-head-extra" v-if="showExtra">
         <slot name="extra"><span>{{extra}}</span></slot>
       </div>
     </div>
     <div class="t-card-img" v-if="image">
       <img :src="image" alt="img">
     </div>
     <div class="t-card-body">
       <slot></slot>
     </div>
     <div class="t-card-action" v-if="showAction">
       <slot name="action"></slot>
     </div>
   </div>
</template>

<script>
export default {
  name: 't-card',
  props: {
    title: {
      type: String,
      default: '',
    },
    extra: {
      type: String,
      default: '',
    },
    actions: {
      type: Array,
    },
    border: {
      type: Boolean,
      default: true,
    },
    hover: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
  },
  computed: {
    classes() {
      return [
        't-card',
        {
          't-card-border': this.border,
          't-card-dis-hover': !this.hover,
        },
      ];
    },
    showHead() {
      return this.title || this.$slots.title !== undefined;
    },
    showExtra() {
      return this.extra || this.$slots.extra !== undefined;
    },
    showAction() {
      return this.$slots.action !== undefined;
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/var";
  .t-card {
    /*cursor: pointer;*/
    position: relative;
    font-size: @font-size-normal;
    -webkit-border-radius: @border-radius-normal;
    -moz-border-radius: @border-radius-normal;
    border-radius: @border-radius-normal;
    &-border {
      border: 1px solid @border-color-base;
    }
    &:hover {
      -webkit-box-shadow: 0 1px 6px rgba(0,0,0,.2);
      -moz-box-shadow: 0 1px 6px rgba(0,0,0,.2);
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
    }
    &-dis-hover:hover {
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }
    &-head {
      padding: 10px ;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      display: -webkit-flex;
      &-wrapper {
        flex: 1;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        align-self: center;
      }
      &-extra {
        text-align: right;
        cursor: pointer;
      }
    }
    &-img {
      & img {
        width: 100%;
      }
    }
    &-body {
      padding: 10px;
    }
    &-action {
      border-top: 1px solid @border-color-base;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      align-self: center;
      text-align: center;
      &-item {
        flex: 1;
        font-size: @font-size-sm;
        border-left: 1px solid @border-color-base;
        padding: 10px 0;
        cursor: pointer;
        &:first-child {
          border-left: none;
        }
        &:hover {
          -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.2);
          -moz-box-shadow: 0 1px 1px rgba(0,0,0,.2);
          box-shadow: 0 1px 1px rgba(0,0,0,.2);
        }
      }
    }
  }
</style>
