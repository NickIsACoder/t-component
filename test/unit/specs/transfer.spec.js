import { mount } from '@vue/test-utils';
import { Transfer } from '../../../packages/index';

describe('transfer', () => {
  let wrapper;
  const getTestData = () => {
    const data = [];
    for (let i = 0; i <= 15; i++) {
      data.push({
        value: i,
        label: `备选项${i}`,
        disabled: i % 4 === 0,
      });
    }
    return data;
  };
  beforeEach(() => {
    wrapper = mount(Transfer, {
      propsData: {
        source: getTestData(),
      },
      sync: false,
    });
  });
  it('v-model传值，目标列表是否有正常渲染数据', (done) => {
    wrapper.setProps({
      value: [1, 5],
    });
    setTimeout(() => {
      // 断言：
      expect(wrapper.vm.rightData.length).to.equal(2);
      expect(wrapper.vm.rightData).to.eql([
        { value: 1, label: '备选项1', disabled: false },
        { value: 5, label: '备选项5', disabled: false },
      ]);
      done();
    }, 10);
  });
  it('触发全选/取消全选左边的数据', (done) => {
    wrapper.setProps({
      value: [1, 5],
    });
    const selectAllWrapper = wrapper.findAll('.t-transfer-list-header');
    setTimeout(() => {
      // 触发左边全选
      selectAllWrapper.at(0).trigger('click');
      expect(wrapper.vm.$children[0].checkAll).to.equal(true);
      setTimeout(() => {
        expect(wrapper.findAll('.is-checked').length).to.equal(11);
        expect(wrapper.vm.leftSelect).to.eql([2, 3, 6, 7, 9, 10, 11, 13, 14, 15]);
        selectAllWrapper.at(0).trigger('click');
        expect(wrapper.vm.$children[0].checkAll).to.equal(false);
        setTimeout(() => {
          expect(wrapper.findAll('.is-checked').length).to.equal(0);
          done();
        }, 10);
      }, 10);
    }, 10);
  });

  it('选择左边某一数据转移到右边', (done) => {
    setTimeout(() => {
      const checkboxItem = wrapper.findAll('.t-transfer-list-body-item input[type="checkbox"]');
      checkboxItem.at(3).setChecked(true);
      setTimeout(() => {
        // 断言：选中的数据
        expect(wrapper.vm.leftSelect).to.eql([3]);
        const changeToRightButton = wrapper.findAll({ name: 't-button' });
        // 点击触发向右转移事件
        changeToRightButton.at(0).trigger('click');
        // 断言：是否触发change事件并传选中的数据
        // expect(wrapper.emitted('change')[0]).to.eql([[3]]);
        done();
      }, 10);
    }, 10);
  });

  it('选择右边某一数据转移到左边', (done) => {
    wrapper.setProps({ value: [1, 3] });
    setTimeout(() => {
      const checkboxItem = wrapper.findAll('.t-transfer-list-body-item input[type="checkbox"]');
      const checkboxLen = checkboxItem.length;
      checkboxItem.at(checkboxLen - 2).setChecked(true);
      setTimeout(() => {
        // 断言：选中的数据
        expect(wrapper.vm.rightSelect).to.eql([1]);
        const changeToRightButton = wrapper.findAll({ name: 't-button' });
        // 点击触发向右转移事件
        changeToRightButton.at(1).trigger('click');
        // 断言：是否触发change事件并传选中的数据
        // expect(wrapper.emitted('change')[0]).to.eql([[3]]);
        done();
      }, 10);
    }, 10);
  });

  it('左右各选中一个数据，只触发一个方法', (done) => {
    wrapper.setProps({ value: [6, 10, 12] });

    setTimeout(() => {
      const checkboxItem = wrapper.findAll('.t-transfer-list-body-item input[type="checkbox"]');
      checkboxItem.at(3).setChecked(true);
      checkboxItem.at(checkboxItem.length - 2).setChecked(true);
      checkboxItem.at(checkboxItem.length - 1).setChecked(true);
      setTimeout(() => {
        expect(wrapper.vm.$children[0].dataSelect.length).to.equal(1);
        // 断言：右边选中的数据只有一个，disabled为true的数据无法触发选中
        expect(wrapper.vm.$children[3].dataSelect.length).to.equal(1);
        const changeToRightButton = wrapper.findAll({ name: 't-button' });
        // 点击触发向右转移事件
        changeToRightButton.at(0).trigger('click');
        done();
      }, 10);
    }, 10);
  });

  it('displayMethod自定义显示', (done) => {
    wrapper.setProps({ displayMethod: val => `${val.value}----${val.label}` });
    setTimeout(() => {
      const spanLabel = wrapper.findAll('.t-checkbox-label');
      expect(spanLabel.at(2).text()).to.equal('2----备选项2');
      done();
    }, 10);
  });
});
