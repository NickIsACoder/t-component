import fecha from './fecha';

const weeks = ['日', '一', '二', '三', '四', '五', '六'];
const months = ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];
const getI18nSettings = () => {
  const obj = {
    dayNamesShort: weeks,
    dayNames: weeks,
    monthNamesShort: months,
    monthNames: months,
    amPm: ['am', 'pm'],
  };
  return obj;
};
// 计算每个月对应的天数
export const getMonthDays = (year, month) => {
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
};
// 日期格式化
export const dateFormat = (y, m, d, format = 'yyyy-mm-dd') => {
  let month = m ? `0${parseInt(m, 10)}` : '';
  let day = d ? `0${d}` : '';
  month = month.slice(-2); // 把日期前面直接加个零，然后从后面往前切两位，这方法很好！
  day = day.slice(-2);
  if (y || m || d) {
    return format.replace('yyyy', y)
      .replace('YYYY', y)
      .replace('mm', month)
      .replace('MM', month)
      .replace('DD', day)
      .replace('dd', day);
  }
  return '';
};
// 日期比较
export const dateCompare = (date1, date2) => {
  if (!date1 || !date2) return null;
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
};
export const getYearMonthAndDate = (date, year, month) => {
  const maxDay = getMonthDays(year, month);
  const monthDate = Math.min(date.getDate(), maxDay);
  return new Date(year, month, monthDate);
};
export const prevYear = (date, num = 1) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return getYearMonthAndDate(date, year - num, month);
};
export const prevMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month === 0) {
    return getYearMonthAndDate(date, year - 1, 11);
  }
  return getYearMonthAndDate(date, year, month - 1);
};
export const nextYear = (date, num = 1) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return getYearMonthAndDate(date, year + num, month);
};
export const nextMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  if (month === 11) {
    return getYearMonthAndDate(date, year + 1, 0);
  }
  return getYearMonthAndDate(date, year, month + 1);
};
export const prevDate =
    (date, num = 1) => new Date(date.getFullYear(), date.getMonth(), date.getDate() - num);
export const nextDate =
    (date, num = 1) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + num);
export const isDate = (date) => {
  if (date === null || date === undefined || date === '') return false;
  if (isNaN(new Date(date).getTime())) return false;
  if (Array.isArray(date)) return false;
  return true;
};
export const toDate = (date) => {
  if (isDate(date)) return new Date(date);
  return null;
};
export const formatData = (date, format) => {
  const d = toDate(date);
  if (!d) return '';
  return fecha.format(d, format || 'yyyy-MM-dd', getI18nSettings());
};
export const parseDate = (string, format) => fecha.parse(string, format || 'yyyy-MM-dd', getI18nSettings());
