<template>
    <div class="t-datepicker" ref="date">
        <div v-if="type === 'dateRange'" >
            <div :class="['t-datepicker-header', {'is-active': showDrop}] "  @click="showDropdown">
                <input type="text"
                       :placeholder="rangePlaceholder[0]"
                       :value="rangeDisplay[0]" readonly>
                至
                <input type="text"
                       :placeholder="rangePlaceholder[1]"
                       :value="rangeDisplay[1]" readonly>
                <span class="iconfont icon-error"
                      v-show="rangeDisplay[0]"
                      @click.stop="clearValue"></span>
            </div>
            <date-range v-if="showDrop"
                        :disabledDate="disabledDate"
                        :format="valueFormat"
                        :value.sync="rangeValue"
                        @picker="datePicker">
            </date-range>
        </div>
        <div v-else>
            <t-input type="text"
                     style="width: 100%"
                     :placeholder="placeholder"
                     @input="value => userInput = value"
                     @enter="resetValue"
                     @change="changeValue"
                     @blur="resetValue"
                     :value="displayValue"
                     ref="reference"
                     @click.native="showDropdown">
                <i class="iconfont icon-calendar" v-if="resetSelect" slot="rightIcon"></i>
                <i class="iconfont icon-error"
                   style="color: #808695;"
                   v-else
                   slot="rightIcon"
                   @click.stop="clearValue"></i>
            </t-input>
            <date-panel :value="currentValue"
                        :date.sync="date"
                        :type="type"
                        :format="valueFormat"
                        :disabledDate="disabledDate"
                        @picker="datePicker"
                        :show="showDrop"></date-panel>
        </div>
    </div>
</template>
<script>
import datePanel from './date-panel';
import dateRange from './date-range';
import tInput from '../input/input';
import dimissMixin from '../utils/dimissMixin';
import { formatData, parseDate } from './index';

