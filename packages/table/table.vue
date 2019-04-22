<template>
<div class="t-table"
     :style="{width: width && height ? (width + 17) + 'px' :
     (width && !height ? width + 'px' : '100%')}">
  <div >
    <!--头部插槽-->
    <slot name="header"></slot>
    <!--表示空白的块的插槽-->
    <slot name="emyptBlock" v-if="0"></slot>
  </div>
  <!--column插槽，一般不显示，固定表头的时候用来遮住gutter-->
  <div :class="fixedHead ? 'coverGutter' : ''"><div style="display: none;"><slot></slot></div></div>
  <!--主表-->
  <div :style="{width: width ? width + 'px' : '100%',
   overflow: width ? 'auto' : ''}" ref="mainContainer"
       class="table-main-container">
    <div class="t-table-wrapper"
         :style="{height: height && !fixedHead ? `${height + 17}px` : 'auto'}"
         :class="[height && !fixedHead ? 't-table-scrollY' : '']" ref="outSide"
         @scroll="scrollSync($event)">
      <!--主表表头，分开是为了可以达到固定表头的功能-->
      <tableFixedHead></tableFixedHead>
      <!--主表内容-->
      <tableBody></tableBody>
    </div>
  </div>
  <!--左固定列，有数据有固定列的时候显示-->
  <div v-if="source.length && store.fixedLeft.length && width" class="t-table-fl-container"
  :style="leftFixedSize" style="border-right: 1px solid #ccc;">
    <tableFixedColumn side="left"></tableFixedColumn>
  </div>
  <!--右固定列，有数据有固定列的时候显示-->
  <div v-if="source.length && store.fixedRight.length && width" class="t-table-fr-container"
       :style="rightFixedSize" style="border-right: 1px solid #ccc;">
    <tableFixedColumn side="right"></tableFixedColumn>
  </div>
  <!--底部插槽-->
  <div>
    <slot name="footer"></slot>
  </div>
</div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import tableBody from './tableBody';
import tableFixedHead from './tableFixedHead';
import tableFixedColumn from './tableFixedColumn';


