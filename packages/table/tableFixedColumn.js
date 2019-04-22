/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import CheckBox from '../checkbox/index';
import tooltip from '../tooltip/index';

export default {
  name: 't-table-fixed-body',
  inject: ['store', 'actionObserver'],
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
    showColumns() {
      return this.side === 'left' ? this.store.fixedLeft : this.store.fixedRight;
    },
    wapperStyle() {
      const style = {};
      style.height = this.store.height && !this.store.fixedHead ? `${this.store.height}px` : 'auto';
      style.position = this.side === 'right' ? 'absolute' : '';
      style.top = this.side === 'right' ? '0' : '';
      style.right = this.side === 'right' ? '0' : '';
      return style;
    },
    renderData() {
      return this.store.data;
    },
    mainHeight() {
      if (this.store.height && !this.store.fixedHead) {
        return `${this.store.height}px`;
      }
      if (this.store.height && this.store.fixedHead) {
        return `${this.store.height + 17}px`;
      }
      return 'auto';
    },
  },
  props: {
    side: { type: String },
  },
  render(h) {
    return (
      <div class={[this.store.height && !this.store.fixedHead ? 't-table-scrollY' : ''].concat(['table-fixed', 'table-bg'])}
        style={this.wapperStyle}
        on-scroll={($event) => { this.scrollSync($event); }} ref={'fixedContainer'}>
        <div>
          <table>
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
                  column => <th class={`${this.getThClass(column)} t-table-column_${column.id}`} key={column.id}>
                    {column.renderHeader.call(this._renderProxy, h, { column })}
                    {column.hasSorter && column.key ? <span class="t-table-sorter-box">
                      <i class="t-table-sorter-up"
                        on-click={$event => this.ascSorter($event, column)}> </i>
                      <i class="t-table-sorter-down"
                        on-click={$event => this.descSorter($event, column)}> </i>
                    </span> : ''}
                  </th>)}
                {
                  this.store.fixedHead && this.side !== 'right' ? <th class={['table-gutter']}> </th> : ''
                }
              </tr>
            </thead>
          </table>
        </div>
        <div class={[this.store.height && this.store.fixedHead ? 't-table-scrollY' : ''].concat(['fixed-inside'])}
          style={{ height: this.mainHeight }} on-scroll={($event) => { this.scrollSync($event); }}
          ref={'fixedInside'}>
          <table>
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
                    <td class={[`${this.getTdClass(column)} t-table-column_${column.id}`]} key={column.id}
                      on-mouseenter={($event) => {
                        if (column.key && column.nowarp) {
                          tooltip($event, row[column.key]);
                        }
                      }}
                      style={{ position: column.nowarp ? 'relative' : '' }}>
                      {column.renderCell.call(this._renderProxy, h, { column, row, index })}</td>)}
                </tr>,
              ]) : <tr>
                <td colSpan={this.columns.length} class={this.getTdClass()}
                  style="text-align:center;">{this.store.emptyText}</td>
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
        if (column.nowarp) {
          classArr.push('t-table-nowarp');
        }
        if (!this.showColumns.includes(column)) {
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
      if (!this.showColumns.includes(column)) {
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
    hoverClass(index) {
      return this.actionObserver.hoverRowIndex === index ? 't-tr-hoverActive' : '';
    },
    scrollSync($event) {
      const mainTable = $event.srcElement;
      const scrollX = mainTable.scrollLeft;
      const scrollY = mainTable.scrollTop;
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
  },
  watch: {
    selections(val) {
      this.selectAll = val.length === this.renderData.length && this.renderData.length;
      this.store.setSelections(val);
    },
    renderData(val) {
      this.store.selections = [];
    },
    actionObserver: {
      handler(val) {
        if (this.store.height && this.store.fixedHead) {
          this.$refs.fixedInside.scrollTop = val.scrollY;
        }
        if (this.store.height && !this.store.fixedHead) {
          this.$refs.fixedContainer.scrollTop = val.scrollY;
        }
        // if (this.store.width && this.store.fixedHead) {
        //   this.$refs.fixedHeader.scrollLeft = val.scrollX;
        // }
      },
      deep: true,
    },
  },
  mounted() {
  },
};
