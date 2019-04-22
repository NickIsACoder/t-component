<template>
    <div class="t-transfer">
        <t-transfer-panel :title="title[0]"
                          :data="leftData"
                          :displayMethod="displayMethod"
                          :valueKey="valueKey"
                          @select-change="leftSelectChange"></t-transfer-panel>
        <div class="t-transfer-operation">
            <t-button size="small"
                      icon="icon-right-line"
                      :disabled="leftSelect.length === 0"
                      @click="changeToTarget">
            </t-button>
            <t-button size="small"
                      icon="icon-left-line"
                      :disabled="rightSelect.length === 0"
                      @click="changeToSource">
            </t-button>
        </div>
        <t-transfer-panel :title="title[1]"
                          :data="rightData"
                          :displayMethod="displayMethod"
                          :valueKey="valueKey"
                          @select-change="rightSelectChange"></t-transfer-panel>
    </div>
</template>
<script>
import tCheckbox from '../checkbox/index';
import tCheckboxGroup from '../checkbox-group/index';
import tTransferPanel from './transfer-panel';
import tButton from '../button/index';

export default {
  name: 't-transfer',
  components: { tCheckbox, tCheckboxGroup, tTransferPanel, tButton },
  data() {
    return {
      leftSelect: [],
      rightSelect: [],
      leftData: [],
      rightData: [],
    };
  },
  props: {
    // 两个框的标题
    title: {
      type: Array,
      default: () => ['源数据', '目标数据'],
    },
    // 左边的数据源
    source: {
      type: Array,
      default: () => [],
    },
    // 右边的目标数据集
    value: {
      type: Array,
      default: () => [],
    },
    // 自定义显示的内容
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
  methods: {
    // 获取左边选中的数据
    leftSelectChange(val) {
      this.leftSelect = val;
    },
    // 获取右边选中的数据
    rightSelectChange(val) {
      this.rightSelect = val;
    },
    // 更新数据
    initData() {
      const { value, valueKey } = this;
      this.leftData = [].concat(this.source);
      this.rightData = [];
      if (value.length > 0) {
        value.forEach((key) => {
          const data = this.leftData.filter((item, index) => {
            const itemKey = item[valueKey];
            if (key === itemKey) {
              this.leftData.splice(index, 1);
              return true;
            }
            return false;
          });
          if (data.length > 0) {
            this.rightData.push(data[0]);
          }
        });
      }
    },
    // 转移左边的选项
    changeToTarget() {
      let currentTarget = [].concat(this.value);
      const { leftSelect, valueKey, leftData } = this;
      const moveData = [];
      leftData.forEach((item) => {
        const itemKey = item[valueKey];
        if (leftSelect.indexOf(itemKey) > -1
            && currentTarget.indexOf(itemKey) === -1) {
          moveData.push(itemKey);
        }
      });
      currentTarget = currentTarget.concat(moveData);
      this.leftSelect = [];
      this.$emit('input', currentTarget);
      this.$emit('change', currentTarget);
    },
    // 转移右边的选项
    changeToSource() {
      const currentValue = [].concat(this.value);
      this.rightSelect.forEach((item) => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
        }
      });
      this.rightSelect = [];
      this.$emit('input', currentValue);
      this.$emit('change', currentValue);
    },
  },
  watch: {
    value() {
      this.initData();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang="less">
ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
}
.t-transfer {
    position: relative;
    padding: 10px;
    &-list {
         display: inline-block;
         width: 42%;
         height: 210px;
         font-size: 14px;
         color: #1d1c1d;
         vertical-align: middle;
         position: relative;
         box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
         padding-top: 37px;

         &-header {
              line-height: 36px;
              vertical-align: middle;
              border-bottom: 1px solid #e9eaec;
              overflow: hidden;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              &-checkbox {
                   padding-left: 15px;
              }
              &-title {
                   float: right;
                   padding-right:15px;
               }
         }
         &-body {
              height: 100%;
              width: 100%;
              border-top: none;
              padding: 5px 0;
              position: relative;
              overflow-y: auto;
              &-item {
                    line-height: 32px;
                    padding: 0 15px;
                    cursor: pointer;
                    vertical-align: middle;
                    white-space: nowrap;
                    overflow: hidden;
                    display: block;
                    text-overflow: ellipsis;
                }
          }
    }
    &-operation {
        display: inline-block;
         overflow: hidden;
         margin: 0 16px;
         vertical-align: middle;
         & button {
               display: block;
               margin-bottom: 10px;
           }
     }
}
</style>
