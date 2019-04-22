<template>
<div>
  <transition name="t-modal">
    <div v-show="value" class="t-modal">
      <div class="t-modal-backdrop"
           @click="backdrop && canClose ? closeModal() : 0"
           :style="{backgroundColor:backdropColor, opacity: backdrop ? 0.4 : 0}">
      </div>
      <div class="t-modal-content">
        <div class="t-modal-content-header">
          <slot name="header"></slot>
          <i @click="closeModal()"  v-if="canClose" class="iconfont icon-close"
             style="font-size: 20px;cursor: pointer"></i>
        </div>
        <div class="t-modal-content-body">
          <slot name="body"></slot>
        </div>
        <div class="t-modal-content-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
export default {
  name: 't-modal',
  data() {
    return {};
  },
  props: {
    onClose: { type: Function },
    canClose: { type: Boolean, default: true },
    backdrop: { type: Boolean, default: true },
    backdropColor: { type: String, default: '#767676' },
    value: { type: Boolean },
  },
  methods: {
    closeModal() {
      if (this.onClose) {
        this.onClose();
      }
      this.$emit('input', false);
    },
  },
};
</script>

<style scoped lang="less">
.t-modal{
  transition: all .3s linear;
  -webkit-transition: all .3s linear;
  -moz-transition: all .3s linear;
  -ms-transition: all .3s linear;
  -o-transition: all .3s linear;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;

  &-backdrop{
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0.4;
    height: 100vh;
    width: 100vw;
  }

  &-content{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    padding: 15px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 1px 1px 1px #e0e0e0;
    cursor: default;
    background-color: #fff;
    z-index: 699;
    min-width: 400px;
    min-height:200px ;

    i{
      position: absolute;
      right: 10px;
      top: 10px;
    }

    &-header{
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      min-height: 30px;
      width: 100%;
    }
    &-body{
      padding-bottom: 10px;
      min-height: 110px;
      width: 100%;
      margin-bottom: 10px;

    }
    &-footer{
      border-top: 1px solid #eee;
      padding-top: 10px;
      min-height: 30px;
      width: 100%;
    }
  }
}
.t-modal-enter,
.t-modal-leave-active {
  opacity: 0;
}
</style>
