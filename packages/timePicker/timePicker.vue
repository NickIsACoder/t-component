<template>
  <div>
    <!-- 开始picker和结束picker -->
    <div v-if="getIsPeriod">
      <div class="t-timepicker-wrapper" ref="startPicker">
        <t-input type="text"
          style="width: 100%"
          :placeholder="rangePlaceholder[0]"
          v-model="displayStartR"
          readonly
          @click.native="showStartDropdown">
          <i class="iconfont icon-clock" v-if="resetStart" slot="rightIcon"></i>
          <i class="iconfont icon-error"
            style="color: #808695;"
            v-else
            slot="rightIcon"
            @click.stop="clearValue('startR')"></i>
        </t-input>
        <time-panel
          :show="showStartDrop"
          v-show="showStartDrop"
          :placeholder="rangePlaceholder[0]"
          :value="rangeValue[0]"
          @input="getStartVal"
          :range="getStartRange"
          :showSeconds="showSeconds"
          @changeTime="handleStartChange">
        </time-panel>
      </div>
      {{rangeSeparator}}
      <div class="t-timepicker-wrapper" ref="endPicker">
        <t-input type="text"
          style="width: 100%"
          :placeholder="rangePlaceholder[1]"
          v-model="displayEndR"
          readonly
          @click.native="showEndDropdown">
          <i class="iconfont icon-clock" v-if="resetEnd" slot="rightIcon"></i>
          <i class="iconfont icon-error"
            style="color: #808695;"
            v-else
            slot="rightIcon"
            @click.stop="clearValue('endR')"></i>
        </t-input>
        <time-panel
          :show="showEndDrop"
          v-show="showEndDrop"
          :placeholder="rangePlaceholder[1]"
          :range="getEndRange"
          :value="rangeValue[1]"
          @input="getEndVal"
          :showSeconds="showSeconds"
          @changeTime="handleEndChange">
        </time-panel>
      </div>
    </div>
    <!-- 单picker -->
    <div class="t-timepicker-wrapper" ref="timePicker" v-else>
      <t-input
        type="text"
        style="width: 100%"
        :placeholder="placeholder"
        v-model="displayValue"
        readonly
        @click.native="showDropdown">
        <i class="iconfont icon-clock" v-if="resetSelect" slot="rightIcon"></i>
        <i class="iconfont icon-error"
          style="color: #808695;"
          v-else
          slot="rightIcon"
          @click.stop="clearValue"></i>
      </t-input>
      <time-panel
        :show="showDrop"
        v-show="showDrop"
        :placeholder="placeholder"
        :value=currentValue
        @input="getTimetVal"
        :range="getRange"
        :showSeconds="showSeconds"
        @changeTime="handleTimeChange">
      </time-panel>
    </div>
  </div>
</template>
<script>
import dimissMixin from '../utils/dimissMixin';
import timePanel from './time-panel';

