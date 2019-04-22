import { shallowMount } from '@vue/test-utils';
import { Select } from '../../../packages/index';

describe('Select', () => {
  const getSelectOptions = () => [
    { value: 1, label: '123' },
    { value: 11, label: '1123' },
    { value: 21, label: '12123' },
    { value: 31, label: '21123' },
    { value: 41, label: '32123' },
    { value: 331, label: '221123' },
    { value: 431, label: '121123' },
    { value: 531, label: '321123' },
  ];
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Select, {
      propsData: {
        options: getSelectOptions(),
      },
    });
  });
  it('正常默认渲染', () => {
    const header = wrapper.find('.t-select-header');
    header.trigger('click');
    expect(wrapper.find('.t-select-dropdown').isVisible()).to.be.true;
  });
  it('单选', (done) => {
    wrapper.setProps({
      placeholder: '请选择一个数据',
    });
    expect(wrapper.find('.t-select-placeholder').text()).to.eql('请选择一个数据');
    const header = wrapper.find('.t-select-header');
    header.trigger('click');
    const items = wrapper.findAll('.t-select-dropdown-item');
    items.at(2).trigger('click');
    setTimeout(() => {
      expect(wrapper.find('.t-select-selected-value').text()).to.eql('12123');
      expect(wrapper.vm.values).to.eql([{ value: 21, label: '12123' }]);
      expect(wrapper.emitted('input')[2]).to.eql([[{ value: 21, label: '12123' }]]);
      done();
    }, 10);
  });
  it('输入搜索，单选', (done) => {
    wrapper.setProps({
      canInput: true,
    });
    const input = wrapper.find('.t-select-input');
    expect(input.isVisible()).to.be.true;
    const header = wrapper.find('.t-select-header');
    header.trigger('click');
    // input.trigger('focus');
    input.trigger('focus');
    setTimeout(() => {
      wrapper.vm.inputValue = '321123';
      const items = wrapper.findAll('.t-select-dropdown-item');
      const showWrap = items.filter(x => x.isVisible() === true);
      expect(showWrap.length).to.equal(1);
      showWrap.at(0).trigger('click');
      expect(wrapper.vm.values).to.eql([{ value: 531, label: '321123' }]);
      input.trigger('blur');
      input.trigger('keyup');
      wrapper.find('.icon-error').trigger('click');
      expect(wrapper.vm.values.length).to.equal(0);
      done();
    }, 10);
  });
  it('多选', (done) => {
    wrapper.setProps({
      multiple: true,
    });
    expect(wrapper.find('.dis-inline').isVisible()).to.be.true;
    const header = wrapper.find('.t-select-header');
    header.trigger('click');
    setTimeout(() => {
      const items = wrapper.findAll('.t-select-dropdown-item');
      items.at(0).trigger('click');
      items.at(2).trigger('click');
      // 断言： 选中了两条数据
      expect(wrapper.vm.values.length).to.equal(2);
      // 点击已选中的一条数据
      items.at(0).trigger('click');
      // 断言：取消了第一条数据，目前只选中1条数据
      expect(wrapper.vm.values.length).to.equal(1);
      const deleteItems = wrapper.findAll('.t-select-multi-text .icon-error');
      // 触发显示选中的数据的X取消选中该数据
      deleteItems.at(0).trigger('click');
      // 断言：取消选中该数据，目前选中0条数据
      expect(wrapper.vm.values.length).to.equal(0);
      done();
    }, 10);
  });
  it('搜索，多选', (done) => {
    wrapper.setProps({
      multiple: true,
      canInput: true,
    });
    const header = wrapper.find('.t-select-header');
    header.trigger('click');
    setTimeout(() => {
      wrapper.vm.inputValue = '1123';
      expect(wrapper.vm.selectOptions.length).to.equal(5);
      wrapper.findAll('.t-select-dropdown-item').at(2).trigger('click');
      // 断言：选中了某一条数据后，input的内容清空
      expect(wrapper.vm.inputValue).to.equal('');
      done();
    }, 10);
  });
  it('自定义显示', (done) => {
    wrapper.setProps({
      displayMethod: 'value',
    });
    setTimeout(() => {
      expect(wrapper.findAll('.t-select-dropdown-item').at(2).text()).to.eql('21');
      done();
    }, 10);
  });
  it('自定义显示', (done) => {
    wrapper.setProps({
      displayMethod: val => `${val.value}---${val.value}`,
    });
    setTimeout(() => {
      expect(wrapper.findAll('.t-select-dropdown-item').at(2).text()).to.eql('21---21');
      wrapper.findAll('.t-select-dropdown-item').at(2).trigger('click');
      done();
    }, 10);
  });
  it('禁用选择', () => {
    wrapper.setProps({
      disable: true,
      canInput: true,
    });
    const header = wrapper.find('.t-select-header');
    header.trigger('click');
    expect(wrapper.find('.t-select-dropdown').isVisible()).to.be.false;
  });
});
