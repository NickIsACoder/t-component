<template>
  <div class="t-timepicker-wrapper" ref="timePicker">
    <transition name="transition-drop">
      <div
        class="t-time-panel t-popper">
        <div class="t-time-panel__title">{{placeholder}}</div>
        <div class="t-time-panel__content">
          <div class="t-time-spinner">
            <div class="t-time-spinner__wrapper t-scrollbar">
              <div class="t-scrollbar__wrap">
                <ul class="t-scrollbar__view t-time-spinner__list" ref='hoursList' >
                  <li class="t-time-spinner__item"
                    v-for="(disable,h) in hoursList"
                    @click="select('hour', h, $event)"
                    :key='h'
                    :style="hour === `0${h}`.slice(-2) && 'color:black;'"
                    v-if="!disable"
                    >{{`0${h}`.slice(-2)}}</li>
                </ul>
              </div>
            </div>
            <div class="t-time-spinner__wrapper t-scrollbar">
              <div class="t-scrollbar__wrap" >
                <ul class="t-scrollbar__view t-time-spinner__list" ref='minutesList'>
                  <li class="t-time-spinner__item"
                    v-for="(disable,m) in minutesList"
                    @click="select('minute', m, $event)"
                    :key="m"
                    v-if="disable"
                    :style="minute === `0${m}`.slice(-2) && 'color:black;'"
                    >{{`0${m}`.slice(-2)}}</li>
                </ul>
              </div>
            </div>
            <div class="t-time-spinner__wrapper t-scrollbar" v-if="showSeconds">
              <div class="t-scrollbar__wrap" >
                <ul class="t-scrollbar__view t-time-spinner__list" ref='secondsList'>
                  <li class="t-time-spinner__item"
                    v-for="(disable,s) in secondsList"
                    @click="select('second', s, $event)"
                    :key="s"
                    v-if="disable"
                    :style="second === `0${s}`.slice(-2) && 'color:black'"
                    >{{`0${s}`.slice(-2)}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="t-time-panel__footer">
          <button type="button" class="t-time-panel__btn nowTime"
          :style="range&&'opacity: 0;'"
          @click="getNowTime">此刻</button>
          <button type="button" class="t-time-panel__btn confirm"
          @click="confirmTime">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>

export default {
  name: 't-timePicker-panel',
  data() {
    return {
      hour: '',
      minute: '',
      second: '',
    };
  },
  props: {
    placeholder: { // 占位文本
      type: String,
      default: '请选择时间',
    },
    value: { // 默认选中值
      type: String,
      default: '',
    },
    range: { // 时间区间
      type: String,
      default: '',
    },
    showSeconds: { // 是否显示分
      type: Boolean,
      default: true,
    },
    show: { // picker是否显示
      type: Boolean,
      default: false,
    },
  },
  methods: {
    newArray(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    setRangeData(start, end, value) {
      const arr = [];
      for (let i = start; i < end; i++) {
        arr[i] = value;
      }
      return arr;
    },
    // 获取时
    getRangeHour(ranges) {
      // 初始数组
      const arr = this.newArray(0, 23);
      if (ranges) {
        const start = ranges.split('-')[0].split(':');
        const end = ranges.split('-')[1].split(':');
        const startR = start[0];
        const endR = end[0];
        // 保存可显示的数组
        const ableTime = this.newArray(parseInt(startR, 0), parseInt(endR, 0));
        if (ableTime.length > 0) {
          for (let i = 0; i < 24; i++) {
            arr[i] = ableTime.indexOf(i) === -1;
          }
        }
      } else {
        for (let i = 0; i < 24; i++) {
          arr[i] = false;
        }
      }
      return arr;
    },
    // 获取分
    getRangeMinutes(ranges, hour) {
      let minutes = [];
      if (ranges) {
        const start = ranges.split('-')[0].split(':');
        const end = ranges.split('-')[1].split(':');
        const startHour = start[0];
        const startMinute = start[1];
        const endHour = end[0];
        const endMinute = end[1];
        if (startHour === hour && endHour !== hour) {
          minutes = this.setRangeData(parseInt(startMinute, 0), 60, true);
        } else if (startHour === hour && endHour === hour) {
          minutes = this.setRangeData(parseInt(startMinute, 0), parseInt(endMinute, 0) + 1, true);
        } else if (startHour !== hour && endHour === hour) {
          minutes = this.setRangeData(0, parseInt(endMinute, 0) + 1, true);
        } else {
          minutes = this.setRangeData(0, 60, true);
        }
      } else {
        minutes = this.setRangeData(0, 60, true);
      }
      return minutes;
    },
    // 获取秒
    getRangeSeconds(ranges, hour, minute) {
      let seconds = [];
      if (this.showSeconds) {
        if (ranges) {
          const start = ranges.split('-')[0].split(':');
          const end = ranges.split('-')[1].split(':');
          const startH = start[0];
          const startM = start[1];
          const endH = end[0];
          const endM = end[1];
          const startS = start[2];
          const endS = end[2];
          if (startH === hour && endH !== hour) {
            if (startM === minute) {
              seconds = this.setRangeData(parseInt(startS, 0), 60, true);
            } else if (endM === minute) {
              seconds = this.setRangeData(0, parseInt(endS, 0) + 1, true);
            } else {
              seconds = this.setRangeData(0, 60, true);
            }
          } else if (startH === hour && endH === hour) {
            if (startM === minute && endM !== minute) {
              seconds = this.setRangeData(parseInt(startS, 0), 60, true);
            } else if (startM === minute && endM === minute) {
              seconds = this.setRangeData(parseInt(startS, 0), parseInt(endS, 0) + 1, true);
            } else if (startM !== minute && endM === minute) {
              seconds = this.setRangeData(0, parseInt(endS, 0) + 1, true);
            } else {
              seconds = this.setRangeData(0, 60, true);
            }
          } else if (startH !== hour && endH === hour) {
            if (endM === minute) {
              seconds = this.setRangeData(0, parseInt(endS, 0) + 1, true);
            } else {
              seconds = this.setRangeData(0, 60, true);
            }
          } else {
            seconds = this.setRangeData(0, 60, true);
          }
        } else {
          seconds = this.setRangeData(0, 60, true);
        }
      }
      return seconds;
    },
    // 回选
    readSelected() {
      // 获取当前显示dom数组
      const hourList = Array.from(this.$refs.hoursList.children);
      const minutesList = Array.from(this.$refs.minutesList.children);
      // 遍历
      for (let i = 0; i < hourList.length; i++) {
        if (hourList[i].innerHTML === this.hour) {
          this.$refs.hoursList.parentNode.scrollTop = `${this.$refs.hoursList.children[0].clientHeight * i}`;
        }
      }
      for (let j = 0; j < minutesList.length; j++) {
        if (minutesList[j].innerHTML === this.minute) {
          this.$refs.minutesList.parentNode.scrollTop = `${this.$refs.minutesList.children[0].clientHeight * j}`;
        }
      }
      if (this.showSeconds) {
        const secondsList = Array.from(this.$refs.secondsList.children);
        for (let k = 0; k < secondsList.length; k++) {
          if (secondsList[k].innerHTML === this.second) {
            this.$refs.secondsList.parentNode.scrollTop = `${this.$refs.secondsList.children[0].clientHeight * k}`;
          }
        }
      }
    },
    // 选中事件
    select(type, value, e) {
      // 判断时间类型,跳转到对应高度
      const target = e.target;
      if (type === 'hour') {
        const list = Array.from(this.$refs.hoursList.children);
        const liCount = list.indexOf(target);
        const liHeight = this.$refs.hoursList.children[0].clientHeight;
        this.$refs.hoursList.parentNode.scrollTop = `${liHeight * liCount}`;
        this.hour = `0${value}`.slice(-2);
      } else if (type === 'minute') {
        const list = Array.from(this.$refs.minutesList.children);
        const liHeight = this.$refs.minutesList.children[0].clientHeight;
        const liCount = list.indexOf(target);
        this.$refs.minutesList.parentNode.scrollTop = `${liHeight * liCount}`;
        this.minute = `0${value}`.slice(-2);
      } else if (type === 'second') {
        const list = Array.from(this.$refs.secondsList.children);
        const liHeight = this.$refs.secondsList.children[0].clientHeight;
        const liCount = list.indexOf(target);
        this.$refs.secondsList.parentNode.scrollTop = `${liHeight * liCount}`;
        this.second = `0${value}`.slice(-2);
      }
    },
    // 获取当前时间
    getNowTime() {
      // 判断当前时间是否在时间区间内
      if (!this.range) {
        const date = new Date();
        this.hour = `0${date.getHours()}`.slice(-2);
        this.minute = `0${date.getMinutes()}`.slice(-2);
        this.second = `0${date.getSeconds()}`.slice(-2);
        // 回选时间
        this.readSelected();
      }
    },
    // 确定时间
    confirmTime() {
      const { hour, minute, second } = this;
      this.$emit('changeTime', `${hour + minute + second}`);
    },

  },
  watch: {
    value(val) {
      if (val) {
        // 判断值是否超出range范围
        this.hour = val.substring(0, 2);
        this.minute = val.substring(2, 4);
        if (this.showSeconds) {
          this.second = val.substring(4, 6);
        }
      } else {
        this.hour = '';
        this.minute = '';
        this.second = '';
      }
    },
    show(val) {
      if (val) {
        if (this.value) {
          this.readSelected();
        } else {
          // 清空高度
          this.$refs.hoursList.parentNode.scrollTop = 0;
          this.$refs.minutesList.parentNode.scrollTop = 0;
          this.$refs.secondsList.parentNode.scrollTop = 0;
        }
      }
    },
    // 当三个值中其中一个有个值,其他值默认为0,当range存在时,则默认取最小值
    hour(val) {
      if (val) {
        if (this.range) {
          const startT = this.range.split('-')[0].split(':');
          const endT = this.range.split('-')[1].split(':');
          // 先赋值,在过滤
          if (this.minute) {
            this.minute = this.minute;
          } else if (this.hour === startT[0]) {
            this.minute = startT[1];
          } else {
            this.minute = '00';
          }
          if (this.second) {
            this.second = this.second;
          } else if (this.hour === startT[0] && this.minute === startT[1]) {
            this.second = startT[2];
          } else {
            this.second = '00';
          }
          this.$emit('input', val + this.minute + this.second);
          const newVal = new Date(2018, 3, 8, parseInt(val, 0),
            parseInt(this.minute, 0), parseInt(this.second, 0));
          const startVal = new Date(2018, 3, 8, parseInt(startT[0], 0),
            parseInt(startT[1], 0), parseInt(startT[2], 0));
          const endVal = new Date(2018, 3, 8, parseInt(endT[0], 0),
            parseInt(endT[1], 0), parseInt(endT[2], 0));
          if (newVal < startVal) {
            const value = startT.join('');
            this.$emit('input', value);
            this.hour = startT[0];
            this.minute = startT[1];
            this.second = startT[2];
          } else if (newVal > endVal) {
            const value = endT.join('');
            this.$emit('input', value);
            this.hour = endT[0];
            this.minute = endT[1];
            this.second = endT[2];
          }
        } else {
          this.minute = this.minute || '00';
          this.second = this.second || '00';
          const value = val + this.minute + this.second;
          this.$emit('input', value);
        }
      }
    },
    minute(val) {
      if (val) {
        if (this.range) {
          this.hour = this.hour || this.range.split('-')[0].split(':')[0];
          if (this.showSeconds) {
            this.second = this.second || this.range.split('-')[0].split(':')[2];
            const value = this.hour + val + this.second;
            this.$emit('input', value);
          } else {
            const value = this.hour + val;
            this.$emit('input', value);
          }
        } else {
          this.hour = this.hour || '00';
          if (this.showSeconds) {
            this.second = this.second || '00';
            const value = this.hour + val + this.second;
            this.$emit('input', value);
          } else {
            const value = this.hour + val;
            this.$emit('input', value);
          }
        }
      }
    },
    second(val) {
      if (val) {
        if (this.range) {
          if (this.hour) {
            this.hour = this.hour;
          } else if (this.hour === this.range.split('-')[0].split(':')[0]) {
            this.hour = this.range.split('-')[0].split(':')[0];
          } else {
            this.hour = '00';
          }
          if (this.minute) {
            this.minute = this.minute;
          } else if (this.hour === this.range.split('-')[0].split(':')[0]) {
            this.minute = this.range.split('-')[0].split(':')[1];
          } else {
            this.minute = '00';
          }

          const value = this.hour + this.minute + val;
          this.$emit('input', value);
        } else {
          this.hour = this.hour || '00';
          this.minute = this.minute || 0;
          const value = this.hour + this.minute + val;
          this.$emit('input', value);
        }
      }
    },
  },
  computed: {
    // 存放hour数组
    hoursList() {
      return this.getRangeHour(this.range);
    },
    // 存放minute数组
    minutesList() {
      return this.getRangeMinutes(this.range, this.hour);
    },
    // 存放second数组
    secondsList() {
      return this.getRangeSeconds(this.range, this.hour, this.minute);
    },
  },
  mounted() {
    // 转换成数字
    if (this.value) {
      this.hour = this.value.substring(0, 2);
      this.minute = this.value.substring(2, 4);
      if (this.showSeconds) {
        this.second = this.value.substring(4, 6);
      }
    } else {
      this.hour = '';
      this.minute = '';
      this.second = '';
    }
  },

};

</script>

<style lang="less" scoped>
@import "../assets/var.less";
.t-timepicker-wrapper{
   position: absolute;
   z-index: 9999;
}
.t-time-panel {
  margin: 5px 0;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 2px;
  width: 180px;
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
  -webkit-transition: opacity .12s ease-out;
  -moz-transition: opacity .12s ease-out;
  -ms-transition: opacity .12s ease-out;
  -o-transition: opacity .12s ease-out;
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
  -webkit-transition: opacity .12s ease-out;
  -moz-transition: opacity .12s ease-out;
  -ms-transition: opacity .12s ease-out;
  -o-transition: opacity .12s ease-out;
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
  // width: 3px;     /*高宽分别对应横竖滚动条的尺寸*/
  // height: 1px;
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
// .t-time-spinner__wrapper::-webkit-scrollbar {/*滚动条整体样式*/
//   width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
//   height: 1px;
//   // display:none;
// }
// .t-time-spinner__wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
//   border-radius: 2px;
//   width: 2px;
//   height: 1px;
//   background: #eeeeee;
// }
// .t-time-spinner__wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
//   background: #fff;
//   height: 1px;
//   width: 2px;
// }
</style>