export default {
  name: 't-table',
  components: { tableBody, tableFixedHead, tableFixedColumn },
  data() {
    const store = {
      data: [],
      columns: [],
      fixedLeft: [],
      fixedRight: [],
      selections: [],
      sort(fn, col) {
        const { data } = this;
        const newData = [...data];
        for (let i = 0; i < newData.length - 1; i++) {
          let switchItem = newData[i];
          let switchIndex = -1;
          for (let j = i + 1; j < newData.length; j++) {
            if (fn(switchItem[col.key], newData[j][col.key])) {
              switchItem = newData[j];
              switchIndex = j;
            }
          }
          if (switchIndex > -1) {
            newData[switchIndex] = newData[i];
            newData[i] = switchItem;
          }
        }
        this.data = newData;
        this.setSelections([]);
      },
      setSelections(selections) {
        this.selections = selections;
        if (this.selectHandler) {
          this.selectHandler(selections);
        }
      },
      summary(keys) {
        return keys;
      },
      fixedHead: false,
      hasSummary: false,
      summaryKeys: [],
      bordered: false,
    };
    store.hasSummary = this.hasSummary;
    store.fixedHead = this.fixedHead;
    store.singleSelect = this.singleSelect;
    store.summaryKeys = this.summaryKeys;
    store.bordered = this.bordered;
    store.selectHandler = this.onSelect;
    store.clickHandler = this.onClick;
    store.dbclickHandler = this.ondbClick;
    store.emptyText = this.emptyText;
    store.width = this.width;
    store.height = this.height;
    store.rowClass = this.rowClass;
    store.isScrollY = this.isScrollY;
    const actionObserver = {
      scrollX: 0,
      scrollY: 0,
      hoverRowIndex: -1,
    };
    return {
      store,
      actionObserver,
      fixedHeight: 0,
      headHeight: 0,
      addTimer: false,
      isScrollY: false,
    };
  },
  computed: {
    leftFixedSize() {
      const { store, height, fixedHead, fixedHeight } = this;
      if (!store.fixedLeft.length) return { width: 0, height: 0 };
      const fL = store.fixedLeft;
      let fh;
      if (height && fixedHead) {
        fh = `${fixedHeight - 17}px`;
      } else if (height && !fixedHead) {
        fh = `${height}px`;
      } else {
        fh = `${fixedHeight}px`;
      }
      const size = { height: fh };
      size.width = `${fL.reduce((swidth, col) => {
        if (col.width) return swidth + parseFloat(col.width);
        return swidth + 50;
      }, 0)}px`;
      return size;
    },
    rightFixedSize() {
      const { store, height, fixedHead, fixedHeight } = this;
      if (!store.fixedRight.length) return { width: 0, height: 0 };
      const fL = store.fixedRight;
      let fh;
      if (height && fixedHead) {
        fh = `${fixedHeight - 17}px`;
      } else if (height && !fixedHead) {
        fh = `${height}px`;
      } else {
        fh = `${fixedHeight}px`;
      }
      const size = { height: fh };
      size.width = `${fL.reduce((frwidth, col) => {
        if (col.width) return frwidth + parseFloat(col.width);
        return frwidth + 50;
      }, 0)}px`;
      size.top = 0;
      size.right = height ? '34px' : '0';
      return size;
    },
  },
  props: {
    bordered: { type: Boolean, default: false },
    singleSelect: { type: Boolean, default: false },
    source: { type: Array },
    width: { type: Number },
    emptyText: { type: String, default: '暂无数据显示' },
    fixedHead: { type: Boolean, default: false },
    height: { type: Number },
    rowClass: { type: [String, Function] },
    hasSummary: { type: Boolean, default: false },
    summaryKeys: { type: Array },
    onSelect: { type: Function },
    onClick: { type: Function },
    ondbClick: { type: Function },
    hoverRowClass: { type: String },
  },
  provide() {
    return {
      addColumn: this.addColumn,
      removeColumn: this.removeColumn,
      store: this.store,
      updateColumn: this.updateColumn,
      actionObserver: this.actionObserver,
      setFixedHeight: this.setFixedHeight,
      setWapperWidth: this.setWapperWidth,
    };
  },
  methods: {
    bodyIsScrollY(type) {
      this.isScrollY = type === true;
    },
    addColumn(column) {
      const c = this.store.columns.some(col => col.id === column.id);
      if (!c) {
        if (this.width) {
          if (column.fixed === 'left' || column.fixed === true) {
            let swapIndex;
            if (this.store.fixedLeft.length) {
              swapIndex = this.store.columns
                .findIndex(col => col === this.store.fixedLeft[this.store.fixedLeft.length - 1]);
            } else {
              swapIndex = -1;
            }
            this.store.fixedLeft.push(column);
            this.store.columns = this.store.fixedLeft
              .concat(this.store.columns.slice(swapIndex > -1 ? (swapIndex + 1) : 0));
          } else if (column.fixed === 'right') {
            let swapIndex;
            if (this.store.fixedRight.length) {
              swapIndex = this.store.columns.findIndex(col => col === this.store.fixedRight[0]);
            } else {
              swapIndex = this.store.columns.length;
            }
            this.store.fixedRight.push(column);
            this.store.columns = this.store.columns.slice(0, swapIndex)
              .concat(this.store.fixedRight);
          } else if (this.store.fixedRight.length) {
            const swapIndex = this.store.columns.findIndex(col => col === this.store.fixedRight[0]);
            const subColumns = this.store.columns.slice(0, swapIndex);
            subColumns.push(column);
            this.store.columns = subColumns.concat(this.store.fixedRight);
          } else {
            this.store.columns.push(column);
          }
        } else {
          this.store.columns.push(column);
        }
      }
    },
    removeColumn(column) {
      const index = this.store.columns.findIndex(col => col.id === column.id);
      if (index > -1) {
        this.store.columns.splice(index, 1);
      }
    },
    updateColumn(column, attr, val) {
      const c = this.store.columns.findIndex(col => col.id === column.id);
      if (c > -1) {
        this.store.columns[c][attr] = val;
      }
      return this.store.columns[c];
    },
    setFixedHeight(height) {
      this.fixedHeight = height;
    },
    setWapperWidth(width) {
      this.$refs.outSide.style.width = `${parseFloat(width) + 34}px`;
    },
    scrollSync($event) {
      const mainTable = $event.srcElement;
      const scrollX = mainTable.scrollLeft;
      const scrollY = mainTable.scrollTop;
      if (scrollX !== this.actionObserver.scrollX) {
        this.actionObserver.scrollX = scrollX;
      }
      if (scrollY !== this.actionObserver.scrollY) {
        this.actionObserver.scrollY = scrollY;
      }
    },
  },
  watch: {
    actionObserver: {
      handler(val) {
        if (this.height && !this.fixedHead) {
          this.$refs.outSide.scrollTop = val.scrollY;
        }
      },
      deep: true,
    },
    isScrollY: {
      handler(val) {
        this.store.isScrollY = val;
      },
      immediate: true,
    },
    bordered(val) {
      this.store.bordered = val;
    },
    singleSelect(val) {
      this.store.singleSelect = val;
    },
    fixedHead(val) {
      this.store.fixedHead = val;
    },
    hasSummary(val) {
      this.store.hasSummary = val;
    },
    summaryKeys(val) {
      this.store.summaryKeys = val;
    },
    onSelect(val) {
      this.store.selectHandler = val;
    },
    onCick(val) {
      this.store.clickHandler = val;
    },
    ondbClick(val) {
      this.store.dbclickHandler = val;
    },
    source(val) {
      this.store.data = val;
    },
    emptyText(val) {
      this.store.emptyText = val;
    },
    width(val) {
      this.store.width = val;
    },
    height(val) {
      this.store.height = val;
    },
    rowClass(val) {
      this.store.rowClass = val;
    },
  },
  created() {
    this.store.data = this.source;
  },
  mounted() {
    if (this.fixedHead) {
      this.$nextTick(() => {
        this.fixedHeight = this.$refs.mainContainer.offsetHeight;
      });
    }
  },
};
</script>

