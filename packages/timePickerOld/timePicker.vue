<template>
  <div class="t-timepicker-wrapper" ref="timePicker">
    <input type="text"
      class="t-timepicker-input"
      v-model='selectTime'
      ref="input"
      @click="showPicker($event)"
      :style="showDrop&&'border-color: #409eff'"
      :placeholder="placeholder" readonly/>
    <span class="right-icon">
      <i class="iconfont icon-clock" v-if="value===''||!value"></i>
      <i class="iconfont icon-error" v-else @click.stop="handleclear"></i>
    </span>
    <transition name="transition-drop">
      <div
        class="t-time-panel t-popper"
        v-show="showDrop"
        style="z-index: 2096;position: absolute;">
        <div class="t-time-panel__title">{{placeholder}}</div>
        <div class="t-time-panel__content">
          <div class="t-time-spinner">
            <div class="t-time-spinner__wrapper t-scrollbar">
              <div class="t-scrollbar__wrap">
                <ul class="t-scrollbar__view t-time-spinner__list" ref='hoursList'>
                  <li class="t-time-spinner__item"
                    v-for="(h,hi) in hours"
                    @click="select('hour', h, hi)"
                    :key='hi'
                    :style="hour === h && 'color:black;'"
                    >{{h}}</li>
                </ul>
              </div>
            </div>
            <div class="t-time-spinner__wrapper t-scrollbar">
              <div class="t-scrollbar__wrap" >
                <ul class="t-scrollbar__view t-time-spinner__list" ref='minutesList'>
                  <li class="t-time-spinner__item"
                    v-for="(m,mi) in minutes"
                    @click="select('minute', m, mi)"
                    :key="mi"
                    :data-key='mi'
                    :style="minute === m && 'color:black;'">{{m}}</li>
                </ul>
              </div>
            </div>
            <div class="t-time-spinner__wrapper t-scrollbar" v-if="showSeconds">
              <div class="t-scrollbar__wrap" >
                <ul class="t-scrollbar__view t-time-spinner__list" ref='secondsList'>
                  <li class="t-time-spinner__item"
                    v-for="(s,si) in this.seconds"
                    @click="select('second', s, si)"
                    :key="si"
                    :style="second === s && 'color:black'"
                    >{{s}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="t-time-panel__footer">
          <button type="button" class="t-time-panel__btn nowTime"
          :style="(isPeriod&&range)&&'opacity: 0;'"
          @click="getNowTime">此刻</button>
          <button type="button" class="t-time-panel__btn confirm"
          @click="confirmTime">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import dimissMixin from '../utils/dimissMixin';

export default {
  name: 't-timePicker',
  mixins: [dimissMixin],
  data() {
    return {
      showDrop: false,
      hours: [],
      minutes: [],
      seconds: [],
      hourType: 'hh',
      minuteType: 'mm',
      secondType: 'ss',
      hour: '',
      minute: '',
      second: '',
      target: '',
      // startTime: [], // 开始时间(时间区间)
      // endTime: [], // 结束时间(时间区间)
    };
  },
  methods: {
    // 清空
    handleclear() {
      this.hour = '';
      this.minute = '';
      this.second = '';
      this.$emit('input', '');
      this.$emit('changeTime', '');
    },
    renderHoursList() {
      // 渲染时
      // 初始化列表
      this.hours = [];
      // 初始化"时"的起始点
      let hoursStart = 0;
      let hoursCount = 24;
      if (this.range) {
        hoursStart = parseInt(this.startRang[0], 10);
        hoursCount = parseInt(this.endRang[0], 10) + 1;
      }
      if (this.minTime) {
        hoursStart = parseInt(this.startRang[0], 10);
      }
      if (this.maxTime) {
        hoursCount = parseInt(this.endRang[0], 10) + 1;
      }
      for (let i = hoursStart; i < hoursCount; i++) {
        if (i < 10) {
          this.hours.push(`0${i.toString()}`);
        } else {
          this.hours.push(i.toString());
        }
      }
    },
    renderList(listType, numStart, numEnd) {
      if (listType === 'minute') {
        // 清空数组
        this.minutes = [];
      } else {
        // 清空数组
        this.seconds = [];
      }
      // 渲染分和秒
      for (let i = Number(numStart); i < Number(numEnd); i++) {
        if (listType === 'minute') {
          if (i < 10) {
            this.minutes.push(`0${i.toString()}`);
          } else {
            this.minutes.push(i.toString());
          }
        } else if (i < 10) {
          this.seconds.push(`0${i.toString()}`);
        } else {
          this.seconds.push(i.toString());
        }
      }
    },
    readSelected() {
      //   回显选中的时间
      // 遍历数组,找到对应的i
      for (let i = 0; i < this.hours.length; i++) {
        if (this.hours[i] === this.hour) {
          this.$refs.hoursList.parentNode.scrollTop = `${this.$refs.hoursList.firstChild.clientHeight * i}`;
        }
      }
      for (let j = 0; j < this.minutes.length; j++) {
        if (this.minutes[j] === this.minute) {
          this.$refs.minutesList.parentNode.scrollTop = `${this.$refs.minutesList.firstChild.clientHeight * j}`;
        }
      }
      if (this.showSeconds) {
        for (let k = 0; k < this.seconds.length; k++) {
          if (this.seconds[k] === this.second) {
            this.$refs.secondsList.parentNode.scrollTop = `${this.$refs.secondsList.firstChild.clientHeight * k}`;
          }
        }
      }
    },
    showPicker(e) {
      this.showDrop = !this.showDrop;
      this.target = e;
    },
    select(type, value, key) {
      // 判断时间类型,跳转到对应高度
      if (type === 'hour') {
        const liHeight = this.$refs.hoursList.firstChild.clientHeight;
        const liCount = key;
        this.$refs.hoursList.parentNode.scrollTop = `${liHeight * liCount}`;
        this.hour = value;
      } else if (type === 'minute') {
        const liHeight = this.$refs.minutesList.firstChild.clientHeight;
        const liCount = key;
        this.$refs.minutesList.parentNode.scrollTop = `${liHeight * liCount}`;
        this.minute = value;
      } else if (type === 'second') {
        const liHeight = this.$refs.secondsList.firstChild.clientHeight;
        const liCount = key;
        this.$refs.secondsList.parentNode.scrollTop = `${liHeight * liCount}`;
        this.second = value;
      }
    },
    getNowTime() {
      // 判断当前时间是否在时间区间内
      if (!this.isPeriod && !this.range) {
        const date = new Date();
        this.hour = date.getHours() >= 10 ? date.getHours().toString() : `0${date.getHours().toString()}`;
        this.minute = date.getMinutes() >= 10 ? date.getMinutes().toString() : `0${date.getMinutes().toString()}`;
        this.second = date.getSeconds() >= 10 ? date.getSeconds().toString() : `0${date.getSeconds().toString()}`;
        // 回选时间
        this.readSelected();
      }
    },
    confirmTime() {
      // 时间改变的方法
      this.showDrop = false;
      if (this.showSeconds) {
        this.$emit('changeTime', `${this.hour + this.minute + this.second}`);
      } else {
        this.$emit('changeTime', `${this.hour + this.minute}`);
      }
      this.$emit('input', this.selectTime);
    },
    resetRender() {
      let startHour;
      let endHour;
      let startMinute;
      let endMinute;
      let startSecond;
      let endSecond;
      if (this.range) {
        startHour = this.startRang[0];
        endHour = this.endRang[0];
        startMinute = this.startRang[1];
        endMinute = this.endRang[1];
        if (this.showSeconds) {
          startSecond = this.startRang[2];
          endSecond = this.endRang[2];
        }
      } else if (this.minTime) {
        startHour = this.startRang[0];
        endHour = '24';
        startMinute = this.startRang[1];
        endMinute = '60';
        if (this.showSeconds) {
          startSecond = this.startRang[2];
          endSecond = '60';
        }
      } else if (this.maxTime) {
        endHour = this.endRang[0];
        startHour = '00';
        endMinute = this.endRang[1];
        startMinute = '00';
        if (this.showSeconds) {
          endSecond = this.endRang[2];
          startSecond = '00';
        }
      }
      // 1.当区间'时'为一个值时
      // 分的范围为 第一个'区间分'-最后一个'区间分'
      // 1.1 当第一个'分'小于最后一个分时,第一个'秒'大于最后一个秒,则....第一个'秒'小于最后一个秒
      // 2.当区间'时'有多个值时
      // 当"时"为区间'时'第一个值时,判断区间'分',分的范围为 '区间分'-60
      // 当'时'为区间'时'最后一个值时,判断区间'分',分的范围为 00-'区间分'
      if (startHour === endHour) { // 同一个小时的情况
        this.hour = startHour;
        if (startMinute < endMinute) {
          this.minutes = [];
          // /* 当选中时间(22)大于区间时间(21)时,就为选中时间否则为区间时间*/
          this.minute = this.minute > startMinute ? this.minute : startMinute;
          this.renderList('minute', startMinute, (Number(endMinute) + 1).toString());
          if (this.showSeconds) {
            if (startSecond < endSecond) {
              this.seconds = [];
              this.second = this.second > startSecond ? this.second : startSecond;
              this.renderList('second', startSecond, (Number(endSecond) + 1).toString());
            }
          }
        } else {
          // console.log('请绑定正确的时间区间');
        }
      } else if (startHour <= endHour) {
        if (this.hour === startHour) {
          this.minutes = [];
          this.minute = this.minute > startMinute ? this.minute : startMinute;
          this.renderList('minute', startMinute, '60');
          for (let j = 0; j < this.minutes.length; j++) {
            if (this.minutes[j] === this.minute) {
              this.$refs.minutesList.parentNode.scrollTop = `${this.$refs.minutesList.firstChild.clientHeight * j}`;
            }
          }
          if (this.showSeconds) {
            this.seconds = [];
            this.second = this.second > startSecond ? this.second : startSecond;
            this.renderList('second', startSecond, '60');
          }
        } else if (this.hour === endHour) {
          this.minutes = [];
          this.minute = this.minute < endMinute ? this.minute : '00';
          this.renderList('minute', '00', (Number(endMinute) + 1).toString());
          for (let j = 0; j < this.minutes.length; j++) {
            if (this.minutes[j] === this.minute) {
              this.$refs.minutesList.parentNode.scrollTop = `${this.$refs.minutesList.firstChild.clientHeight * j}`;
            }
          }
          if (this.showSeconds) {
            this.seconds = [];
            this.renderList('second', '00', (Number(endSecond) + 1).toString());
          }
        } else {
          if (this.hour < startHour) { // 超出范围要重置到范围内
            this.hour = startHour;
          } else if (this.hour > endHour) {
            this.hour = endHour;
          }
          this.minutes = [];
          this.renderList('minute', '0', '60');
          if (this.showSeconds) {
            this.seconds = [];
            this.renderList('second', '0', '60');
          }
        }
      }
    },
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择时间',
    },
    value: {
      type: String,
      default: '',
    },
    isPeriod: {
      type: Boolean,
      default: false,
    },
    range: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'hh:mm:ss',
    },
    minTime: {
      type: String,
      default: '',
    },
    maxTime: {
      type: String,
      default: '',
    },
  },
  computed: {
    showSeconds() {
      return (this.format || '').indexOf('ss') !== -1;
    },
    selectTime() {
      // if (this.value) this.readValue();
      // 监听选中的时间
      if (this.hour || this.minute || this.second) {
        let formatString = String((this.format));
        if (this.hour) {
          formatString = formatString.replace(new RegExp(this.hourType, 'g'), this.hour);
        }
        if (this.minute) {
          formatString = formatString.replace(new RegExp(this.minuteType, 'g'), this.minute);
        }
        if (this.second && this.secondType) {
          formatString = formatString.replace(new RegExp(this.secondType, 'g'), this.second);
        }
        return formatString;
      }
      return '';
    },
    spliter() {
      if (this.format === 'hh:mm:ss') return ':';
      let fstr = this.format;
      fstr = fstr.replace('hh', '');
      fstr = fstr.replace('mm', '');
      fstr = fstr.replace('ss', '');
      return fstr.charAt(1);
    },
    startRang() {
      if (this.minTime) {
        return this.minTime.split(':');
      } else if (this.range) {
        return this.range.split('-')[0].split(this.spliter);
      }
      return [];
    },
    endRang() {
      if (this.maxTime) {
        return this.maxTime.split(':');
      } else if (this.range) {
        return this.range.split('-')[1].split(this.spliter);
      }
      return [];
    },
  },
  watch: {
    target() {
      this.setDimiss('click', this.$refs.timePicker, 'other', () => {
        this.showDrop = false;
        if (this.showSeconds) {
          this.$emit('changeTime', `${this.hour + this.minute + this.second}`);
        } else {
          this.$emit('changeTime', `${this.hour + this.minute}`);
        }
        this.$emit('input', this.selectTime);
      });
    },
    // showDrop(val) {
    //   // 监听选择器的状态
    //   if (!val && (this.hour || this.minute || this.second)) {
    //     if (this.showSeconds) {
    //       this.$emit('changeTime', `${this.hour + this.minute + this.second}`);
    //     } else {
    //       this.$emit('changeTime', `${this.hour + this.minute}`);
    //     }
    //   }
    // },
    hour(val) {
      // 初始化'分
      if (!val) {
        this.minute = '';
        this.second = '';
      } else {
        this.minute = this.minute || '00';
        if (this.showSeconds) this.second = this.second || '00';
        if (this.range || this.minTime || this.maxTime) {
          this.resetRender();
        }
      }
    },
    minute(val) {
      if (!val) {
        this.hour = '';
        this.second = '';
      } else {
        this.hour = this.hour || '00';
        if (this.showSeconds) this.second = this.second || '00';
      }
    },
    second(val) {
      if (!val) {
        this.hour = '';
        this.minute = '';
      } else {
        this.hour = this.hour || '00';
        this.minute = this.minute || '00';
      }
    },
    range(val) {
      if (val) {
        this.resetRender();
        this.renderHoursList();
      }
    },
    minTime(val) {
      if (val) {
        this.renderHoursList();
        this.renderList('minute', this.startRang[1], '60');
        this.renderList('second', this.startRang[2], '60');
      }
    },
    maxTime(val) {
      if (val) {
        this.renderHoursList();
        this.renderList('minute', this.endRang[1], '60');
        this.renderList('second', this.endRang[2], '60');
      }
    },
    value(val) {
      this.hour = val.split(this.spliter)[0] || '';
      this.minute = val.split(this.spliter)[1] || '';
      this.second = val.split(this.spliter)[2] || '';
    },
  },
  created() {
    if (this.value) {
      this.hour = this.value.split(this.spliter)[0];
      this.minute = this.value.split(this.spliter)[1] || '';
      this.second = this.value.split(this.spliter)[2] || '';
    }
  },
  mounted() {
    this.renderHoursList();
    this.renderList('minute', '0', '60');
    this.renderList('seconds', '0', '60');
    // if (this.value && this.range) {
    //   this.$nextTick(() => {
    //     this.resetRender();
    //   });
    // }
  },
  updated() {
    this.$nextTick(() => {
      if (this.value) this.readSelected();
    });
  },

};

