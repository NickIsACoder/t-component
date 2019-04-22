<template>
  <div>
    <transition name="t-msgbox">
      <div v-show="visible" class="t-msgbox">
        <div v-show="visible" class="t-msgbox-backdrop" @click="backdrop ? feedback('close') : 0"
             :style="{backgroundColor:backdropColor, opacity: backdrop ? 0.4 : 0}">
        </div>
        <div class="t-msgbox-body">
          <div  v-if="!customTpl" class="t-msgbox-wrapper">
            <div class="t-msgbox-title"
                 :style="{borderBottom: !renderIcon && type !== 'prompt' ?
                  '1px solid #e5e5e5' : 'none'}">
            <span class="iconfont"
                  :class="renderIcon"
                  :style="renderIconColor"
                  style="font-size: 20px;"></span>
              <!--根据设置里的icon和theme来确定图标-->
              <h3>{{title}}</h3>
              <i @click.stop="feedback('close')"  v-if="canClose" class="iconfont icon-close"
                 style="font-size: 20px;"></i>
            </div>
            <div class="t-msgbox-content" :style="{paddingLeft: renderIcon ? '45px' : '20px'}">
              <p v-if="type !== 'prompt'">{{text}}</p>
              <textarea placeholder="请输入内容"
                        @focus="showErrorMessage = ''"
                        v-else class="t-msgbox-input" v-model.trim="inputValue">
              </textarea>
              <transition name="showError">
                <p v-show="showErrorMessage" style="color:#f24a4a;transition: all .3s linear">
                  {{showErrorMessage}}
                </p>
              </transition>
              <div>
              </div>
            </div>
            <div class="t-msgbox-btngroup">
              <t-button v-for="(text,index) in buttonText" :key="index"
                      @click="index === 0 ? feedback('cancel') : feedback('confirm')"
                      :class="buttonClass[index] ? buttonClass[index] : 't-msgbox-defaultBtn'"
              >{{text}}</t-button>
            </div>
          </div>
          <div v-else class="t-msgbox-wrapper" >
            <i @click.stop="feedback('close')"  v-if="canClose" class="iconfont icon-close"
               style="font-size: 20px;"></i>
            <div v-html="customTpl" style="padding: 10px;"></div>
            <div class="t-msgbox-btngroup">
              <button v-for="(text,index) in buttonText" :key="index"
                      @click="index === 0 ? feedback('cancel') : feedback('confirm')"
                      :class="buttonClass[index] ? buttonClass[index] : 't-msgbox-defaultBtn'"
              >{{text}}</button>
            </div>
          </div>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import tButton from '../button/index';

export default {
  name: 't-messagebox',
  data() {
    return {
      callback: null,
      visible: false,
      inputValue: '',
      showErrorMessage: '',
    };
  },
  components: { tButton },
  computed: {
    renderIcon() { // 根据不同的选项渲染不同的图标
      if (this.icon) {
        return this.icon;
      }
      switch (this.theme) {
        case 'info':
          return 'icon-info-fill';
        case 'warning':
          return 'icon-warn-fill';
        case 'error':
          return 'icon-error';
        case 'success':
          return 'icon-radio-choosed';
        default:
          return '';
      }
    },
    renderIconColor() { // 设置图标的颜色
      if (this.iconColor) {
        return { color: this.iconColor };
      }
      switch (this.theme) {
        case 'info':
          return { color: '#4185ff' };
        case 'warning':
          return { color: '#feae38' };
        case 'error':
          return { color: '#f24a4a' };
        case 'success':
          return { color: '#4acd1f' };
        default:
          return '';
      }
    },
  },
  props: {
    title: { type: String },
    text: { type: String },
    icon: { type: String },
    iconColor: { type: String },
    inputValidate: { type: [Function, RegExp] },
    customTpl: { type: String, default: '' },
    type: { type: String },
    theme: { type: String },
    buttonText: { type: Array, default() { return ['取消', '确定']; } },
    buttonClass: { type: Array, default() { return ['t-msgbox-confirmBtn', 't-msgbox-cancelBtn']; } },
    canClose: { type: Boolean, default: true },
    onClose: { type: Function },
    backdrop: { type: Boolean, default: true },
    backdropColor: { type: String, default: '#767676' },
    errorMessage: { type: String, default: '非法数据' },
  },
  methods: {
    feedback(action) { // 操作后回调， 如果是prompt且有验证要求的话则需要验证正确性才能回调
      if (this.type === 'prompt' && this.inputValidate && action === 'confirm') {
        if (!this.validate()) {
          this.showErrorMessage = this.errorMessage;
          return;
        }
      }
      this.visible = false;
      this.showErrorMessage = ''; // 清空填入的值
      this.callback(action);
    },
    validate() {
      const { inputValidate: v, inputValue: input } = this;
      if (v) {
        if (typeof v === 'function') {
          return v(input);
        } else if (v instanceof RegExp) {
          return v.test(input);
        }
      }
      return input !== '';
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.inputValue = '';
      }
    },
  },
};
</script>

<style scoped lang="less">
  .t-msgbox{
    transition: all .3s linear;
    -webkit-transition:  all .3s linear;
    -moz-transition:  all .3s linear;
    -ms-transition:  all .3s linear;
    -o-transition:  all .3s linear;
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

    &-body{
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%,-50%);
      -moz-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      -o-transform: translate(-50%,-50%);
      padding: 0 3px;
      border: none;
      border-radius: 5px;
      box-shadow: 0 1px 1px 1px #e0e0e0;
      cursor: default;
      background-color: #fff;
      z-index: 699;
    }
    &-wrapper{
      min-width: 400px;
      /*min-height: 200px;*/
      padding: 0 3px;
      i{
        position: absolute;
        right: 10px;
        top: 10px;
      }
     }
    &-title{
      position: relative;
      padding:10px 15px;

      span{
        display: inline-block;
        margin-right: 5px;
      }

      h3{
        display: inline-block;
        font-weight: 500;
        margin: 0;
        font-size: 18px;
      }

      i{
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        -moz-transform: translate(0, -50%);
        -ms-transform: translate(0, -50%);
        -o-transform: translate(0, -50%);
      }
    }

    &-btngroup{
      /*position: absolute;*/
      /*bottom: 15px;*/
      padding: 15px;
      text-align: right;
      /*width: 90%;*/
      /*left: 50%;*/
      /*transform: translate(-50%, 0);*/
      button{
        /*float: right;*/
        /*padding: 5px 20px;*/
        margin-left: 30px;
        font-size: 15px;
      }
    }

    &-content{
      font-size: 16px;
      color: #7A7A7A;
      padding: 0 15px 10px 0;
      margin-top: 10px;
      p{
        margin: 0;
        word-break: break-all;
      };
    }
    &-cancelBtn{
      border: solid 1px #e5e5e5;
      outline: none;
      border-radius: 4px;
      background-color: #fff;
    }
    &-confirmBtn{
      border: none;
      outline: none;
      border-radius: 4px;
      background-color: #4385ff;
      color: #fff;
    }
    &-input {
      resize: none;
      width: calc(100% - 25px);
      height: 60px;
      outline: none;
      border: 0;
      border-radius: 4px;
      background-color: #f7f7f7;
      padding: 10px;
      font-size: 15px;
    }
  }
  .t-msgbox-enter,.showError-enter,
  .t-msgbox-leave-active, .showError-leave-active {
    opacity: 0;
  }
</style>
