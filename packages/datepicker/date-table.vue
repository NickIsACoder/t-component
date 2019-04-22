<template>
    <table class="t-date-table" cellspacing="0">
        <tbody>
        <tr>
            <td v-for="(w, ind) in weekArr" :key="ind">{{w}}</td>
        </tr>
        <tr v-for="(row, ind) in rows" :key="ind">
            <td v-for="(d, index) in row"
                :key="index"
                :class="[d.type,
                {'date-selected': isSelect(d.text, d.type),
                'is-disabled': d.disabled,
                'is-start': d.start && !['prev-month', 'next-month'].includes(d.type),
                'is-end': d.end && !['prev-month', 'next-month'].includes(d.type),
                 'is-range': d.inRange && !['prev-month', 'next-month'].includes(d.type)}]"
                @click="clickDate(d)"
            >
                <span>{{d.text}}</span>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script>
export default {
  name: 't-date-table',
  data() {
    return {
      weekArr: ['日', '一', '二', '三', '四', '五', '六'],
      dayArr: [[], [], [], [], [], []],
    };
  },
  props: {
    disabledDate: {},
    date: {},
    value: {},
    type: {
      type: String,
      default: 'date',
    },
    minDate: {},
    maxDate: {},
  },
  computed: {
    year() {
      return this.date.getFullYear();
    },
    month() {
      return this.date.getMonth();
    },
    // 月日历的开始位置的天数
    monthStartDate() {
      const firstDay = new Date(this.year, this.month, 1);
      const firstDayDate = firstDay.getDay();
      return firstDayDate === 0 ?
        this.prevDate(firstDay, 7) : this.prevDate(firstDay, firstDayDate);
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
          const currentColDay = this.nextDate(monthStartDate, index);
          col.inRange = this.minDate
              && this.maxDate && this.dateCompare(currentColDay, this.minDate) >= 0
              && this.dateCompare(this.maxDate, currentColDay) >= 0;
          col.start = this.minDate && this.dateCompare(currentColDay, this.minDate) === 0;
          col.end = this.maxDate && this.dateCompare(currentColDay, this.maxDate) === 0;
          const today = new Date();
          const isToday =
              this.dateCompare(today, currentColDay);
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
  },
  methods: {
    // 比较两个日期
    dateCompare(date1, date2) {
      if (date1.getFullYear() === date2.getFullYear()) {
        if (date1.getDate() && date2.getDate()) {
          if (date1.getMonth() === date2.getMonth()) {
            if (date1.getDate() > date2.getDate()) {
              return 1;
            }
            return date1.getDate() === date2.getDate() ? 0 : -1;
          }
          return date1.getMonth() > date2.getMonth() ? 1 : -1;
        }
        if (date1.getMonth() > date2.getMonth()) {
          return 1;
        }
        return date1.getMonth() === date2.getMonth() ? 0 : -1;
      }
      return date1.getFullYear() > date2.getFullYear() ? 1 : -1;
    },
    prevDate(date, num = 1) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - num);
    },
    nextDate(date, num = 1) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + num);
    },
    isSelect(d, type) {
      const { value, year, month } = this;
      const isEqual = value
          && value.getFullYear() === year
          && value.getMonth() === month
          && value.getDate() === Number(d);
      return isEqual && (type !== 'prev-month' && type !== 'next-month');
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
      const value = new Date(year, month, obj.text);
      // 选择日期范围的情况，根据选中的日期来判断最大日期和最小日期
      if (this.minDate && this.maxDate) {
        this.$emit('picker', { minDate: value, maxDate: null });
      } else if (this.minDate && !this.maxDate) {
        if (value >= this.minDate) {
          this.$emit('picker', { minDate: this.minDate, maxDate: value });
        } else {
          this.$emit('picker', { minDate: value, maxDate: this.minDate });
        }
      } else if (!this.minDate) {
        this.$emit('picker', { minDate: value, maxDate: this.maxDate });
      }
    },
  },
};
</script>
<style lang="less" scoped>
    .t-date-table {
        width: 100%;

        & td {
            width: 32px;
            height: 30px;
            padding: 4px 0;
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;
            position: relative;

            & .normal:hover {
                color: #4385ff;
            }

        }
    }
    .prev-month, .next-month {
        color: #ccc;
    }
    .today {
        color: #4385ff;
    }
    .is-range {
        background-color: rgba(170, 197, 251, 0.39);
    }
    .date-selected, .is-start, .is-end {
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
