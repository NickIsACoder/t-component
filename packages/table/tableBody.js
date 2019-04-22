/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import CheckBox from '../checkbox/index';
import tooltip from '../tooltip/index';

export default {
  name: 't-table-body',
  inject: ['store', 'actionObserver', 'setFixedHeight', 'setWapperWidth'],
  components: { CheckBox },
  data() {
    return {
      selections: [],
      selectAll: false,
    };
  },
  computed: {
    columns() {
      return this.store.columns;
    },
    renderData() {
      return this.store.data;
    },
    mainHeight() {
      if (this.store.width && this.store.height && !this.store.fixedHead) {
        return `${this.store.height - this.$parent.headHeight}px`;
      }
      if (this.store.width && this.store.height && this.store.fixedHead) {
        return `${this.store.height + 34}px`;
      }
      return 'auto';
    },
  },
  render(h) {
    return (
      <div class={[this.store.height && this.store.fixedHead ? 't-table-scrollY' : ''].concat(['table-main'])}
        ref={'tableMain'}
        style={{ height: this.mainHeight }} on-scroll={($event) => {
          this.scrollSync($event);
        }}>
        <table ref={'tableBody'}>
          <colgroup>
            {
              this._l(this.columns,
                column => <col align={column.align} width={column.width ? column.width : 100}
                  name={`t-table-column_${column.id}`}/>)
            }
          </colgroup>
          <tbody>
            {this.renderData.length ? this._l(this.renderData, (row, index) => [
              <tr on-click={$event => this.rowClickHandler($event, row)}
                class={[this.getTrClass(row, index), this.hoverClass(index)]}
                on-dblclick={$event => this.rowdbClickHandler($event, row)} key={index}
                on-mouseenter={$event => this.rowHoverHandler($event, index)}
                on-mouseleave={$event => this.rowHoverHandler($event)}>
                {this._l(this.columns, column =>
                  <td class={`${this.getTdClass(column)} t-table-column_${column.id}`} key={column.id}
                    on-mouseenter={($event) => {
                      if (column.key && column.nowarp) {
                        // tooltip($event, { title: row[column.key], position: 'rightCenter' });
                        tooltip($event, { title: row[column.key], position: column.nowarpPos });
                      }
                    }}
                    on-click={
                      ($event) => {
                        if (column.type === 'selection') {
                          $event.stopPropagation();
                        }
                      }
                    }
                    style={{ position: column.nowarp ? 'relative' : '' }}>
                    {column.renderCell.call(this._renderProxy, h, { column, row, index })}</td>)}
              </tr>,
            ]) : <tr>
              <td colSpan={this.columns.length} class={this.getTdClass()}
                style="text-align:center;">{
                  this.$parent.$slots.emptyBlock ?
                    this.$parent.$slots.emptyBlock : this.store.emptyText
                }</td>
            </tr>}
            {this.store.hasSummary && this.renderData.length ?
              [(<tr>
                <td colSpan={this.columns.length} class={this.getTdClass()}>合计</td>
              </tr>),
                (<tr>{this._l(this.columns, (column) => {
                  if (this.store.summaryKeys.includes(column.key)) {
                    return <td class={this.getTdClass(column)}>
                      {this.computeSummry(column.key)}</td>;
                  }
                  return <td class={this.getTdClass(column)}></td>;
                })}</tr>)] :
              ''}
          </tbody>
        </table>
      </div>
    );
  },
  methods: {
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
    getTdClass(column) {
      const classArr = ['t-table-td'];
      if (this.store.bordered) {
        classArr.push('t-table-bordered');
      }
      if (column) {
        if (column.colClass) {
          classArr.push(column.colClass);
        }
        if (column.align) {
          classArr.push(`t-table-align-${column.align}`);
        }
        if (column.fixed) {
          classArr.push('t-table-col-fixed');
        }
        if (column.nowarp) {
          classArr.push('t-table-nowarp');
        }
        if (this.store.fixedRight.length && this.store.fixedRight.includes(column)) {
          classArr.push('t-table-hidden-td');
        }
        if (this.store.fixedLeft.length && this.store.fixedLeft.includes(column)) {
          classArr.push('t-table-hidden-td');
        }
      }
      return classArr.join(' ');
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
      if (this.renderData.length && this.store.width && this.store.fixedRight.length
        && this.store.fixedRight.includes(column)) {
        classArr.push('t-table-hidden-th');
        const i = classArr.findIndex(cls => cls === 't-table-bordered');
        if (i !== -1) {
          classArr.splice(i, 1);
        }
      }
      if (this.renderData.length && this.store.width && this.store.fixedLeft.length
        && this.store.fixedLeft.includes(column)) {
        classArr.push('t-table-hidden-th');
        const i = classArr.findIndex(cls => cls === 't-table-bordered');
        if (i !== -1) {
          classArr.splice(i, 1);
        }
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
    scrollSync($event) {
      const mainTable = $event.srcElement || $event.target;
      const scrollX = mainTable.scrollLeft;
      const scrollY = mainTable.scrollTop;
      if (scrollX !== this.actionObserver.scrollX) {
        this.actionObserver.scrollX = scrollX;
      }
      if (scrollY !== this.actionObserver.scrollY) {
        this.actionObserver.scrollY = scrollY;
      }
    },
    rowHoverHandler($event, index) {
      if ($event.type === 'mouseenter') {
        this.actionObserver.hoverRowIndex = index;
      } else {
        this.actionObserver.hoverRowIndex = -1;
      }
    },
    hoverClass(index) {
      return this.actionObserver.hoverRowIndex === index ? 't-tr-hoverActive' : '';
    },
  },
  watch: {
    selections(val) {
      this.selectAll = val.length === this.renderData.length && this.renderData.length;
      this.store.setSelections(val);
    },
    renderData(val) {
      this.store.selections = [];
    },
    'store.data': {
      handler() {
        this.$nextTick(() => {
          this.store.isScrollY = this.$refs.tableBody.offsetHeight > this.store.height;
        });
      },
    },
    actionObserver: {
      handler(val) {
        if (this.store.height && this.store.fixedHead) {
          this.$refs.tableMain.scrollTop = val.scrollY;
        }
        if (this.store.width && this.store.fixedHead) {
          // this.$refs.fixedHeader.scrollLeft = val.scrollX;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.store.width) {
        this.store.isScrollY = this.$refs.tableBody.offsetHeight > this.store.height;
        this.setFixedHeight(50 + this.$refs.tableBody.offsetHeight);
      }
    });
  },
};
