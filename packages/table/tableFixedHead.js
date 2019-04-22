/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */

import CheckBox from '../checkbox/index';

export default {
  name: 't-table-fixed-head',
  inject: ['store', 'actionObserver'], // 依赖注入核心数据和交互共享对象
  components: { CheckBox },
  // props: {
  //   bodyScrollY: Boolean,
  // },
  computed: {
    columns() { // 获取列的数据
      return this.store.columns;
    },
    renderData() { // 获取渲染的数据
      return this.store.data;
    },
  },
  render(h) { // jsx渲染表头
    return (
      // 根据是否定宽设置overflow
      <div class="table-head" style={{ overflow: this.store.width && this.store.fixedHead ? 'auto' : 'visiable' }}
        ref="fixedHeader">
        <table ref="tableHead">
          <colgroup>
            {
              this._l(this.columns,
                column =>
                  <col align={column.align}
                    width={column.width ? column.width : 100} name={`t-table-column_${column.id}`}/>)
            }
            {
              this.store.fixedHead ? <col name="table-gutter"/> : ''
            }
          </colgroup>
          <thead>
            <tr class={[this.store.bordered ? '' : 't-table-head']}>
              {this._l(this.columns,
                column => <th class={`${this.getThClass(column)} t-table-column_${column.id}`} key={column.id}
                >
                  {column.renderHeader.call(this._renderProxy, h, { column })}
                  {column.hasSorter && column.key ? <span class="t-table-sorter-box">
                    <i class="t-table-sorter-up"
                      on-click={$event => this.ascSorter($event, column)}> </i>
                    <i class="t-table-sorter-down"
                      on-click={$event => this.descSorter($event, column)}> </i>
                  </span> : ''}
                </th>)}
              {
                this.store.fixedHead ?
                  <th class={['table-gutter', this.store.fixedRight.length ? 't-table-hidden-th' : '']}
                    style={{ width: this.store.isScrollY ? '10px!important' : '0px!important' }}
                  > </th> : ''
              }
            </tr>
          </thead>
        </table>
      </div>
    );
  },
  methods: {
    toggleSelectAll(result) {
      if (result) {
        const newSelections = [];
        for (let i = 0; i < this.renderData.length; i++) {
          newSelections.push(i.toString());
        }
        this.store.setSelections(newSelections);
      } else {
        this.store.setSelections([]);
      }
      this.selectAll = result;
    },
    reverseCompare(fn) {
      return (...args) => !fn(args[0], args[1]);
    },
    ascSorter($event, column) {
      $event.stopPropagation();
      let sortMethod = this.defaultCompare;
      if (column.sortMethod) {
        sortMethod = column.sortMethod;
      }
      this.store.sort(sortMethod, column);
    },
    descSorter($event, column) {
      $event.stopPropagation();
      let sortMethod = this.defaultCompare;
      if (column.sortMethod) {
        sortMethod = column.sortMethod;
      }
      this.store.sort(this.reverseCompare(sortMethod), column);
    },
    defaultCompare(x, y) {
      const cx = Number(x);
      const cy = Number(y);
      if (!isNaN(cx) && !isNaN(cy)) {
        return cx > cy;
      }
      throw new Error('cannot compare a NaN');
    },
    computeSummry(key) {
      return this.renderData.reduce((sum, val) => sum + val[key], 0);
    },
    rowClickHandler($event, row) {
      if (this.store.clickHandler) {
        this.store.clickHandler($event, row);
      }
    },
    rowdbClickHandler($event, row) {
      if (this.store.dbclickHandler) {
        this.store.dbclickHandler($event, row);
      }
    },
    getThClass(column) {
      const classArr = ['t-table-th'];
      if (column.colClass) {
        classArr.push(column.colClass);
      }
      if (this.store.bordered) {
        classArr.push('t-table-bordered');
      }
      if (column.headAlign) {
        classArr.push(`t-table-align-${column.headAlign}`);
      } else if (column.align) {
        classArr.push(`t-table-align-${column.align}`);
      }
      if (column.fixed) {
        classArr.push('t-table-col-fixed');
      }
      if (this.renderData.length && this.store.fixedRight.length &&
        this.store.fixedRight.includes(column)) {
        classArr.push('t-table-hidden-th');
      }
      if (this.renderData.length && this.store.fixedLeft.length &&
        this.store.fixedLeft.includes(column)) {
        classArr.push('t-table-hidden-th');
      }
      return classArr.join(' ');
    },
    getTrClass(row, index) {
      const classArr = ['t-table-tr'];
      if (this.store.rowClass) {
        if (typeof this.store.rowClass === 'string') {
          classArr.push(this.store.rowClass);
        } else if (typeof this.store.rowClass === 'function') {
          classArr.push(this.store.rowClass(row, index));
        }
      }
      return classArr.join(' ');
    },
  },
  mounted() {
    if (this.store.fixedHead) {
      document.querySelector('.t-table .coverGutter').style.height = `${this.$refs.tableHead.offsetHeight}px`;
    }
    this.$parent.headHeight = this.$refs.fixedHeader.offsetHeight;
  },
  watch: {
    actionObserver: {
      handler(val) {
        this.$refs.fixedHeader.scrollLeft = val.scrollX;
      },
      deep: true,
    },
  },
};