</script>

<style lang="less" scoped>
@import "../assets/var.less";
  .t-timepicker-wrapper {
    position: relative;
    display: inline-block;
    .t-timepicker-input {
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: 14px;
      height: 32px;
      line-height: 1.5;
      outline: none;
      padding: 0 10px;
      -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 100%;
    }
    .right-icon i {
      color: rgb(128, 134, 149);
      font-size: 16px;
      width: 32px;
      height: 100%;
      text-align: center;
      position: absolute;
      top: 0;
      z-index: 1;
      left: auto;
      right: 0;
      line-height: 32px;
    }
  }
.t-time-panel {
  margin: 5px 0;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 2px;
  position: absolute;
  width: 180px;
  left: 0;
  z-index: 1000;
  user-select: none;
}
.t-time-panel__title{
  padding:10px;
  color:#7e7e7e;
  border-bottom: 1px solid #eeeeee;
}
.t-time-panel__content {
  font-size: 0;
  position: relative;
  overflow: hidden;
}
/* .t-time-panel__content.has-seconds:before {
    padding-left: 33.33333%;
} */


/* .t-time-panel__content:before {
    padding-left: 50%;
    margin-right: 12%;
    margin-left: 12%;
} */

/* .t-time-panel__content:after, .t-time-panel__content:before {
    content: "";
    top: 50%;
    position: absolute;
    margin-top: -15px;
    height: 32px;
    z-index: -1;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding-top: 6px;
    text-align: left;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
} */
.t-time-spinner {
  width: 100%;
  white-space: nowrap;
  display: flex;
}
.t-time-spinner.has-seconds .t-time-spinner__wrapper {
  // width: 33.3%;
  flex: 1 1 0%;
  -webkit-box-flex: 1;
}


