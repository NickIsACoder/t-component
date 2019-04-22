<template>
    <div class="t-transfer-list">
        <div class="t-transfer-list-header" @click="selectAll">
            <t-checkbox v-model="checkAll"
                        class="t-transfer-list-header-checkbox"
                        @change="handleCheckAllChange"></t-checkbox>
            <span class="t-transfer-list-header-count">{{count}}项</span>
            <span class="t-transfer-list-header-title">{{title}}</span>
        </div>
        <t-checkbox-group class="t-transfer-list-body" v-model="dataSelect">
            <t-checkbox v-for="(item, index) in data"
                        :key="index"
                        :disable="item.disabled"
                        :value="item[valueKey]"
                        class="t-transfer-list-body-item">
                <span v-html="displayFormat(item)"></span>
            </t-checkbox>
        </t-checkbox-group>
    </div>
</template>
<script>
import tCheckbox from '../checkbox/index';
import tCheckboxGroup from '../checkbox-group/index';

export default {
  name: 't-transfer-panel',
  components: { tCheckbox, tCheckboxGroup },
  data() {
    return {
      checkAll: false,
      dataSelect: [],
    };
  },
  props: {
    title: String,
    data: {
      type: Array,
      default: () => [],
    },
    displayMethod: {
      type: [Function, String],
      default: 'label',
    },
    // keyword
    valueKey: {
      type: String,
      default: 'value',
    },
  },
  computed: {
    // 可选择的数据
    ableData() {
      return this.data.filter(item => !item.disabled);
    },
    count() {
      const selectLength = this.dataSelect.length;
      const ableDataLength = this.ableData.length;
      return `${selectLength}/${ableDataLength}`;
    },
  },
  methods: {
    // 取消/全选
    selectAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.dataSelect = this.ableData.map(item => item[this.valueKey]);
      } else {
        this.dataSelect = [];
      }
    },
    //
    handleCheckAllChange(value) {
      this.dataSelect = value ? this.ableData.map(item => item[this.valueKey]) : [];
    },
    // 内容自定义显示
    displayFormat(data) {
      if ({}.toString.call(this.displayMethod) === '[object Function]') {
        return this.displayMethod(data);
      }
      return data[this.displayMethod];
    },
    updateChecked() {
      const checkKeys = this.ableData.map(item => item[this.valueKey]);
      this.checkAll =
          checkKeys.length > 0 && checkKeys.every(item => this.dataSelect.indexOf(item) > -1);
    },
  },
  watch: {
    dataSelect(val) {
      this.updateChecked();
      this.$emit('select-change', val);
    },
    data(val) {
      const dataSelect = [];
      const filteredDataKeys = val.map(item => item[this.valueKey]);
      this.dataSelect.forEach((item) => {
        if (filteredDataKeys.indexOf(item) > -1) {
          dataSelect.push(item);
        }
      });
      this.dataSelect = dataSelect;
    },
  },
};
</script>
