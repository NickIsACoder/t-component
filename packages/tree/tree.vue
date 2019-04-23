<template>
    <div class="t-tree">
        <t-tree-item v-for="(item, ind) in data"
                     :key="ind"
                     :data="item"
                     :isSelect="isSelect"
                     :disabledKeys="disabledKeys"
                     :showCheck="showCheck"
                     :displayMethod="displayMethod"
                     :defaultExpandAll="defaultExpandAll"
                     :props="props"></t-tree-item>
        <div v-show="filterNum === treeData.length" class="t-tree-not-found">
            无相关数据
        </div>
    </div>
</template>
<script>
/* eslint-disable no-shadow */
import tTreeItem from './tree-item';
import tInput from '../input/input';

export default {
  name: 't-tree',
  data() {
    return {
      treeData: [],
      filterNum: 0,
      isSelect: null,
      showSearch: true,
    };
  },
  components: { tTreeItem, tInput },
  props: {
    // 要渲染的tree数据
    data: {
      type: Array,
      default: () => [],
    },
    // 是否显示多选框
    showCheck: {
      type: Boolean,
      default: false,
    },
    // 是否默认展开全部数据
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    // 禁用多选框的数据集
    disabledKeys: {
      type: Array,
      default: () => ['001'],
    },
    // 异步加载数据
    loadData: Function,
    // 自定义显示的内容
    displayMethod: {
      type: [String, Function],
      default: 'label',
    },
    // 是否可选择任意节点（选父不默认选子，选子不默认选父）
    anyState: {
      type: Boolean,
      default: false,
    },
    // 选中的数据集
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    resultFilter: {
      type: Function,
      default: () => {},
    },
    // 字段对应
    props: {
      default: () => {
        const obj = {
          children: 'children',
          value: 'value',
          label: 'label',
        };
        return obj;
      },
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        // if (!this.showSearch) {
        this.treeData = this.initTree();
        // }
      },
    },
    disabledKeys() {
      this.setDisabledKeys();
    },
    defaultCheckedKeys() {
      this.setCheckedKeys();
    },
  },
  methods: {
    // 将树初始化，使得父与子之间有相关联(parent=>父级的位置，nodeKey=>该数据的位置)
    initTree() {
      let keyCounter = 0;
      const childrenKey = this.props.children;
      const flatTree = [];
      const that = this;
      const flattenChildren = (node, parent) => {
        const data = node;
        if (this.resultFilter && this.showSearch) {
          that.$set(data, 'visible', true);
        }
        data.nodeKey = keyCounter;
        keyCounter += 1;
        flatTree[data.nodeKey] = { node: data, nodeKey: data.nodeKey };
        if (typeof parent !== 'undefined') {
          flatTree[data.nodeKey].parent = parent.nodeKey;
        }

        if (data[childrenKey]) {
          data[childrenKey].forEach((child) => {
            // anyState为true的时候,子可以选中,另外一种是为false,子不可选中
            if (!that.anyState && data.disabled) {
              that.$set(child, 'disabled', true);
            }
            flattenChildren(child, data);
          });
        }
      };
      this.data.forEach(rootNode => flattenChildren(rootNode));
      return flatTree;
    },
    // 获取所有子节点的状态
    getChildStatus(node) {
      let selectAll = true;
      let selectNone = true;
      let withoutDisabled = true;
      // 遍历所有子节点获取是否所有子节点都选中/没有选中、有无禁用状态的子节点、有无半选状态的子节点
      for (let i = 0; i < node.length; i++) {
        const item = node[i];
        if (!item.checked || item.halfCheck) {
          selectAll = false;
          if (!item.disabled) {
            withoutDisabled = false;
          }
        }
        if (item.checked || item.halfCheck) {
          selectNone = false;
        }
      }
      return { selectAll, selectNone, withoutDisabled, half: !selectAll && !selectNone };
    },
    // 获取选中状态的节点
    getCheckedNodes() {
      return this.treeData.filter(obj => obj.node.checked).map((obj) => {
        const node = {};
        Object.entries(obj.node).forEach((x) => {
          if (!['checked', 'halfCheck', 'nodeKey', 'visible'].includes(x[0])) {
            node[x[0]] = x[1];
          }
        });
        return node;
      });
    },
    // 获取选中状态的key
    getCheckedKeys() {
      return this.treeData.filter(obj => obj.node.checked).map((obj) => {
        let node = '';
        const label = this.props.label;
        Object.entries(obj.node).forEach((x) => {
          if (!['checked', 'halfCheck', 'nodeKey', 'visible', label].includes(x[0])) {
            node = x[1];
          }
        });
        return node;
      });
    },
    // 设置选中状态的节点
    setCheckedKeys() {
      let keys = this.defaultCheckedKeys;
      const value = this.props.value;
      // 过滤父节点
      const parentArray = [];
      this.treeData.forEach((x) => {
        const node = x.node;
        const childrenKey = this.props.children;
        if (typeof node[childrenKey] !== 'undefined' && node[childrenKey].length > 0) {
          parentArray.push(node[this.props.value]);
        }
      });
      const tempKeys = [];
      keys.filter(x => (!parentArray.includes(x)) && tempKeys.push(x));
      keys = tempKeys;
      // 设置默认选中
      this.treeData.filter(x => keys.includes(x.node[value]))
        .map(obj => this.setChecked(obj.node, true, true));
    },
    // 设置禁用状态的节点
    setDisabledKeys() {
      const keys = this.disabledKeys;
      const value = this.props.value;
      this.treeData.filter(x => keys.includes(x.node[value]))
        .forEach((obj) => {
          this.$set(obj.node, 'disabled', true);
        });
    },
    // 选中节点
    setChecked(data, val, deep, resetCheck, passValue) {
      const node = data;
      let value = val;
      const childrenKey = this.props.children;
      // 设置节点的checked和halfCheck
      this.$set(node, 'halfCheck', value === 'half');
      this.$set(node, 'checked', value === true);
      // if (this.anyState) return;
      if (node[childrenKey]) {
        // 获取子节点的状态，根据子节点的状态更新当前节点的状态
        const { selectAll, withoutDisabled } = this.getChildStatus(node[childrenKey]);
        if (!selectAll && withoutDisabled) {
          node.checked = false;
          value = false;
        }
        const handlerChildren = () => {
          // 往下触发子节点直到树叶（没有子节点）为止
          if (deep) {
            const childNodes = node[childrenKey];
            for (let i = 0; i < childNodes.length; i++) {
              const child = childNodes[i];
              const pass = passValue || value !== false;
              const isChecked = child.disabled ? child.checked : pass;
              this.setChecked(child, isChecked, deep, true, pass);
            }
            const { selectAll, half } = this.getChildStatus(childNodes);
            if (!selectAll) {
              node.checked = selectAll;
              node.halfCheck = half;
            }
          }
        };
        handlerChildren();
      }
      // 当有父节点时，更新父节点状态
      const parent = this.treeData[node.nodeKey].parent;
      if (!parent && parent !== 0) return;
      // 当父节点被禁用时，父节点状态不更新
      if (this.treeData[parent].node.disabled) return;
      if (!resetCheck) {
        this.resetChecked(this.treeData[parent].node);
      }
    },
    // 根据所有子节点状态更新当前节点的状态
    resetChecked(node) {
      const childrenKey = this.props.children;
      if (node[childrenKey].length === 0) return;
      const { selectAll, selectNone, half } = this.getChildStatus(node[childrenKey]);
      if (selectAll) {
        this.$set(node, 'halfCheck', false);
        this.$set(node, 'checked', true);
      } else if (selectNone) {
        this.$set(node, 'halfCheck', false);
        this.$set(node, 'checked', false);
      } else if (half) {
        this.$set(node, 'halfCheck', true);
        this.$set(node, 'checked', false);
      }
      const parent = this.treeData[node.nodeKey].parent;
      if (!parent && parent !== 0) return;
      if (!this.anyState) {
        this.resetChecked(this.treeData[parent].node);
      }
    },
    handleCheck({ checked, nodeKey }) {
      const node = this.treeData[nodeKey].node;
      this.setChecked(node, checked, true);
      this.$emit('check', this.getCheckedNodes());
      // this.$emit('getCheckKeys', this.getCheckedKeys());
    },
    // 过滤数据，visible为true时显示该节点
    filter(val) {
      if (!this.resultFilter) return;
      const { resultFilter } = this;
      const childrenKey = this.props.children;
      const changeVisible = (data) => {
        this.showSearch = false;
        const node = data;
        // 获取所有子节点
        const childrenNodes = node[childrenKey] ? node[childrenKey] : [];
        // 当前节点过滤是否显示
        node.visible = resultFilter(val, node);
        // 遍历所有子节点
        childrenNodes.forEach((item) => {
          const child = item;
          child.visible = resultFilter(val, child);
          changeVisible(child);
        });
        // 当前节点被过滤掉并且有子节点时，遍历子节点，当有一个子节点的visible为true时，该节点也为true
        if (!node.visible && childrenNodes.length) {
          let allHidden = true;
          childrenNodes.forEach((child) => {
            if (child.visible) {
              allHidden = false;
            }
          });
          node.visible = allHidden === false;
        }
        if (!node.visible) {
          this.filterNum = this.filterNum + 1;
        }
      };
      this.data.forEach(x => changeVisible(x));
      if (!val) {
        this.filterNum = 0;
      }
    },
    getSelectNode() {
      const data = {};
      const { treeData, isSelect } = this;
      const node = treeData[isSelect].node;
      Object.entries(node).forEach((x) => {
        if (!['checked', 'halfCheck', 'nodeKey', 'visible'].includes(x[0])) {
          data[x[0]] = x[1];
        }
      });
      return data;
    },
    handleSelect(obj) {
      this.isSelect = obj.nodeKey;
      this.$emit('select', this.getSelectNode());
    },
  },
  created() {
    this.treeData = this.initTree();
    this.setDisabledKeys();
    this.setCheckedKeys();
  },
  mounted() {
    this.$on('on-check', this.handleCheck);
    this.$on('on-select', this.handleSelect);
  },
};
</script>
<style lang="less">
    .t-tree-not-found {
        text-align: center;
        padding: 15px 0;
        color: #adadad;
    }
</style>