const defaultFormat = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy',
};
export default {
  name: 't-datepicker',
  data() {
    return {
      currentValue: '',
      showDrop: false,
      rangeValue: [],
      date: new Date(),
      userInput: this.currentValue,
    };
  },
  mixins: [dimissMixin],
  components: { datePanel, dateRange, tInput },
  props: {
    value: {},
    type: {
      type: String,
      default: 'date',
    },
    format: {
      type: String,
    },
    disabledDate: {},
    placeholder: {
      type: String,
      default: '选择日期',
    },
    rangePlaceholder: {
      type: Array,
      default: () => ['开始时间', '结束时间'],
    },
  },
  computed: {
    resetSelect() {
      return this.currentValue === '';
    },
    valueFormat() {
      if (this.type === 'year') {
        return this.format || defaultFormat.year;
      } else if (this.type === 'month') {
        return this.format || defaultFormat.month;
      }
      return this.format || defaultFormat.date;
    },
    rangeDisplay() {
      const arr = this.value.split(',');
      if (arr[0] && arr[1]) {
        return arr;
      }
      return ['', ''];
    },
    displayValue() {
      if (this.userInput !== null) {
        return this.userInput;
      }
      return '';
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (this.type === 'dateRange') {
          if (val) {
            const arr = val.split(',');
            if (this.isDate(arr[0]) && this.isDate(arr[1])) {
              this.rangeValue[0] = parseDate(arr[0], this.valueFormat);
              this.rangeValue[1] = parseDate(arr[1], this.valueFormat);
            }
          } else {
            this.rangeValue = [];
          }
        } else {
          this.currentValue = val;
          this.date = this.currentValue ?
            parseDate(this.currentValue, this.valueFormat) : new Date();
          this.userInput = this.currentValue;
        }
      },
    },
  },
  methods: {
    // 判断日期是否合法有效
    isDate(date) {
      if (date === null || date === undefined || date === '') return false;
      if (isNaN(new Date(date).getTime()) ||
        (typeof date === 'object' && isNaN(date.getTime()))) return false;
      if (Array.isArray(date)) return false;
      return true;
    },
    showDropdown() {
      this.showDrop = !this.showDrop;
      if (this.showDrop) {
        // 当下拉框打开时，点击非本组件区域的时候，自动关闭下拉框
        this.setDimiss('click', this.$refs.date, 'other', () => {
          this.userInput = null;
          this.showDrop = false;
          if (this.type !== 'dateRange') {
            this.date = this.currentValue ?
              parseDate(this.currentValue, this.valueFormat) : new Date();
            const value = this.currentValue;
            this.userInput = value;
            this.$emit('input', value);
          } else {
            this.rangeValueEmit();
          }
          this.cancelDimiss();
        });
      }
    },
    rangeValueEmit() {
      if (this.rangeValue[0] && this.rangeValue[1]) {
        const left = formatData(this.rangeValue[0], this.valueFormat);
        const right = formatData(this.rangeValue[1], this.valueFormat);
        const value = `${left},${right}`;
        this.$emit('input', value);
        this.$emit('change', value);
      } else if (this.rangeValue[0] && !this.rangeValue[1]) {
        this.rangeValue[1] = this.rangeValue[0];
        const left = formatData(this.rangeValue[0], this.valueFormat);
        const value = `${left},${left}`;
        this.$emit('input', value);
        this.$emit('change', value);
      } else if (this.rangeValue[1] && !this.rangeValue[0]) {
        this.rangeValue[0] = this.rangeValue[1];
        const right = formatData(this.rangeValue[1], this.valueFormat);
        const value = `${right},${right}`;
        this.$emit('input', value);
        this.$emit('change', value);
      }
    },
    datePicker(val) {
      if (this.type !== 'dateRange') {
        this.currentValue = val.toString();
        this.date = parseDate(val, this.valueFormat);
        this.showDrop = false;
        const value = formatData(this.date, this.valueFormat);
        this.$emit('input', value);
        this.$emit('change', value);
      }
      if (this.type === 'dateRange' && val[0] && val[1]) {
        this.rangeValueEmit();
        this.showDrop = false;
      }
    },
    clearValue() {
      if (this.type === 'dateRange') {
        this.rangeValue = [];
      } else {
        this.currentValue = '';
        this.userInput = '';
      }
      this.$emit('input', '');
      this.$emit('change', '');
    },
    resetValue() {
      if (this.userInput) {
        const inputValue = this.userInput;
        this.userInput = null;
        const date = parseDate(inputValue, this.valueFormat);
        if (!this.isDate(date) || (this.disabledDate && this.disabledDate(date))) {
          this.userInput = this.currentValue;
        } else {
          this.date = date;
          this.userInput = formatData(date, this.valueFormat);
        }
        this.$emit('input', this.userInput);
      }
    },
    changeValue() {
      this.$emit('change', this.userInput);
    },
  },
  mounted() {
    if (this.type === 'dateRange') {
      const arr = this.value.split(',');
      if (this.isDate(arr[0]) && this.isDate(arr[1])) {
        this.rangeValue[0] = parseDate(arr[0], this.valueFormat);
        this.rangeValue[1] = parseDate(arr[1], this.valueFormat);
      }
    } else {
      this.currentValue = this.isDate(this.value) ? this.value : '';
      this.date = this.currentValue ?
        parseDate(this.currentValue, this.valueFormat) : new Date();
      this.userInput = this.currentValue;
    }
  },
};
</script>
<style lang="less" scoped>
    .t-datepicker {
      display: inline-block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
        &-header {
             border: 1px solid #dcdcdc;
             -webkit-border-radius: 3px;
             -moz-border-radius: 3px;
             border-radius: 3px;
             position: relative;
             cursor: pointer;
             width: 100%;
             &.is-active, &:hover {
                  border-color: #4385ff;
              }
            & input {
                     width: 40%;
                     text-align: center;
                     line-height: 30px;
                     border: none;
                      cursor: pointer;
                      font-size: 14px;
                     outline: none;
                 }
            &> span {
                   position: absolute;
                   right: 10px;
                   top: 7px;
                   cursor: pointer;
                   color: #ccc;
              }
         }
    }
</style>
