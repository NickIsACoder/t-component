<template>
    <div :class="classes">
        <div class="t-progress-line-outer"
             v-if="type === 'line'">
            <div class="t-progress-line-inner">
                <div :style="lineStyles" ></div>
            </div>
        </div>
        <div class="t-progress-circle" :style="{height: width + 'px', width: width + 'px'}" v-else>
            <svg :width="width" :height="width">
                <circle id="backdrop"
                        :r="width / 2 - 10"
                        :cy="width / 2"
                        :cx="width / 2"
                        stroke-width="4"
                        stroke="#ccc"
                        fill="none"></circle>
                <circle id="progress"
                        :r="width / 2 - 10"
                        :cy="width / 2"
                        :cx="width / 2"
                        stroke-width="5"
                        :stroke="circleColor"
                        fill="none"
                        :stroke-dasharray='dashArrayWidth.end'>
                    <animate attributeName="stroke-dasharray"
                             :from="dashArrayWidth.start"
                             :to="dashArrayWidth.end" dur="1s"/>
                    <animate attributeName="stroke" from="#ccc" :to="circleColor" dur="1s" />
                </circle>
            </svg>
        </div>
        <span class="t-progress-text" v-if="showInfo">
            <i v-if="currentStatus === 'success'"
               class="iconfont icon-correct"
               :style="{color: circleColor}"></i>
            <i v-else-if="currentStatus === 'exception'"
               class="iconfont icon-close"
               :style="{color: circleColor}"></i>
            <span v-else>{{percent}}%</span>
        </span>
    </div>
</template>
<script>
export default {
  name: 't-progress',
  data() {
    return {
      currentStatus: this.status,
    };
  },
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'line',
    },
    color: {
      type: [String, Object],
      default: '',
    },
    status: {
      type: String,
      default: 'uploading',
    },
    strokeWidth: {
      type: Number,
      default: 10,
    },
    showInfo: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 100,
    },
  },
  computed: {
    classes() {
      return [
        't-progress',
        `t-progress-${this.type}`,
      ];
    },
    lineStyles() {
      const style = {};
      style.width = `${this.percent}%`;
      style.height = `${this.strokeWidth}px`;
      if (typeof this.color === 'string') {
        if (this.color !== '') {
          style.backgroundColor = this.color;
        } else {
          switch (this.currentStatus) {
            case 'success':
              style.backgroundColor = '#4bcd1e';
              break;
            case 'exception':
              style.backgroundColor = '#f04b4b';
              break;
            default:
              style.backgroundColor = '#4385ff';
              break;
          }
        }
      } else if (typeof this.color === 'object') {
        const successColor = this.color.success ? this.color.success : '#4bcd1e';
        const exceptionColor = this.color.exception ? this.color.exception : '#f04b4b';
        const activeColor = this.color.active ? this.color.active : '#4385ff';
        switch (this.currentStatus) {
          case 'success':
            style.backgroundColor = successColor;
            break;
          case 'exception':
            style.backgroundColor = exceptionColor;
            break;
          default:
            style.backgroundColor = activeColor;
        }
      }
      return style;
    },
    dashArrayWidth() {
      // 计算周长
      const line = 2 * Math.PI * ((this.width / 2) - 10);
      const endS = line * (this.percent / 100);
      const endE = line * ((100 - this.percent) / 100);
      return {
        start: `0,${line}`,
        end: `${endS},${endE}`,
      };
    },
    circleColor() {
      let color = '#4385ff';
      if (typeof this.color === 'string') {
        if (this.color !== '') {
          color = this.color;
        } else {
          switch (this.currentStatus) {
            case 'success':
              color = '#4bcd1e';
              break;
            case 'exception':
              color = '#f04b4b';
              break;
            default:
              color = '#4385ff';
              break;
          }
        }
      } else if (typeof this.color === 'object') {
        const successColor = this.color.success ? this.color.success : '#4bcd1e';
        const exceptionColor = this.color.exception ? this.color.exception : '#f04b4b';
        const activeColor = this.color.active ? this.color.active : '#4385ff';
        switch (this.currentStatus) {
          case 'success':
            color = successColor;
            break;
          case 'exception':
            color = exceptionColor;
            break;
          default:
            color = activeColor;
        }
      }
      return color;
    },
  },
  watch: {
    percent(val) {
      if (parseInt(val, 10) === 100 && this.status === 'success') {
        this.currentStatus = 'success';
      }
    },
    status(val) {
      this.currentStatus = val;
    },
  },
  mounted() {
    this.currentStatus = parseInt(this.percent, 10) === 100 ? 'success' : this.status;
  },
};
</script>
<style lang="less">
    .t-progress {
        /*display: inline-block;*/
        position: relative;
        display: block;
        font-size: 14px;
        &-line-outer {
             display: inline-block;
             width: calc(100% - 60px);
        }
        &-circle {
            display: inline-block;
        }
        &-line-inner {
             display: inline-block;
             width: 100%;
             background-color: #f3f3f3;
             border-radius: 100px;
             vertical-align: middle;
             position: relative;
            &>div {
                border-radius: 100px;
                transition: width 1s ease;
            }
         }
        &-text {
            margin-left: 10px;
        }
    }
    .t-progress-circle .t-progress-text {
        position: absolute;
        width: 100%;
        margin-left: 0;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        text-align: center;
    }
</style>
