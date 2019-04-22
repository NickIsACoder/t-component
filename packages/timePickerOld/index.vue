<template>
  <div class="t-timepicker">
    <div v-if="!getisPeriod">
      <timepicker v-model="single"
        :format="getFormat"
        :range="getRange"
        :placeholder="placeholder"
        @changeTime="handleChoose"></timepicker>
    </div>
    <div v-else>
      <timepicker ref="minSpinner"
        v-model="starttime"
        :format="getFormat"
        :range="getRange"
        :isPeriod="isPeriod"
        :maxTime="maxTime"
        :placeholder="startPlaceholder"
        @changeTime="handleMinChange"></timepicker>
      -
      <timepicker ref="maxSpinner"
        v-model="endtime"
        :format="getFormat"
        :range="getRange"
        :minTime="minTime"
        :isPeriod="isPeriod"
        :placeholder="endPlaceholder"
        @changeTime="handleMaxChange"></timepicker>
    </div>
  </div>
</template>

<script>
import timepicker from './timePicker';

export default {
  name: 't-tpk-main',
  data() {
    return {
      single: '',
      starttime: '',
      endtime: '',
      minTime: '',
      maxTime: '',
    };
  },
  components: { timepicker },
  props: {
    placeholder: {
      type: String,
      default: '请选择时间',
    },
    startPlaceholder: {
      type: String,
      default: '开始时间',
    },
    endPlaceholder: {
      type: String,
      default: '结束时间',
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
  },
  computed: {
    getisPeriod() {
      return this.isPeriod;
    },
    getRange() {
      if (this.range.length === 17) {
        const val = this.range;
        const valArr1 = val.split('-')[0].split(':');
        const valArr2 = val.split('-')[1].split(':');
        if (valArr1[0] < 24 && valArr1[1] < 60 && valArr1[2] < 60
         && valArr2[0] < 24 && valArr2[1] < 60 && valArr2[2] < 60) {
          return this.range;
        }
      }
      return '';
    },
    getFormat() {
      return this.format;
    },
    spliter() {
      if (this.format === 'hh:mm:ss') return ':';
      let fstr = this.format;
      fstr = fstr.replace('hh', '');
      fstr = fstr.replace('mm', '');
      fstr = fstr.replace('ss', '');
      return fstr.charAt(1);
    },
  },
  methods: {
    checkLegalTime() {
      const t1a = this.starttime.split(this.spliter);
      const h1 = isNaN(parseInt(t1a[0], 10)) ? 0 : parseInt(t1a[0], 10);
      const m1 = isNaN(parseInt(t1a[1], 10)) ? 0 : parseInt(t1a[1], 10);
      const s1 = isNaN(parseInt(t1a[2], 10)) ? 0 : parseInt(t1a[2], 10);
      const t2a = this.endtime.split(this.spliter);
      const h2 = isNaN(parseInt(t2a[0], 10)) ? 0 : parseInt(t2a[0], 10);
      const m2 = isNaN(parseInt(t2a[1], 10)) ? 0 : parseInt(t2a[1], 10);
      const s2 = isNaN(parseInt(t2a[2], 10)) ? 0 : parseInt(t2a[2], 10);
      if (h1 > h2) {
        this.endtime = '';
        return false;
      } else if (h1 === h2) {
        if (m1 > m2) {
          this.endtime = '';
          return false;
        } else if (m1 === m2) {
          if (s1 > s2) {
            this.endtime = '';
            return false;
          } return true;
        } return true;
      } return true;
    },
    handleChoose(val) {
      this.$emit('change', val);
    },
    handleMinChange(val) {
      if (val) {
        const minT = val.replace(/(?=(?!(\b))(\d{2})+$)/g, ':');
        this.minTime = minT;
      }
    },
    handleMaxChange(val) {
      if (val) {
        const maxT = val.replace(/(?=(?!(\b))(\d{2})+$)/g, ':');
        this.maxTime = maxT;
      }
    },
  },
  watch: {
    single(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
    starttime(val) {
      if (val && this.endtime) {
        if (this.checkLegalTime()) {
          this.$emit('input', `${val}-${this.endtime}`);
          this.$emit('change', `${val}-${this.endtime}`);
        }
      }
    },
    endtime(val) {
      if (val && this.starttime) {
        if (this.checkLegalTime()) {
          this.$emit('input', `${this.starttime}-${val}`);
          this.$emit('change', `${this.starttime}-${val}`);
        }
      }
    },
    value(val) {
      if (val) {
        if (this.isPeriod) {
          // eslint-disable-next-line
          if (/\-/g.test(val)) {
            this.starttime = val.split('-')[0];
            this.endtime = val.split('-')[1];
          }
        } else {
          this.single = val;
        }
      }
    },
  },
  created() {
    if (this.value) {
      const val = this.value;
      if (val.indexOf('-') === -1 && val.length === 8) {
        const valArr = val.split(':');
        for (let i = 0; i < valArr.length; i++) {
          if (valArr[i].length === 2) {
            if (valArr[0] > 23) {
              valArr[0] = '00';
            } else if (valArr[i] > 59) {
              valArr[i] = '00';
            }
          }
        }
        this.single = valArr.join(':');
      } else if (this.isPeriod && val.length === 17) {
        const valArr1 = val.split('-')[0];
        const valArr2 = val.split('-')[1];
        for (let i = 0; i < valArr1.length; i++) {
          if (valArr1[i].length === 2) {
            if (valArr1[0] > 23) {
              valArr1[0] = '00';
            } else if (valArr1[i] > 59) {
              valArr1[i] = '00';
            }
          }
        }
        for (let i = 0; i < valArr2.length; i++) {
          if (valArr2[i].length === 2) {
            if (valArr2[0] > 23) {
              valArr2[0] = '00';
            } else if (valArr2[i] > 59) {
              valArr2[i] = '00';
            }
          }
        }
        this.starttime = valArr1;
        this.endtime = valArr2;
      }
    }
  },
};
</script>

<style scoped>
.t-timepicker{
  display: inline-block;
  width: 100%;
}
</style>
