<template>
    <transition name="transition-drop">
        <div class="t-datepicker-content">
            <div class="t-datepicker-content-panel is-left">
                <div class="t-datepicker-content-panel-header">
                    <button class="t-datepicker-content-panel-header__icon-btn
                               t-datepicker-content-panel-header__left-btn"
                            @click="prevLeftYear">
                        <i class="iconfont icon-left-fill"></i>
                    </button>
                    <button class="t-datepicker-content-panel-header__icon-btn
                         t-datepicker-content-panel-header__left-btn"
                            @click="prevLeftMonth">
                        <i class="iconfont icon-left-line"></i>
                    </button>
                    <span class="t-datepicker-content-panel-header__text">
                        {{leftDate.getFullYear()}}年
                    </span>
                    <span class="t-datepicker-content-panel-header__text">
                        {{leftDate.getMonth()+1}}月
                    </span>
                    <button class="t-datepicker-content-panel-header__icon-btn
                        t-datepicker-content-panel-header__right-btn"
                            @click="nextLeftYear" v-show="isPrevYearDis">
                        <i class="iconfont icon-right-fill"></i>
                    </button>
                    <button class="t-datepicker-content-panel-header__icon-btn
                        t-datepicker-content-panel-header__right-btn"
                            v-show="isMonthDis"
                            @click="nextLeftMonth">
                        <i class="iconfont icon-right-line"></i>
                    </button>
                </div>
                <div class="t-datepicker-content-panel-content">
                    <date-table :date="leftDate"
                                @picker="handlerPicker"
                                :minDate="minDate"
                                :disabledDate="disabledDate"
                                :maxDate="maxDate"
                                :value="leftValue"
                                :defaultValue="new Date()"></date-table>
                </div>
            </div>
            <div class="t-datepicker-content-panel is-right">
                <div class="t-datepicker-content-panel-header">
                    <button class="t-datepicker-content-panel-header__icon-btn
                               t-datepicker-content-panel-header__left-btn"
                            v-show="isPrevYearDis"
                            @click="prevRightYear">
                        <i class="iconfont icon-left-fill"></i>
                    </button>
                    <button class="t-datepicker-content-panel-header__icon-btn
                         t-datepicker-content-panel-header__left-btn"
                            v-show="isMonthDis"
                            @click="prevRightMonth">
                        <i class="iconfont icon-left-line"></i>
                    </button>
                    <span class="t-datepicker-content-panel-header__text">
                        {{rightDate.getFullYear()}}年
                    </span>
                    <span class="t-datepicker-content-panel-header__text">
                        {{rightDate.getMonth()+ 1}}月
                    </span>
                    <button class="t-datepicker-content-panel-header__icon-btn
                        t-datepicker-content-panel-header__right-btn"
                            @click="nextRightYear">
                        <i class="iconfont icon-right-fill"></i>
                    </button>
                    <button class="t-datepicker-content-panel-header__icon-btn
                        t-datepicker-content-panel-header__right-btn"
                            @click="nextRightMonth">
                        <i class="iconfont icon-right-line"></i>
                    </button>
                </div>
                <div class="t-datepicker-content-panel-content">
                    <date-table :date="rightDate"
                                :value="rightValue"
                                :minDate="minDate"
                                :disabledDate="disabledDate"
                                :maxDate="maxDate"
                                @picker="handlerPicker"
                                :defaultValue="new Date()"></date-table>
                </div>
            </div>

        </div>
    </transition>
</template>
<script>
import dateTable from './date-table';
import tInput from '../input/input';
import { getYearMonthAndDate, prevYear, nextYear, nextMonth, prevMonth, dateCompare } from './index';
import dimissMixin from '../utils/dimissMixin';