export default {
  name: 't-timePicker',
  mixins: [dimissMixin],
  data() {
    return {
      showDrop: false,
      showStartDrop: false,
      showEndDrop: false,
      currentValue: '',
      displayValue: '',
      rangeValue: [],
      displayStartR: '',
      displayEndR: '',
    };
  },
  components: {
    'time-panel': timePanel,
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
    rangeSeparator: {
      type: String,
      default: '-',
    },
    rangePlaceholder: {
      type: Array,
      default: () => ['开始时间', '结束时间'],
    },
  },
  methods: {
    // 显示picker
    showDropdown() {
      this.showDrop = !this.showDrop;
      if (this.showDrop) {
        // 当下拉框打开时，点击非本组件区域的时候，自动关闭下拉框
        this.setDimiss('click', this.$refs.timePicker, 'other', () => {
          this.showDrop = false;
          if (this.showSeconds) {
            this.$emit('change', this.currentValue);
          } else {
            this.$emit('change', this.currentValue.substring(0, 4));
          }
          this.cancelDimiss();
        });
      }
    },
    // 显示startpicker
    showStartDropdown() {
      this.showStartDrop = !this.showStartDrop;
      if (this.showStartDrop) {
        // 当下拉框打开时，点击非本组件区域的时候，自动关闭下拉框
        this.setDimiss('click', this.$refs.startPicker, 'other', () => {
          this.showStartDrop = false;
          if (this.showSeconds) {
            this.$emit('change', this.rangeValue);
          } else {
            const rangeArr = [this.rangeValue[0].substring(0, 4),
              this.rangeValue[1].substring(0, 4)];
            this.$emit('change', rangeArr);
          }
          this.cancelDimiss();
        });
      }
    },
    // 显示endpicker
    showEndDropdown() {
      this.showEndDrop = !this.showEndDrop;
      if (this.showEndDrop) {
        // 当下拉框打开时，点击非本组件区域的时候，自动关闭下拉框
        this.setDimiss('click', this.$refs.endPicker, 'other', () => {
          this.showEndDrop = false;
          if (this.showSeconds) {
            this.$emit('change', this.rangeValue);
          } else {
            const rangeArr = [this.rangeValue[0].substring(0, 4),
              this.rangeValue[1].substring(0, 4)];
            this.$emit('change', rangeArr);
          }
          this.cancelDimiss();
        });
      }
    },
    // 获取格式
    spliter() {
      const formatWord = this.format.match(/((?=[\x21-\x7e]+)[^A-Za-z0-9])/);
      return (formatWord.length === 2 && formatWord[0] === formatWord[1]) && formatWord[0];
    },
    // 转换格式
    formatValue(type, val) {
      let value;
      if (this.showSeconds) {
        value = val.slice(0, 2) + this.spliter()
        + val.slice(2, 4)
        + this.spliter() + val.slice(4, 6);
      } else {
        value = val.slice(0, 2) + this.spliter()
        + val.slice(2, 4);
      }
      switch (type) {
        case 'startR':
          this.displayStartR = value;
          this.rangeValue[0] = val;
          break;
        case 'endR':
          this.displayEndR = value;
          this.rangeValue[1] = val;
          break;
        default:
          this.currentValue = val;
          this.displayValue = value;
      }
    },
    // 判断初始值有效性
    judgeValue(value) {
      if (value.length === 8) {
        const valueArr = value.split(':');
        if ((valueArr[0] < 24 && valueArr[0] >= 0)
         && (valueArr[1] < 60 && valueArr[1] >= 0)
         && (valueArr[2] < 60 && valueArr[1] >= 0)) {
          return valueArr;
        }
      } else if (value.length === 6) {
        const valueArr = this.value.split(':');
        if ((valueArr[0] < 24 && valueArr[0] >= 0)
         && (valueArr[1] < 60 && valueArr[1] >= 0)) {
          return valueArr;
        }
      }
      return [];
    },
    // 获取初始值
    getValue(value) {
      // value值需要過濾
      if (this.isPeriod && value.indexOf('-') === 0 && value.length === 17) {
        const startV = this.judgeValue(value.split('-')[0]).join('');
        const endV = this.judgeValue(value.split('-')[1]).join('');
        this.rangeValue = [startV, endV];
        this.displayStartR = this.judgeValue(value.split('-')[0]).join(this.spliter());
        this.displayEndR = this.judgeValue(value.split('-')[1]).join(this.spliter());
      } else {
        this.currentValue = this.judgeValue(value).join('');
        this.displayValue = this.judgeValue(value).join(this.spliter());
      }
      return '';
    },
    getStartVal(val) {
      this.formatValue('startR', val);
    },
    getEndVal(val) {
      this.formatValue('endR', val);
    },
    getTimetVal(val) {
      this.formatValue('time', val);
    },
    clearValue(type) {
      switch (type) {
        case 'startR':
          this.displayStartR = '';
          this.rangeValue[0] = '';
          this.showStartDrop = false;
          this.$emit('change', this.rangeValue);
          break;
        case 'endR':
          this.displayEndR = '';
          this.rangeValue[1] = '';
          this.showEndDrop = false;
          this.$emit('change', this.rangeValue);
          break;
        default:
          this.currentValue = '';
          this.displayValue = '';
          this.showDrop = false;
          this.$emit('change', '');
      }
    },
    handleChange(type, val) {
      this.showDrop = false;
      this.$emit('change', val);
      switch (type) {
        case 'startR':
          this.showStartDrop = false;
          this.$emit('change', this.rangeValue);
          break;
        case 'endR':
          this.showEndDrop = false;
          this.$emit('change', this.rangeValue);
          break;
        default:
          this.showDrop = false;
          this.$emit('change', this.currentValue);
      }
    },
    handleStartChange(val) {
      this.handleChange('startR', val);
    },
    handleEndChange(val) {
      this.handleChange('endR', val);
    },
    handleTimeChange(val) {
      this.handleChange('time', val);
    },
  },
  computed: {
    resetSelect() {
      return this.currentValue === '';
    },
    resetStart() {
      return this.displayStartR === '';
    },
    resetEnd() {
      return this.displayEndR === '';
    },
    showSeconds() {
      // 判断是否显示分
      return /[sS]/.test(this.format);
    },
    getIsPeriod() {
      return this.isPeriod;
    },
    getRange() {
      return this.range.length === 17 ? this.range : '';
    },
    getStartRange() {
      if (this.range) {
        if (this.displayEndR) {
          const startRange = this.range.split('-');
          startRange[1] = this.displayEndR.replace(this.spliter(), ':').replace(this.spliter(), ':');
          return startRange.join('-');
        }
        return this.range;
      } else if (this.displayEndR) {
        const startRange = ['00:00:00', this.displayEndR.replace(this.spliter(), ':')];
        return startRange.join('-');
      } return '';
    },
    getEndRange() {
      if (this.range) {
        if (this.displayStartR) {
          const endRange = this.range.split('-');
          endRange[0] = this.displayStartR.replace(this.spliter(), ':').replace(this.spliter(), ':');
          return endRange.join('-');
        }
        return this.range;
      } else if (this.displayStartR) {
        const endRange = [this.displayStartR.replace(this.spliter(), ':'), '23:59:59'];
        return endRange.join('-');
      } return '';
    },


  },
  mounted() {
    if (this.value) {
      this.getValue(this.value);
    }
  },

};

</script>

<style lang="less" scoped>
@import "../assets/var.less";
  .t-timepicker-wrapper {
    display: inline-block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