<style lang="less" >
  .t-table{
    position: relative;
    & .t-table-align-left{
      text-align: left;
    }
    & .t-table-align-right{
      text-align: right;
    }
    & .t-table-align-center{
      text-align: center;
    }
    & .t-table-sorter-box{
      display: inline-block;
      height: 34px;
      width: 24px;
      vertical-align: middle;
      cursor: pointer;
      position: relative;
      margin-left: 8px;
      top: -5px;
      .t-table-sorter-up, .t-table-sorter-down {
        height:15px;
        width: 15px;
        display: inline-block;
      }
      .t-table-sorter-up{
        background: url("./img/upA.png");
        background-size: 100% 100%;
      }
      .t-table-sorter-down{
        background: url("./img/downA.png");
        background-size: 100% 100%;
      }
    }
    & .t-table-scrollY {
      overflow-y: auto;
    }
    & .t-table-scrollX{
      overflow-x: auto;
    }
    & .t-table-wrapper{
      position: relative;
    }
    & table{
      border-spacing: 0;
      border-bottom: 1px solid #ccc;
      border-collapse: collapse;
      table-layout:fixed;
      margin-bottom: 0;
      .t-table-head{
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
      }
      .t-table-bordered{
        border: 1px solid #ccc;
      };
      .t-table-nowarp > span{
        white-space:nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        max-width: 100%;
      }
      td, th{
        padding: 7px 12px;
        width: 50px;
      }
    }
    .table-head table, .table-main table, .table-fixed table{
      width: 100%;
    }
    .table-gutter{
      width:15px!important;
      padding: 0;
    }
    .table-main, .table-head{
      width: 100%;
      overflow-x: visible!important;
    }
    .table-head, .table-fixed, .fixed-inside{
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .table-head::-webkit-scrollbar, .table-fixed::-webkit-scrollbar,
    .fixed-inside::-webkit-scrollbar{
      height: 0!important;
      width: 0 !important;
    }
    .t-table-hidden-td, .t-table-hidden-th{
      visibility: hidden;
      border: 1px transparent solid!important;
    }
    .t-table-fl-container{
      top: 0;
      left: 0;
      position: absolute;
      overflow: hidden;
    }
    .t-table-fr-container{
      position: absolute;
      overflow: hidden;
      border-left: 1px solid #ccc;
    }
    .table-bg{
      background-color: #fff;
    }
    .table-main-container{
      position: relative;
    }
    .t-tr-hoverActive > td {
      background-color: #f1f1f1;
      transition: background-color .2s;
    }
  }
  .coverGutter{
    position: absolute;
    /*width: 17px;*/
    top: 0;
    right: 17px;
    background: #fff;
    z-index: 90;
  }
</style>
