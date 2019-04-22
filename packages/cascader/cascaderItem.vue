<template>
    <div class="t-cascader-wrapper">
        <ul v-if="data && data.length">
            <li v-for="(item, ind) in data"
                :key="ind"
                @click.stop="handlerSelectItem(item)"
                :class="[
                't-cascader-wrapper-item',
                {'is-select': canMultiple ?
                currentSelect.findIndex(x => x.value === item.value) > -1 :
                 item.value === (currentSelect[0] && currentSelect[0].value)}
                ]">
                <span>{{item.label}}</span>
                <i class="iconfont icon-right-line t-cascader-wrapper-more"
                   v-if="(item.children && item.children.length)
                    || ('loading' in item && !item.loading)"></i>
                <i class="ball-clip-rotate t-cascader-wrapper-more"
                   v-if="'loading' in item && item.loading"></i>
            </li>
            <li>
                <tButton v-if="canMultiple && currentSelect.length > 0"
                         size="small"
                         type="info"
                         @click="chooseMulti">确定</tButton>
            </li>
        </ul>
        <t-cascader-item v-if="subItem && subItem.length > 0"
                         :data="subItem"
                         :multiple="multiple"
                         @handleChoose="handleChoose"></t-cascader-item>
    </div>
</template>
<script>
import Emitter from '../utils/emitter';
import tButton from '../button/index';

