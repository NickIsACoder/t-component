<template>
  <div class="t-step"
       :style="{width: totalWidth,
       height: totalHeight,
       display: direction === 'horizontal' ? 'inline-block' : 'block',
       marginBottom: direction === 'horizontal' ? '0' : '5px',
        }">
    <div :class="direction === 'horizontal'? 't-step-mainbox-h': 't-step-mainbox-v'">
      <div class="icon-container" v-show="!$slots.icon">
        <span v-if="(status === 'process' || status === 'wait') && useNumber" class="number"
              :class="numberClass">{{thisIndex + 1}}</span>

        <span v-else class="iconfont step-icon" :class="renderIcon" style="font-size: 26px;"
                   :style="{color: renderColor}" ></span>
      </div>
      <div class="icon-container-slot" v-show="$slots.icon">
        <slot name="icon"></slot>
      </div>
      <div class="text" ref="text">
        <span class="title"><slot name="title" >{{title}}</slot></span>
        <span class="description"><slot name="description">{{description}}</slot></span>
      </div>
    </div>
    <div :class="direction === 'horizontal'? 't-step-leftline-h' : 't-step-leftline-v'"
         v-if="thisIndex !== this.$parent.$children.length - 1">
      <div></div>
      <div class="active-line" :style="lineStyle"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
export default {
  name: 't-step',
  data() {
    return {
      textWidth: 'px',
    };
  },
  computed: {
    thisIndex() {
      return this.$parent.$children.findIndex(val => val._uid === this._uid);
    },
    activeIndex() {
      return this.$parent.active;
    },
    direction() {
      return this.$parent.direction;
    },
    totalWidth() {
      if (!this.$parent.partwidth || this.thisIndex === this.$parent.$children.length - 1) return 'auto';
      return `${this.$parent.partwidth}px`;
    },
    totalHeight() {
      if (!this.$parent.partHeight || this.thisIndex === this.$parent.$children.length - 1) return '28px';
      return `${this.$parent.partHeight}px`;
    },
    useNumber() {
      return this.$parent.useNumber;
    },
    status() {
      const { thisIndex, activeIndex } = this;
      if (thisIndex > activeIndex) {
        return 'wait';
      } else if (thisIndex < activeIndex) {
        return 'success';
      }
      return this.$parent.status;
    },
    numberClass() {
      if (this.status === 'process') {
        return 'process-number';
      }
      return '';
    },
    renderIcon() {
      const { status } = this;
      if (this.icon) {
        return this.icon;
      }
      switch (status) {
        case 'process':
          return this.$parent.iconProcess;
        case 'error':
          return this.$parent.iconFail;
        case 'wait':
          return this.$parent.iconWait;
        case 'success':
          return this.$parent.iconSuccess;
        default:
          return '';
      }
    },
    renderColor() {
      const { status } = this;
      switch (status) {
        case 'process':
          return this.$parent.iconColor[0];
        case 'error':
          return this.$parent.iconColor[3];
        case 'wait':
          return this.$parent.iconColor[1];
        case 'success':
          return this.$parent.iconColor[2];
        default:
          return '';
      }
    },
    lineStyle() {
      if (this.direction === 'horizontal') {
        return { width: this.thisIndex < this.activeIndex ? '100%' : 0 };
      }
      return { height: this.thisIndex < this.activeIndex ? '100%' : 0 };
    },
  },
  props: {
    title: { type: String },
    description: { type: String },
    icon: { type: String },
  },
  mounted() {
    if (this.thisIndex === 0 || this.thisIndex === this.$parent.$children.length - 1) {
      const text = this.$refs.text;
      this.textWidth = window.getComputedStyle(text).width;
    }
  },
  updated() {
    if (this.thisIndex === 0 || this.thisIndex === this.$parent.$children.length - 1) {
      const text = this.$refs.text;
      this.textWidth = window.getComputedStyle(text).width;
    }
  },
};
</script>

<style scoped lang="less">
  @import "../assets/var";
.t-step{
  display: inline-block;
  position: relative;

  &-leftline-h{
    display: inline-block;
    padding: 0;
    width: calc(100% - 36px);
    position: relative;
    transform: translateY(-12px);
    -webkit-transform: translateY(-12px);
    -moz-transform: translateY(-12px);
    -ms-transform: translateY(-12px);
    -o-transform: translateY(-12px);
    &>div {
      width: 100%;
      height: 1px;
      background-color: #969696;
    }
    .active-line{
      background-color: #4385ff;
      transition: all 0.5s linear;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -ms-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
    }
  }
  &-leftline-v{
    display: block;
    padding-left: 28px;
    margin-top: 13px;
    height: calc(100% - 36px);
    position: relative;
    transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
    -moz-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    -o-transform: translateY(-10px);
    &>div {
      height: 100%;
      width: 2px;
      background-color: #969696;
    }
    .active-line{
      position: absolute;
      top: 0;
      left: 28px;
      background-color: #4385ff;
      transition: all 0.5s linear;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -ms-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
      z-index: 699;
    }
  }
  &-mainbox-h{
    position: relative;
    display: inline-block;
    cursor: pointer;
    width: 28px;
    height: 28px;

    .icon-container, .icon-container-slot{
      display: inline-block;
      margin-right: 3px;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .step-icon{
      display: inline-block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .icon-container-slot *{
      display: inline-block;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
    }
    .number{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      font-size: 19px;
      color:#8e8e8e;
      display: inline-block;
      border-radius: 100%;
      border: 2px solid #e8e8e8;
      width: 19px;
      height: 19px;
      padding: 2px;
      text-align: center;
      line-height: 1;
    }
    .text{
      transform: translate(-50%, 100%);
      -webkit-transform: translate(-50%, 100%);
      -moz-transform: translate(-50%, 100%);
      -ms-transform: translate(-50%, 100%);
      -o-transform: translate(-50%, 100%);
      text-align: center;
      position: absolute;
      bottom: -5px;
      left:calc(-50% + 28px);
      white-space:nowrap;
      .title{
        color: #222222;
      }
      .description{
        color: #8e8e8e;
      }
    }
  }
  &-mainbox-v{
    position: relative;
    display: inline-block;
    padding-left: 15px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    .icon-container{
      display: inline-block;
      margin-right: 3px;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .step-icon{
      display: inline-block;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .number{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      font-size: 19px;
      color:#8e8e8e;
      display: inline-block;
      border-radius: 100%;
      border: 2px solid #e8e8e8;
      width: 19px;
      height: 19px;
      padding: 1px;
      text-align: center;
      line-height: 1;
    }
    .text{
      // transform: translate(calc(100% + 15px), 3px);
      // -webkit-transform: translate(calc(100% + 15px), 3px);
      // -moz-transform: translate(calc(100% + 15px), 3px);
      // -ms-transform: translate(calc(100% + 15px), 3px);
      // -o-transform: translate(calc(100% + 15px), 3px);
      text-align: left;
      position: absolute;
      top: 3px;
      left:calc(50% + 30px);
      white-space:nowrap;
      .title{
        color: #222222;
      }
      .description{
        color: #8e8e8e;
      }
    }
  }
}
  .process-number{
    border: 2px solid #4385ff !important;
    color: #ffffff !important;
    background-color: #4385ff;
  }
</style>
