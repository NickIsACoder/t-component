<template>
        <transition name="transition-drop">
            <div class="t-date-picker" v-show="show">
                <div class="t-date-picker-panel">
                    <div class="t-date-picker-panel-header">
                       <button class="t-date-picker-panel-header__icon-btn
                               t-date-picker-panel-header__left-btn" @click="prevYear">
                           <i class="iconfont icon-left-fill"></i>
                       </button>
                        <button class="t-date-picker-panel-header__icon-btn
                         t-date-picker-panel-header__left-btn"
                                @click="prevMonth"
                                v-show="currentView === 'date'">
                            <i class="iconfont icon-left-line"></i>
                        </button>
                        <span class="t-date-picker-panel-header__text"
                              @click="currentView = 'year'">
                            {{currentView === 'year' ?
                            `${startYear}年-${startYear + 9}年`: `${year}年`}}
                        </span>
                        <span class="t-date-picker-panel-header__text"
                              @click="currentView = 'month'"
                              v-show="currentView === 'date'">{{month + 1}}月</span>
                        <button class="t-date-picker-panel-header__icon-btn
                        t-date-picker-panel-header__right-btn"
                                @click="nextYear">
                            <i class="iconfont icon-right-fill"></i>
                        </button>
                        <button class="t-date-picker-panel-header__icon-btn
                        t-date-picker-panel-header__right-btn"
                                @click="nextMonth"
                                v-show="currentView === 'date'">
                            <i class="iconfont icon-right-line"></i>
                        </button>
                    </div>
                    <div class="t-date-picker-panel-content">
                        <table v-if="currentView === 'date'">
                            <tbody>
                                <tr>
                                    <td v-for="(w, ind) in weekArr" :key="ind">{{w}}</td>
                                </tr>
                                <tr v-for="(row, ind) in rows" :key="ind">
                                    <td v-for="(d, index) in row"
                                        :key="index"
                                        @click="clickDate(d)"
                                        :class="[d.type,
                                        {'date-selected': isSelect(d.text, d.type),
                                         'is-disabled': d.disabled
                                         }]"
                                    >{{d.text}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table v-if="currentView === 'month'">
                            <tr v-for="(n, ind) in 3" :key="ind">
                                <td  v-for="(mon, ind) in monthArr.slice(n * 4 -4, n*= 4)"
                                     :key="ind"
                                     :class="
                                     ['month-normal',
                                      {'current-month': isCurrentMonth(mon)}]"
                                     @click="selectMonth(mon)">{{mon}}</td>
                            </tr>
                        </table>
                        <table v-if="currentView === 'year'">
                            <tr>
                                <td :class="{'year-selected': isCurrentYear(startYear + 0)}"
                                 @click="selectYear(startYear + 0)">{{startYear + 0}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 1)}"
                                 @click="selectYear(startYear + 1)">{{startYear + 1}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 2)}"
                                 @click="selectYear(startYear + 2)">{{startYear + 2}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 3)}"
                                 @click="selectYear(startYear + 3)">{{startYear + 3}}</td>
                            </tr>
                            <tr>
                                <td :class="{'year-selected': isCurrentYear(startYear + 4)}"
                                 @click="selectYear(startYear + 4)">{{startYear + 4}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 5)}"
                                 @click="selectYear(startYear + 5)">{{startYear + 5}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 6)}"
                                 @click="selectYear(startYear + 6)">{{startYear + 6}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 7)}"
                                 @click="selectYear(startYear + 7)">{{startYear + 7}}</td>
                            </tr>
                            <tr>
                                <td :class="{'year-selected': isCurrentYear(startYear + 8)}"
                                 @click="selectYear(startYear + 8)">{{startYear + 8}}</td>
                                <td :class="{'year-selected': isCurrentYear(startYear + 9)}"
                                 @click="selectYear(startYear + 9)">{{startYear + 9}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </transition>
</template>
<script>
import tInput from '../input/input';
import tButton from '../button/index';
import { prevYear, nextYear, nextMonth, prevMonth, prevDate, nextDate, dateCompare, formatData, parseDate } from './index';

export default {
  name: 't-date',
  components: { tInput, tButton },
  data() {
    return {
      weekArr: ['日', '一', '二', '三', '四', '五', '六'],
      monthArr: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
      dayArr: [[], [], [], [], [], []],
      currentView: 'date',
      showDrop: false,
    };
  },
  props: {
    date: {},
    show: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'date',
    },
    disabledDate: {},
    format: {
      type: String,
      default: 'yyyy-mm-dd',
    },
  },
  watch: {
    show(val) {
      if (!val) {
        this.currentView = this.type;
      }
    },
  },
  computed: {
    year() {
      return this.date.getFullYear();
    },
    month() {
      return this.date.getMonth();
    },
    rows() {
      const { year, month } = this;
      const currentMonthDays = this.getMonthDays(year, month);
      const lastMonthDays = this.getMonthDays(year, month - 1);
      // 生成对应星期的日期数组
      let firstDay = new Date(year, month, 1).getDay();
      firstDay = (firstDay === 0 ? 7 : firstDay);
      const rowArr = this.dayArr;
      let count = 1;

      // 返回一个二维数组
      for (let i = 0; i < 6; i++) {
        const row = rowArr[i];
        for (let j = 0; j < 7; j++) {
          let col = rowArr[i][j];
          col = {
            type: 'normal',
            row: i,
            col: j,
          };
          const index = (i * 7) + j;
          const monthStartDate = this.monthStartDate;
          // 获取当前单元格的日期
          const currentColDay = nextDate(monthStartDate, index);
          const today = new Date();
          const isToday =
              dateCompare(today, currentColDay);
          if (isToday === 0) {
            col.type = 'today';
          }
          if (i === 0) {
            if (j >= firstDay) {
              col.text = count;
              count += 1;
            } else {
              col.text = (lastMonthDays - (firstDay - j)) + 1 + (i * 7);
              col.type = 'prev-month';
            }
          }
          if (count <= currentMonthDays && i > 0) {
            col.text = count;
            count += 1;
          } else if (i > 0 && count > currentMonthDays) {
            col.text = count - currentMonthDays;
            count += 1;
            col.type = 'next-month';
          }
          col.disabled = typeof this.disabledDate === 'function' && this.disabledDate(currentColDay);
          this.$set(row, j, col);
        }
      }
      return rowArr;
    },
    // 月日历的开始位置的天数
    monthStartDate() {
      const firstDay = new Date(this.year, this.month, 1);
      const firstDayDate = firstDay.getDay();
      return firstDayDate === 0 ?
        prevDate(firstDay, 7) : prevDate(firstDay, firstDayDate);
    },
    startYear() {
      return Math.floor(this.year / 10) * 10;
    },
  },
  methods: {
    isSelect(d, type) {
      const { value, year, month } = this;
      const currentValue = value && parseDate(value, this.format);
      const isEqual = currentValue
          && currentValue.getFullYear() === year
          && currentValue.getMonth() === month
          && currentValue.getDate() === Number(d);
      return isEqual && (type !== 'prev-month' && type !== 'next-month');
    },
    isCurrentMonth(mon) {
      const currentMonth = Number(mon.slice(0, 2));
      const today = this.date ? this.date : new Date();
      const currentYear = today.getFullYear();
      return currentMonth === this.month + 1 && currentYear === this.year;
    },
    isCurrentYear(year) {
      const today = this.date ? this.date : new Date();
      const currentYear = today.getFullYear();
      return year === currentYear;
    },
    // 获取某年某月有多少天
    getMonthDays(year, month) {
      if (month === 1) {
        if (year % 4 === 0 && !(year % 100 === 0 && year % 400 !== 0)) {
          return 29;
        }
        return 28;
      }
      if ([0, 2, 4, 6, 7, 9, 11].includes(month)) {
        return 31;
      }
      return 30;
    },
    // 点击日期
    clickDate(obj) {
      if (obj.disabled) return;
      let year = this.year;
      let month = this.month;
      if (obj.type === 'prev-month') {
        if (month === 0) {
          year -= 1;
          month = 11;
        } else {
          month -= 1;
        }
      } else if (obj.type === 'next-month') {
        if (month === 11) {
          year += 1;
          month = 0;
        } else {
          month += 1;
        }
      }
      const value = formatData(new Date(year, month, obj.text), this.format);
      this.$emit('picker', value);
    },
    // 上一个月
    prevMonth() {
      this.$emit('update:date', prevMonth(this.date));
    },
    prevYear() {
      if (this.currentView === 'year') {
        this.$emit('update:date', prevYear(this.date, 10));
      } else {
        this.$emit('update:date', prevYear(this.date));
      }
    },
    nextMonth() {
      this.$emit('update:date', nextMonth(this.date));
    },
    nextYear() {
      if (this.currentView === 'year') {
        this.$emit('update:date', nextYear(this.date, 10));
      } else {
        this.$emit('update:date', nextYear(this.date));
      }
    },
    selectMonth(mon) {
      const date = new Date(this.year, parseInt(mon.slice(0, 2), 10) - 1, 1);
      this.$emit('update:date', date);
      if (this.type === 'date') {
        this.currentView = 'date';
      } else if (this.type === 'month') {
        this.$emit('picker', formatData(new Date(this.year, Number(mon.slice(0, 2)) - 1, 1), this.format));
      }
    },
    selectYear(year) {
      this.$emit('update:date', new Date(year, this.month, 1));
      if (this.type !== 'year') {
        this.currentView = 'month';
      } else {
        this.$emit('picker', formatData(new Date(year, this.month, 1), this.format));
      }
    },
  },
  mounted() {
    switch (this.type) {
      case 'date':
        this.currentView = 'date';
        break;
      case 'month':
        this.currentView = 'month';
        break;
      case 'year':
        this.currentView = 'year';
        break;
      default:
        this.currentView = 'date';
        break;
    }
  },
};
</script>
<style lang="less" scoped>
    .t-date {
        color: #1d1c1d;
        line-height: 30px;
        &-picker {
             position: absolute;
             z-index: 998;
             width: 250px;
             margin: 5px 0;
             padding: 5px 0;
             background-color: #fff;
             box-sizing: border-box;
             border-radius: 4px;
             box-shadow: 0 1px 6px rgba(0,0,0,.2);
            &-panel {
                &-header {
                     font-size: 16px;
                     text-align: center;

                    &__icon-btn {
                        border: none;
                        padding: 0 10px;
                        cursor: pointer;
                        outline: none;
                        line-height: 22px;
                        background-color: transparent;
                    }
                    &__text {
                        cursor: pointer;
                     }
                    &__text:hover, &__icon-btn:hover {
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
                    margin-top:5px;
                    border-top: 1px solid #eeeeee;
                    & table {
                          width: 100%;
                        & td {
                              padding: 3px 0;
                              box-sizing: border-box;
                              text-align: center;
                              cursor: pointer;
                              position: relative;
                              &.normal:hover {
                                   color: #4385ff;
                               }
                              &.normal.date-selected:hover {
                                color: #fff;
                              }
                          }
                      }
                 }
            }
        }
    }
    .prev-month, .next-month {
        color: #ccc;
    }
    .today {
        color: #4385ff;
    }
    .date-selected {
        color: #fff;
        background-color: #4385ff;
    }
    .is-disabled {
        cursor: not-allowed;
        background-color: #e5e5e5;
    }
    .current-month, .year-selected {
        color: #4385ff;
    }
</style>
