/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import CheckBox from '../checkbox/index';

/**
 * 这个组件是接受输入的列项然后整理相关数据和属性提交到store上去代理渲染
 */
export default {
  name: 't-table-column',
  inject: ['addColumn', 'removeColumn', 'updateColumn'], // 依赖注入有关列的处理方法
  components: { CheckBox },
  data() {
    return {
      column: {
        key: this.colKey,
        label: this.label,
        width: this.width,
        fixed: this.fixedCol,
        renderself: null,
        renderHeader: null,
        id: this._uid,
      },
    };
  },
  computed: {
    renderMethods() { // 根据不同的列的不同给出不同渲染方法
      const _self = this;
      const allRender = {
        selection: {
          renderCell(h, { column, row, index }) { // 渲染带checkbox的td
            return <span><CheckBox
              value={index.toString()}
              checked={this.store.selections}
              showLabel={false}
              on-change={($event) => { // 这里的this后面会用apply来替换成渲染组件里的主体
                if (this.store.singleSelect) {
                  const selections = this.store.selections[0] === index.toString()
                    ? [] : [index.toString()];
                  this.store.setSelections(selections);
                } else {
                  this.store.setSelections($event);
                }
              }}


            /></span>;
          },
          renderHeader(h) { // 渲染带checkbox的th
            return <span>{this.store.singleSelect ? '' : <CheckBox
              checked={this.store.data.length &&
              this.store.selections.length === this.store.data.length} // 这里的this也是一样的
              showLabel={false}
              on-change={($event) => { this.toggleSelectAll($event); }}
            />}</span>;
          },
        },
        index: {
          renderCell(h, { index }) { // 渲染带index的td
            return (<span>{index + 1}</span>);
          },
          renderHeader(h) { // 渲染带index的th
            return (<span>#</span>);
          },
        },
        label: {
          renderCell(h, { column, row }) { // 渲染一般的td
            if (_self.$scopedSlots.default) { // 如果有scopedSlot，就会去渲染scopedSlot的内容
              // eslint-disable-next-line
              return _self.$scopedSlots.default(arguments[1]);
            }
            return (<span>{row[column.key]}</span>);
          },
          renderHeader(h, { column }) { // 渲染的一般的th
            return (<span>{column.label}</span>);
          },
        },
      };
      return this.type ? allRender[this.type] : allRender.label; // 返回渲染方法
    },
  },
  props: {
    colKey: { type: String }, // 每一列对应在每条数据的额键值
    label: { type: String }, // 该列的表头名字
    colClass: { type: String }, // 每列的列样式
    type: { type: String }, // 列的类型，可以是selection，index，不填就是默认的根据colkey来渲染
    fixed: { type: [Boolean, String] }, // 是否固定列， true和'left'向左，'right'向右
    width: { type: String }, // 自定义列的宽度，不填就是50
    align: { type: String }, // 对齐方式，表头默认居中，表格默认左对齐
    headAlign: { type: String }, // 重新设置表头的对齐方式（如果和表格不同的话）
    hasSorter: { type: Boolean }, // 是否有筛选器，默认没有
    sortMethod: { type: Function }, // 自定义筛选方法，默认是数字排序
    nowarp: { type: Boolean, default: false }, // 是否不撑开宽度和换行，如果true会多的字会隐藏起来，会显示tooltip
    nowarpPos: { type: String, default: 'rightCenter' }, // 自定义气泡显示位置,默认显示右边
  },
  watch: { // 观察一系列的属性然后相应去更新到渲染主体中去
    colKey(val) {
      this.column = this.updateColumn(this.column, 'key', val);
    },
    type(val) {
      this.column = this.updateColumn(this.column, 'type', val);
    },
    label(val) {
      this.column = this.updateColumn(this.column, 'label', val);
    },
    colClass(val) {
      this.column = this.updateColumn(this.column, 'colClass', val);
    },
    fixed(val) {
      this.column = this.updateColumn(this.column, 'fixed', val);
    },
    width(val) {
      this.column = this.updateColumn(this.column, 'width', val);
    },
    align(val) {
      this.column = this.updateColumn(this.column, 'align', val);
    },
    headAlign(val) {
      this.column = this.updateColumn(this.column, 'headAlign', val);
    },
    nowarp(val) {
      this.column = this.updateColumn(this.column, 'nowarp', val);
    },
    nowarpPos(val) {
      this.column = this.updateColumn(this.column, 'nowarpPos', val);
    },
    hasSorter(val) {
      this.column = this.updateColumn(this.column, 'hasSorter', val);
    },
    sortMethod(val) {
      this.column = this.updateColumn(this.column, 'sortMethod', val);
    },
  },
  created() { // 创建的时候就把数据提交上去
    this.$options.render = h => h('div', this.$slots.default); // 没有渲染东西就随便渲染点，否则会报错
    const column = {
      colClass: this.colClass,
      align: this.align,
      headAlign: this.headAlign,
      key: this.colKey,
      label: this.label,
      width: this.width,
      fixed: this.fixed,
      renderCell: null,
      renderHeader: null,
      id: null,
      hasSorter: this.hasSorter,
      sortMethod: this.sortMethod,
      nowarp: this.nowarp,
      nowarpPos: this.nowarpPos,
      type: this.type,
    };
    Object.keys(this.renderMethods).forEach((prop) => { // 用遍历后复制方法去获得渲染方法，否则this的指向会出问题
      column[prop] = this.renderMethods[prop];
    });
    column.id = this.$parent.$children.findIndex(c => c === this); // 用组件在父组件的位置作为唯一标识的id
    this.column = column;
    this.addColumn(this.column); // 提交数据
  },
  destoryed() {
    this.removeColumn(this.column); // 当列被去掉的时候同时清除
  },
};