.t-scrollbar {
  overflow: hidden;
  position: relative;
}

.t-time-spinner__wrapper {
  max-height: 190px;
  overflow: auto;
  display: inline-block;
  width: 50%;
  vertical-align: top;
  position: relative;
}
.t-time-spinner__wrapper .t-scrollbar__wrap:not(.t-scrollbar__wrap--hidden-default) {
    // padding-bottom: 15px;
}

.t-scrollbar__wrap {
  overflow: scroll;
  height: 100%;
  // width: 59px;
}
.t-time-spinner__list {
  margin: 0;
  list-style: none;
  // width: 59px;
}

.t-time-spinner__input.t-input .t-input__inner, .t-time-spinner__list {
  padding: 0;
  text-align: center;
}
 .t-time-spinner__list:after{
  content: "";
  display: block;
  width: 100%;
  height: 160px;
}
.t-time-spinner__item {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: #7e7e7e;
  // width: 59px;
}
.t-time-spinner__item:hover{
  background: #e4e4e4;
}
/* .t-time-spinner__list:after, .t-time-spinner__list:before {
    content: "";
    display: block;
    width: 100%;
    height: 80px;
} */
.t-scrollbar__bar.is-horizontal {
  height: 6px;
  left: 2px;
}

.t-scrollbar__bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  transition: opacity .12s ease-out;
}
.t-scrollbar__bar.is-vertical {
  width: 6px;
  top: 2px;
}