export default {
  name: 't-date-range',
  components: { dateTable, tInput },
  mixins: [dimissMixin],
  data() {
    return {
      startValue: this.getToday(),
      showDrop: false,
      leftDate: new Date(),
      rightDate: this.getNext(),
      leftValue: '',
      rightValue: '',
      maxDate: '',
      minDate: '',
    };
  },
  props: {
    disabledDate: {},
    type: {
      type: String,
      default: 'date',
    },
    format: {
      type: String,
      default: 'yyyy-mm-dd',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    value(val) {
      if (!val) {
        this.minDate = null;
        this.maxDate = null;
      } else if (Array.isArray(val)) {
        this.minDate = val[0] ? val[0] : null;
        this.maxDate = val[1] ? val[1] : null;
        if (this.minDate) {
          this.leftDate = this.minDate;
          if (this.maxDate) {
            this.rightDate =
                this.maxDate.getFullYear() === this.minDate.getFullYear()
                && this.maxDate.getMonth() === this.minDate.getMonth() ?
                  nextMonth(this.maxDate) : this.maxDate;
          } else {
            this.rightDate = nextMonth(this.leftDate);
          }
        } else {
          this.leftDate = new Date();
          this.rightDate = nextMonth(this.leftDate);
        }
      }
      this.$emit('picker', val);
    },
  },
  computed: {
    isPrevYearDis() {
      const leftYear = this.leftDate.getFullYear();
      const leftMonth = this.leftDate.getMonth();
      const rightYear = this.rightDate.getFullYear();
      const rightMonth = this.rightDate.getMonth();
      return ((rightYear * 12) + rightMonth) - ((leftYear * 12) + leftMonth + 1) >= 12;
    },
    isMonthDis() {
      const month = (this.leftDate.getMonth() + 1) % 12;
      const year = this.leftDate.getMonth() + 1 >= 12 ? 1 : 0;
      return new Date(this.leftDate.getFullYear() + year, month) <
          new Date(this.rightDate.getFullYear(), this.rightDate.getMonth());
    },
  },
  methods: {
    prevLeftYear() {
      this.leftDate = prevYear(this.leftDate);
    },
    prevLeftMonth() {
      this.leftDate = prevMonth(this.leftDate);
    },
    nextLeftYear() {
      this.leftDate = nextYear(this.leftDate);
    },
    nextLeftMonth() {
      this.leftDate = nextMonth(this.leftDate);
    },
    prevRightYear() {
      this.rightDate = prevYear(this.rightDate);
    },
    prevRightMonth() {
      this.rightDate = prevMonth(this.rightDate);
    },
    nextRightYear() {
      this.rightDate = nextYear(this.rightDate);
    },
    nextRightMonth() {
      this.rightDate = nextMonth(this.rightDate);
    },
    getToday() {
      const date = new Date();
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    handlerPicker(val) {
      const maxDate = val.maxDate;
      const minDate = val.minDate;
      if (dateCompare(maxDate, this.maxDate) === 0
          && dateCompare(minDate, this.minDate) === 0) {
        return;
      }
      this.maxDate = maxDate;
      this.minDate = minDate;
      this.$emit('update:value', [this.minDate, this.maxDate]);
    },
    getNext() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      if (month === 11) {
        return getYearMonthAndDate(date, year + 1, 0);
      }
      return getYearMonthAndDate(date, year, month + 1);
    },
  },
  mounted() {
    if (!this.value) {
      this.minDate = null;
      this.maxDate = null;
    } else if (Array.isArray(this.value)) {
      this.minDate = this.value[0] ? this.value[0] : null;
      this.maxDate = this.value[1] ? this.value[1] : null;
      if (this.minDate) {
        this.leftDate = this.minDate;
        if (this.maxDate) {
          this.rightDate =
            this.maxDate.getFullYear() === this.minDate.getFullYear()
            && this.maxDate.getMonth() === this.minDate.getMonth() ?
              nextMonth(this.maxDate) : this.maxDate;
        } else {
          this.rightDate = nextMonth(this.leftDate);
        }
      } else {
        this.leftDate = new Date();
        this.rightDate = nextMonth(this.leftDate);
      }
    }
  },
};
</script>
<style lang="less" scoped>
    .t-datepicker {
        color: #1d1c1d;
        position: relative;
        /*text-align: center;*/
        line-height: 30px;

    &-header {
         border: 1px solid #dcdcdc;
         width: 100%;
        & input {
        width: 45%;
        text-align: center;
        line-height: 30px;
              border: none;
              font-size: 14px;
        outline: none;
          }
    }

    &-content {
     position: absolute;
     z-index: 998;

    &-panel {
        float: left;
        width: 250px;
         z-index: 998;
         /*line-height: 30px;*/
         margin: 5px 0;
         padding: 5px 0;
         background-color: #fff;
         box-sizing: border-box;
         border-radius: 4px;
         box-shadow: 0 1px 6px rgba(0,0,0,.2);

    &-header {
        font-size: 16px;
        text-align: center;

    &__icon-btn {
        border: none;
        outline: none;
        padding: 0 10px;
        cursor: pointer;
        line-height: 22px;
        background-color: transparent;
    }

    &__text {
        cursor: pointer;
    }

    &__text:hover,

    &__icon-btn:hover {
        color: #4385ff;
    }

    &__left-btn {
        float: left;
    }

    &__right-btn {
        float: right;
    }

    &:after {
        clear: both;
    }

    }
    &-content {
        margin-top: 5px;
        border-top: 1px solid #eeeeee;
    }

    }
    }
    }
</style>
