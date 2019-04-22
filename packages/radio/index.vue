<template>
    <label
            :class="[
            't-radio',
            {'is-disabled' : disable}
            ]">
        <span class="t-radio-wrapper">
            <input type="radio"
                   :class="[
                   't-radio-wrapper-input',
                   {'is-disabled': disable}
                   ]"
                   :value="label"
                   v-model="model"
                   :disabled="disable"
                   @change="change">
            <span class="t-radio-wrapper-inner"></span>
        </span>
        <span class="t-radio-label">
            <slot>{{label}}</slot>
        </span>
    </label>
</template>
<script >
export default {
  name: 't-radio',
  data() {
    return {};
  },
  props: {
    checked: {
      type: [Number, String, Boolean],
    },
    value: {},
    label: {},
    disable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    change() {
      this.$nextTick(() => {
        this.$emit('change', this.model);
      });
    },
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<style lang="less">
    @import "../assets/var.less";
    .t-radio {
        display: inline-block;
        position: relative;
        white-space: nowrap;
        outline: none;
        vertical-align: middle;
        cursor: pointer;
        &-wrapper {
             display: inline-block;
             vertical-align: middle;
             white-space: nowrap;
             cursor: pointer;
             position: relative;

            &-input {
                 margin: 0;
                 position: absolute;
                 top: 0;
                 bottom: 0;
                 left: 0;
                 right: 0;
                 z-index: 1;
                 cursor: pointer;
                 opacity: 0;
             }

             &-inner {
                  display: inline-block;
                  width: 14px;
                  height: 14px;
                  position: relative;
                  top: 0;
                  left: 0;
                  border: 1px solid #dddee1;
                  -webkit-border-radius:50%;
                  -moz-border-radius:50%;
                  border-radius:50%;
                  background-color: #fff;
                  transition: border-color .2s ease-in-out,
                                background-color .2s ease-in-out,
                                box-shadow .2s ease-in-out;
                  -webkit-transition: border-color .2s ease-in-out,
                                background-color .2s ease-in-out,
                                box-shadow .2s ease-in-out;
                  -ms-transition: border-color .2s ease-in-out,
                                background-color .2s ease-in-out,
                                box-shadow .2s ease-in-out;
                  -moz-transition: border-color .2s ease-in-out,
                                background-color .2s ease-in-out,
                                box-shadow .2s ease-in-out;
                  -o-transition: border-color .2s ease-in-out,
                                background-color .2s ease-in-out,
                                box-shadow .2s ease-in-out;


                  &:before {
                      content: "";
                      display: table;
                      width: 8px;
                      height: 8px;
                      left: 3px;
                      top: 3px;
                      border-radius: 50%;
                      position: absolute;
                      background-color: @normal-color;
                      opacity: 0;
                      transform: scale(0);
                      -webkit-transform: scale(0);
                      -moz-transform: scale(0);
                      -ms-transform: scale(0);
                      -o-transform: scale(0);
                      transition: all .2s ease-in-out;
                      -webkit-transition: all .2s ease-in-out;
                      -moz-transition: all .2s ease-in-out;
                      -ms-transition: all .2s ease-in-out;
                      -o-transition: all .2s ease-in-out;
                   }
              }
            &-input:checked + span {
                /*background-color: @normal-color;*/
                border-color: @normal-color;
             }
            &-input:checked + span:before {
                opacity: 1.0;
                transform: scale(1);
                -webkit-transform: scale(1);
                -moz-transform: scale(1);
                -ms-transform: scale(1);
                -o-transform: scale(1);
                transition: all .2s ease-in-out;
                -webkit-transition: all .2s ease-in-out;
                -moz-transition: all .2s ease-in-out;
                -ms-transition: all .2s ease-in-out;
                -o-transition: all .2s ease-in-out;
             }
        }
        &-label {
            padding-left: 10px;
         }
    }
    .t-radio-wrapper-input.is-disabled +.t-radio-wrapper-inner {
        cursor: not-allowed;
        background-color: #dcdfe6;
        border-color: #edf2fc;
    ;   &:before {
                 cursor: not-allowed;
                 background-color: #dcdfe6;
                 border-color: #edf2fc;
             }
    }
    .is-disabled {
        cursor: not-allowed;

    & .t-radio-label {
        cursor: not-allowed;
        color: #bcc0c8;
    }

    }
</style>
