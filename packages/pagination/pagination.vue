<template>
    <div class="t-pagination">
        <ul>
            <li v-if="showTotal">
                <span>共{{total}}条</span>
            </li>
            <li :class="['t-pagination-item', {'is-disabled': current === 1}]" @click="goToPre">
                <slot name="prevPage">
                    <i class="iconfont icon-left-line"></i>
                </slot>
            </li>
            <li :class="[
            't-pagination-item',
             {'t-pagination-item-active': current === 1}]"
             v-if="showPageTab"
              @click="goToPage(1)">
              首页
            </li>
            <li :class="[
            't-pagination-item',
             {'t-pagination-item-active': current === item}
             ]"
                v-for="(item, index) in pages"
                :key="index"
                @click="goToPage(item)">
                {{item}}
            </li>
            <li :class="['t-pagination-item', {'is-disabled': current === pageCount}]"
                @click="goToNext">
                <slot name="nextPage">
                    <i class="iconfont icon-right-line"></i>
                </slot>
            </li>
             <li :class="[
            't-pagination-item',
             {'t-pagination-item-active': current === pages[pages.length-1]}]"
             v-if="showPageTab"
              @click="goToPage(pages[pages.length-1])">
              尾页
            </li>
            <li  v-if="showPageSize">
                <div class="t-pagination-select">
                    <div class="t-pagination-select-wrapper" @click="show = !show">
                        {{size}}条/页
                    </div>
                    <transition name="transition-drop">
                    <div class="t-pagination-select-dropdown" v-show="show">
                        <ul class="t-pagination-select-dropdown-ul">
                            <li v-for="(item, ind) in pageSizeList"
                                :value="item"
                                :key="ind"
                                @click="changePageSize(item)"
                                :class="[
                                't-pagination-select-dropdown-li',
                                {'t-pagination-select-dropdown-li-active' : size === item}
                                ]">
                                {{item}}条/页
                            </li>
                        </ul>
                    </div>
                    </transition>
                </div>
            </li>
            <li class="t-pagination-go"  v-if="showElevator">
                <span>跳至</span>
                <t-input type="text"
                         style="width: 50px;"
                         v-model="pageIndex"
                         @enter="goToShow"
                         size="small"/>
                <span>页</span>
            </li>
        </ul>
    </div>
</template>
<script>
import tSelect from '../select/select';
import tInput from '../input/input';

export default {
  name: 't-pagination',
  components: { tSelect, tInput },
  data() {
    return {
      // 每页显示的个数的选择器选项
      pageSizeList: [10, 20, 30, 50, 100],
      size: this.pageSize,
      showSize: 5,
      current: this.currentPage,
      show: false,
      pageIndex: null,
    };
  },
  props: {
    // 总条目数
    total: {
      type: Number,
      default: 0,
    },
    // 当前页数
    currentPage: {
      type: Number,
      default: 1,
    },
    // 每页显示的条目数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 是否显示可更改每页条数的选项
    showPageSize: {
      type: Boolean,
      default: false,
    },
    // 是否显示总条数
    showTotal: {
      type: Boolean,
      default: false,
    },
    // 是否显示跳转的选项
    showElevator: {
      type: Boolean,
      default: false,
    },
    // 是否显示首页尾页按钮
    showPageTab: {
      type: Boolean,
      default: false,
    },
    // pageSize改变时触发的事件
    sizeChange: Function,
    // pageNo改变时触发的事件
    pageChange: Function,
  },
  computed: {
    // 计算总页数
    pageCount() {
      const count = Math.ceil(this.total / this.size);
      return count === 0 ? 1 : count;
    },
    pages() {
      const pag = [];
      if (this.pageCount >= this.current) { // 如果当前分页的页数比当前激活的项
        if (this.current < this.showSize) { // 如果当前的激活的项 小于要显示的条数
          // 总页数和要显示的条数那个大就显示多少条
          let i = Math.min(this.showSize, this.pageCount);
          while (i) {
            pag.unshift(i);
            i -= 1;
          }
        } else {
          // 当前页数大于显示页数了
          let middle = this.current - Math.floor(this.showSize / 2); // 从哪里开始
          let i = this.showSize;
          if (middle > (this.pageCount - this.showSize)) {
            middle = (this.pageCount - this.showSize) + 1;
          }
          while (i) {
            pag.push(middle);
            middle += 1;
            i -= 1;
          }
        }
        return pag;
      }
      let i = Math.min(this.showSize, this.pageCount);
      this.goToPage(1);
      while (i) {
        pag.unshift(i);
        i -= 1;
      }
      return pag;
    },
  },
  watch: {
    currentPage(val) {
      this.current = val;
    },
    pageSize(val) {
      this.size = val;
    },
  },
  methods: {
    // 跳到某一页
    goToPage(index) {
      this.current = index;
      this.pageIndex = this.current;
      this.$emit('pageChange', this.current);
      this.$emit('update:currentPage', this.current);
    },
    // 跳到上一页
    goToPre() {
      if (this.current <= 1) {
        return;
      }
      this.goToPage(this.current - 1);
    },
    // 跳到下一页
    goToNext() {
      if (this.current >= this.pageCount) {
        return;
      }
      this.goToPage(this.current + 1);
    },
    // 输入页码跳转
    goToShow() {
      const value = Number(this.pageIndex);
      const pattern = /^[0-9]*$/;
      if (pattern.test(value)) {
        if (value === this.current || value > this.pageCount || value <= 0) {
          this.pageIndex = this.current;
          return;
        }
        this.goToPage(value);
      }
    },
    changePageSize(item) {
      this.size = item;
      this.show = false;
      this.$emit('sizeChange', this.size);
      this.goToPage(1);
    },
  },
};
</script>

