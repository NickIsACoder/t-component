<template>
  <div style="margin:50px">
    <h1>测试测试</h1>
    <!-- <Timepicker @changeTime="changeTime" v-model="time" :isPeriod="false" >
    </Timepicker> -->
    <!-- <Timepicker v-model="time2" range="00:00:00-18:40:45"></Timepicker> -->
    <Timepicker v-model="time3" :isPeriod="true" range="01:02:01-05:02:03"></Timepicker>
  </div>
<!-- :isPeriod=true range="15:30:00-18:20:00" -->

</template>

<script>
import { Timepicker } from 't-component';

export default {
  name: 'test',
  data() {
    return {
      time: '60:00:00',
      time2: '00:00:00',
      time3: '00:00:00',
      tableData: [
        {
          date1: '2016-05-03',
          name1: '王小虎',
          province1: '上海',
          city1: '普陀区',
          address1: '上海市普陀区金沙江路 1518 弄',
          zip1: 200332,
        }, {
          date1: '2016-05-02',
          name1: '王小虎',
          province1: '上海',
          city1: '普陀区',
          address1: '上海市普陀区金沙江路 1518 弄',
          zip1: 200335,
        }, {
          date1: '2016-05-04',
          name1: '王小虎',
          province1: '上海',
          city1: '普陀区',
          address1: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip1: 200339,
        }, {
          date1: '2016-05-01',
          name1: '王小虎',
          province1: '上海',
          city1: '普陀区',
          address1: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
          zip1: 200338,
        }],
    };
  },
  components: {
    Timepicker,
  },
  methods: {
    changeTime() {
    },
  },
};
</script>
