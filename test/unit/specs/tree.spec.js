import { mount } from '@vue/test-utils';
import Vue from 'vue/dist/vue';
import { Tree } from '../../../packages/index';

describe('tree', () => {
  let wrapper;
  const treeData = () => [{
    value: 1,
    label: '一级 1',
    children: [{
      value: 11,
      label: '二级 1-1',
      children: [{
        value: 111,
        label: '三级 1-1',
      }, {
        value: 112,
        label: '三级 1-2',
      }],
    }],
  }, {
    value: 2,
    label: '一级 2',
    children: [{
      value: 21,
      label: '二级 2-1',
    }, {
      value: 22,
      label: '二级 2-2',
    }],
  }, {
    value: 3,
    label: '一级 3',
    children: [{
      value: 31,
      label: '二级 3-1',
    }, {
      value: 32,
      label: '二级 3-2',
    }],
  }];
  beforeEach(() => {
    wrapper = mount(Tree, {
      propsData: {
        data: treeData(),
      },
    });
  });
  it('创建一颗树,禁用【21,31】', (done) => {
    wrapper.setProps({
      disabledKeys: [21, 31],
    });
    const items = wrapper.findAll('.t-checkbox-wrapper input[type=checkbox]');
    setTimeout(() => {
      // 断言：禁用【21,31】
      expect(wrapper.findAll('input[type=checkbox]:disabled').length).to.equal(2);
      items.at(4).setChecked(true);
      expect(wrapper.emitted('check')[0]).to.eql([[{ value: 22, label: '二级 2-2' }]]);
      done();
    }, 10);
  });
  it('defaultExpandAll不展开树', (done) => {
    wrapper.setProps({
      defaultExpandAll: false,
    });
    setTimeout(() => {
      const items = wrapper.findAll({ name: 't-tree-item' });
      let visible = 0;
      for (let i = 0; i < items.length; i += 1) {
        if (items.at(i).isVisible()) {
          visible += 1;
        }
      }
      // 可见的组件个数要小于组件的个数
      expect(visible).to.be.below(items.length);
      done();
    }, 10);
  });
  it('选中【11,31,32,2】，选中状态的checkbox数量应大于等于4', (done) => {
    wrapper.setProps({
      defaultCheckedKeys: [11, 31, 32, 2],
    });
    setTimeout(() => {
      expect(wrapper.findAll('.is-checked').length).to.be.at.least(4);
      done();
    }, 10);
  });
  it('展开/折叠子节点', (done) => {
    const arrowSpan = wrapper.findAll('.t-tree-children-item-content .t-tree-children-item-arrow');
    arrowSpan.at(0).trigger('click');
    setTimeout(() => {
      expect(arrowSpan.at(0).html().indexOf('t-tree-children-item-arrow-open')).to.equal(-1);
      arrowSpan.at(0).trigger('click');
      setTimeout(() => {
        expect(arrowSpan.at(0).html()).to.include('t-tree-children-item-arrow-open');
        done();
      }, 10);
    }, 10);
  });
  it('隐藏多选框', (done) => {
    wrapper.setProps({
      showCheck: false,
    });
    setTimeout(() => {
      expect(wrapper.findAll('input[type=checkbox]').length).to.equal(0);
      done();
    }, 10);
  });
  it('点击选中某一节点(父子节点无关联)', (done) => {
    wrapper.setProps({
      anyState: true,
    });
    const items = wrapper.findAll('.t-checkbox-wrapper input[type=checkbox]');
    setTimeout(() => {
      items.at(5).setChecked(true);
      items.at(6).setChecked(true);
      expect(wrapper.emitted('check')[1]).to.eql([[{ value: 21, label: '二级 2-1' }, { value: 22, label: '二级 2-2' }]]);
      expect(wrapper.emitted('select')[1]).to.eql([{ value: 22, label: '二级 2-2' }]);
      done();
    }, 10);
  });
  it('点击选中某一节点(父子节点相关联)', (done) => {
    const items = wrapper.findAll('.t-checkbox-wrapper input[type=checkbox]');
    setTimeout(() => {
      items.at(5).setChecked(true);
      items.at(6).setChecked(true);
      expect(wrapper.emitted('check')[1]).to.eql([[{ value: 2, label: '一级 2' }, { value: 21, label: '二级 2-1' }, { value: 22, label: '二级 2-2' }]]);
      expect(wrapper.emitted('select')[1]).to.eql([{ value: 22, label: '二级 2-2' }]);
      done();
    }, 10);
  });
  it('选择叶子节点', (done) => {
    const items = wrapper.findAll('.t-checkbox-wrapper input[type=checkbox]');
    setTimeout(() => {
      items.at(2).setChecked(true);
      expect(wrapper.emitted('check')[0]).to.eql([[{ value: 111, label: '三级 1-1' }]]);
      expect(wrapper.findAll('.is-halfCheck').length).to.equal(2);
      expect(wrapper.findAll('.is-checked').length).to.equal(1);
      done();
    }, 10);
  });
  it('选择节点/1、选中二级--》取消一级；2、选中某一节点---》取消某一节点；', (done) => {
    const items = wrapper.findAll('.t-checkbox-wrapper input[type=checkbox]');
    setTimeout(() => {
      items.at(1).setChecked(true);
      items.at(0).setChecked(false);
      expect(wrapper.emitted('check')[1]).to.eql([[]]);
      expect(wrapper.findAll('.is-halfCheck').length).to.equal(0);
      expect(wrapper.findAll('.is-checked').length).to.equal(0);
      setTimeout(() => {
        items.at(2).setChecked(true);
        expect(wrapper.findAll('.is-checked').length).to.equal(1);
        items.at(2).setChecked(false);
        expect(wrapper.emitted('check')[2]).to.eql([[{ value: 111, label: '三级 1-1' }]]);
        expect(wrapper.findAll('.is-checked').length).to.equal(0);
        expect(wrapper.emitted('check')[3]).to.eql([[]]);
        done();
      }, 10);
    }, 10);
  });
  it('自定义显示', () => {
    wrapper.setProps({
      displayMethod: val => `${val.value}---${val.label}`,
    });
    const spanLabel = wrapper.findAll('.t-tree-children-item-text');
    expect(spanLabel.at(0).text()).to.equal('1---一级 1');
  });
  it('节点异步渲染（有子节点）', (done) => {
    const Constructor = Vue.extend(Tree);
    const vm = new Constructor({
      propsData: {
        data: [{
          value: 1,
          label: '一级 1',
          loading: false,
        }],
        loadData: (item, callback) => {
          const data = [
            { value: 111, label: '三级 1-1', children: [] },
            { value: 112, label: '三级 1-2' },
          ];
          callback(data);
        },
      },
    }).$mount();
    const arrow = vm.$el.querySelector('.t-tree-children-item-arrow');
    arrow.click();
    window.setTimeout(() => {
      expect(vm.$el.querySelectorAll('.t-tree-children-item').length).to.equal(3);
      done();
    }, 1000);
  });
  it('节点异步渲染（没有子节点）', (done) => {
    const Constructor = Vue.extend(Tree);
    const vm = new Constructor({
      propsData: {
        data: [{
          value: 1,
          label: '一级 1',
          loading: false,
        }],
        loadData: (item, callback) => {
          const data = [];
          callback(data);
        },
      },
    }).$mount();
    const arrow = vm.$el.querySelector('.t-tree-children-item-arrow');
    arrow.click();
    window.setTimeout(() => {
      expect(vm.$el.querySelectorAll('.t-tree-children-item').length).to.equal(1);
      done();
    }, 1000);
  });
  it('节点过滤', (done) => {
    wrapper.setProps({
      showSearch: true,
      resultFilter: (value, data) => {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    });
    wrapper.vm.filter('一级');
    setTimeout(() => {
      const itemWrappers = wrapper.findAll({ name: 't-tree-item' });
      const showWrap = itemWrappers.filter(x => x.isVisible() === true);
      expect(showWrap.length).to.equal(3);
      wrapper.vm.filter('');
      wrapper.vm.filter('二级 3-1');

      setTimeout(() => {
        const items = wrapper.findAll({ name: 't-tree-item' });
        const wraps = items.filter(x => x.isVisible() === true);
        expect(wraps.length).to.equal(2);
        done();
      }, 10);
    }, 10);
  });
});