.t-scrollbar__bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  transition: opacity .12s ease-out;
}
/* .t-time-panel__content.has-seconds:after {
    left: 66.66667%;
} */


 /* .t-time-panel__content:after {
    left: 50%;
    margin-left: 12%;
    margin-right: 12%;
} */

/* .t-time-panel__content:after, .t-time-panel__content:before {
    content: "";
    top: 50%;
    position: absolute;
    margin-top: -15px;
    height: 32px;
    z-index: -1;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding-top: 6px;
    text-align: left;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
} */
.t-time-panel__content.has-seconds:before {
  padding-left: 33.33333%;
}
.t-time-panel__content.has-seconds:after {
  left: 66.66667%;
}
.t-time-panel__footer {
  border-top: 1px solid #e4e4e4;
  padding: 4px;
  height: 36px;
  line-height: 25px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.t-time-panel__btn {
  border: none;
  line-height: 28px;
  padding: 0 8px;
  margin: 0 5px;
  cursor: pointer;
  background-color: transparent;
  outline: none;
  font-size: 12px;
}
.t-time-panel__btn.nowTime {
  color: @normal-color;
}
.t-time-panel__btn.confirm {
  font-weight: 800;
  background: @normal-color;
  color: #fff;
  border-radius: 2px;
}

.t-scrollbar__wrap::-webkit-scrollbar {/*滚动条整体样式*/
  width: 3px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  display:none;
}
.t-scrollbar__wrap::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 2px;
  width: 3px;
  height: 1px;
  background: #eeeeee;
}
.t-scrollbar__wrap::-webkit-scrollbar-track {/*滚动条里面轨道*/
  background: #fff;
  width: 3px;
  height: 1px;
}
.t-time-spinner__wrapper::-webkit-scrollbar {/*滚动条整体样式*/
  width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  // display:none;
}
.t-time-spinner__wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 2px;
  width: 2px;
  height: 1px;
  background: #eeeeee;
}
.t-time-spinner__wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
  background: #fff;
  height: 1px;
  width: 2px;
}
</style>