export default {
  name: 't-cascader-item',
  data() {
    return {
      subItem: [],
      result: [],
      currentSelect: [],
      canMultiple: false,
      newSelect: false,
      isLoadedChildren: false,
      fromInit: false,
    };
  },
  mixins: [Emitter],
  components: { tButton },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    multiple: Boolean,
  },
  methods: {
    // 更新父组件的result值
    updateResult(result) {
      this.result = this.currentSelect.concat(result);
      this.$parent.updateResult(this.result);
    },
    handleChoose(value, close = false, fromInit = false) {
      this.$emit('handleChoose', value, close, fromInit);
    },
    handlerSelectItem(item, fromUser = false) {
      const parent = this.$parent;
      // 异步加载数据时
      if (item.loading !== undefined && !item.children) {
        let cascader = parent;
        let name = cascader.$options.name;
        // 向上查找名为t-cascader的父组件
        while (cascader && (!name || ['t-cascader'].indexOf(name) < 0)) {
          cascader = cascader.$parent;
          if (cascader) {
            name = cascader.$options.name;
          }
        }
        const currentItem = item;
        if (cascader && cascader.loadData) {
          // 调用异步请求数据方法，选中当前选项，如果该选项没有子选项，则删除loading属性，隐藏图标
          cascader.loadData(currentItem, () => {
            // todo
            if (fromUser) {
              this.isLoadedChildren = true;
            }
            this.handlerSelectItem(currentItem, fromUser);
            if (!currentItem.children.length) {
              delete currentItem.loading;
            }
          });
          return;
        }
      }
      this.newSelect = true;
      // 获取当前选中的选项（不包含子选项）
      const currentItem = Object.assign({}, item);
      if (currentItem.children) {
        delete currentItem.children;
      }
      this.subItem = item.children || [];
      if (this.subItem.length > 0) {
        this.currentSelect = [];
      }
      if (!this.canMultiple) {
        // 单选时更新选中的数据并传递到父组件上
        this.currentSelect = [];
        this.result = [currentItem];
        parent.updateResult([currentItem]);
        this.currentSelect.push(currentItem);
        // 选中的选项没有子选项时通知父组件是最后一个选项
        if (item.children && item.children.length > 0) {
          this.subItem = item.children;
          this.$emit('handleChoose', this.getParentSelect(), false, this.fromInit);
        } else {
          this.subItem = [];
          this.$emit('handleChoose', this.getParentSelect(), true, this.fromInit);
        }
      } else {
        // 多选
        const index = this.currentSelect.findIndex(x => x.value === currentItem.value);
        if (index !== -1 && this.currentSelect.length > 1) {
          this.currentSelect.splice(index, 1);
        } else if (index !== -1 && this.currentSelect.length <= 1) {
          this.currentSelect = [];
        } else {
          this.currentSelect.push(currentItem);
          this.$emit('handleChoose', this.getParentSelect(), false, this.fromInit);
        }
      }
    },
    chooseMulti() {
      // 将多选的数据向父组件传递，多选时必须选中一个数据，因为不支持任意选项可点击（即anyState字段在支持多选时是无效的）
      if (this.currentSelect.length) {
        this.$parent.updateResult([this.currentSelect]);
        this.$emit('handleChoose', this.getParentSelect(), true, false);
      }
    },
    getParentSelect(fromUser = true) {
      let parent = this.$parent;
      let i = 0;
      while (parent.$options.name !== 't-cascader') {
        parent = parent.$parent;
        i += 1;
      }
      // 获取父级选项组成的数组
      const [...parentResult] = fromUser ? parent.itemSelected : parent.selected;
      // 由于可多选时，只有点击确定时才更新选中的选项，所以不做处理
      // if (this.canMultiple) {
      //   return parentResult;
      // }
      return parentResult.slice(0, i);
    },
    clear() {
      this.subItem = [];
      this.result = [];
      this.currentSelect = [];
    },
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        // 判断数据是否是完全变化
        if (newVal.length !== oldVal.length || newVal[0].value !== oldVal[0].value) {
          this.subItem = [];
          this.currentSelect = [];
        }
        // 支持多选的前提是：当该级所有选项都没有子选项时才可以
        if (this.multiple) {
          for (let i = 0; i < newVal.length; i++) {
            if (newVal[i].children) {
              this.canMultiple = false;
              break;
            } else {
              this.canMultiple = true;
            }
          }
        }
        if (this.isLoadedChildren) {
          this.$emit('handleChoose', this.getParentSelect(), false);
          this.$nextTick(() => {
            this.broadcast('t-cascader-item', 'find-choose', {
              value: this.getParentSelect(),
              fromInit: this.fromInit,
            });
            this.fromInit = false;
          });
        }
        this.isLoadedChildren = false;
      },
      deep: true,
    },
    // 当选中的数据有变时将状态改为false
    currentSelect() {
      this.newSelect = false;
    },
    fromInit(val) {
      if (this.multiple && !val) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].children) {
            this.canMultiple = false;
            break;
          } else {
            this.canMultiple = true;
          }
        }
      }
    },
  },
  mounted() {
    if (this.multiple && !this.fromInit) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].children) {
          this.canMultiple = false;
          break;
        } else {
          this.canMultiple = true;
        }
      }
    }
    this.$on('find-choose', (params) => {
      const val = params.value;
      this.fromInit = params.fromInit;
      const values = [...val];
      this.currentSelect = [];
      if (!this.canMultiple) {
        for (let i = 0; i < values.length; i++) {
          for (let j = 0; j < this.data.length; j++) {
            if (values[i].value === this.data[j].value) {
              this.handlerSelectItem(this.data[j], this.fromInit);
              this.$nextTick(() => {
                values.splice(0, 1);
                this.broadcast('t-cascader-item', 'find-choose', {
                  value: values,
                  fromInit: this.fromInit,
                });
                this.fromInit = false;
              });
            }
          }
        }
      } else if (this.canMultiple && values && values.length) {
        if (this.fromInit) {
          for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < this.data.length; j++) {
              if (Object.prototype.toString.call(values[i]) === '[object Object]') {
                if (values[i].value === this.data[j].value) {
                  this.handlerSelectItem(this.data[j], true);
                  this.$nextTick(() => {
                    values.splice(0, 1);
                    this.broadcast('t-cascader-item', 'find-choose', {
                      value: values,
                      fromInit: this.fromInit,
                    });
                    this.fromInit = false;
                  });
                }
              } else {
                values[i].forEach((x) => {
                  if (x.value === this.data[j].value) {
                    this.handlerSelectItem(this.data[j]);
                  }
                });
              }
            }
          }
        } else {
          const [...multi] = values[0];
          for (let i = 0; i < multi.length; i++) {
            for (let j = 0; j < this.data.length; j++) {
              if (multi[i].value === this.data[j].value) {
                this.handlerSelectItem(this.data[j]);
                break;
              }
            }
          }
        }
      }
    });
  },
};
</script>
<style lang="less">
    .t-cascader-wrapper {
        display: inline-block;

        & ul {
              display: inline-block;
              min-width: 100px;
              height: 180px;
              margin: 0;
              padding: 5px 0!important;
              vertical-align: top;
              list-style: none;
              border-right: 1px solid #e8eaec;
              overflow: auto;
            z-index: 2000;
            max-height: 200px;
            background-color: #fff;
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
        }
        &-item {
             padding:6px 20px 6px 6px;
            line-height: 1.5;
             font-size:14px;
             cursor: pointer;
             position: relative;
            &:hover {
                background-color: #e5e5e5;
            }
        }
         &-more {
              position: absolute;
              right: 0;
          }
         & .is-select {
               color: #2db7f5;
         }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .ball-clip-rotate {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        margin: 2px;
        animation-fill-mode: both;
        border: 2px solid #2db7f5;
        border-bottom-color: transparent;
        background: transparent !important;
        display: inline-block;
        animation: rotate 0.75s 0s linear infinite;
    }
</style>