<style lang="less">
    .t-pagination {
      display: block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      padding: 10px;
      font-size: 14px;
      color: #1d1c1d;
      &>ul>li {
        display: inline-block;
        vertical-align: middle;
      }
      &-item {
        padding: 0 10px;
        line-height: 24px;
        height: 24px;
        margin-right: 5px;
        border: 1px solid #e5e5e5;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        cursor: pointer;
        &:hover, &-active {
          background-color: #4385ff;
          color: #fff;
          border-color: #4385ff;
        }
        &.is-disabled {
          cursor: not-allowed;
          background-color: #ffffff;
          color: #1d1c1d;
          border-color: #e5e5e5;
        }
      }
      &-select {
        display: inline-block;
        min-width: 86px;
        line-height: 1.5;
        vertical-align: middle;
        position: relative;
        font-size: 14px;
        &-wrapper {
          height: 24px;
          line-height: 24px;
          -webkit-border-radius: 3px;
          -moz-border-radius: 3px;
          border-radius: 3px;
          padding:0 20px 0 10px;
          border:solid 1px #dcdcdc;
          display: block;
          outline: 0;
          background-color: #fff;
          cursor: pointer;
          &:after {
              position: absolute;
              right: 7px;
              top: 10px;
              display: inline-block;
              content: "";
              width: 7px;
              height: 7px;
              border: solid #999;
              border-width: 1px 1px 0 0;
              transform: translate(0,-50%) rotate(135deg);
              -webkit-transform: translate(0,-50%) rotate(135deg);
              -moz-transform: translate(0,-50%) rotate(135deg);
              -ms-transform: translate(0,-50%) rotate(135deg);
              -o-transform: translate(0,-50%) rotate(135deg);
          }
        }
        &-dropdown {
          position: absolute;
          width: 100%;
          bottom: 24px;
          z-index: 2000;
          max-height: 200px;
          overflow: auto;
          margin: 5px 0;
          padding: 5px 0;
          background-color: #fff;
          -webkit-box-sizing: border-box;
          -ms-box-sizing: border-box;
          box-sizing: border-box;
          border-radius: 4px;
          -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          -ms-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    &-ul {
      min-width: 100%;
      list-style: none;
      margin: 0;
      padding: 0;
      }
    &-li {
      font-size: 14px;
      padding: 0 10px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 24px;
      line-height: 24px;
      -webkit-box-sizing: border-box;
      -ms-box-sizing: border-box;
      box-sizing: border-box;
      cursor: pointer;
      &:hover, &-active {
        color: #fff;
        background-color: #4385ff;
      }
     }
    }
  }
}

</style>
