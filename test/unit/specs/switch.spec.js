import { shallowMount } from '@vue/test-utils';
import { Switch } from '../../../packages/index';


const factory = (values = {}) => shallowMount(Switch, values);

describe('switch', () => {
  it('正常渲染', () => {
    const wrapper = factory();
    expect(wrapper.props().value).to.equal(false);
    expect(wrapper.props().disable).to.equal(false);
    expect(wrapper.props().type).to.equal('default');
    expect(wrapper.props().size).to.equal('normal');
    expect(wrapper.props().activeValue).to.equal(true);
    expect(wrapper.props().inactiveValue).to.equal(false);
  });
  it('禁用时，按钮是否为禁用状态，点击是否有效', () => {
    const wrapper = factory();
    wrapper.setProps({ disable: true });
    const clickDiv = wrapper.find('.t-switch');
    const clickBeforeValue = wrapper.find('input[type=hidden]').value;
    // 触发点击事件
    clickDiv.trigger('click');
    setTimeout(() => {
      const clickAfterValue = wrapper.find('input[type=hidden]').value;
      // 断言：是否包含t-switch-disabled样式
      expect(wrapper.classes()).to.contains('t-switch-disabled');
      // 断言：是否是禁用状态
      expect(wrapper.vm.disable).to.equal(true);
      // 断言：点击后是否有触发事件改变value
      expect(clickBeforeValue).to.equal(clickAfterValue);
    }, 100);
  });
  it('点击时是否有改变value的值', (done) => {
    const wrapper = factory({
      propsData: {
        activeValue: 1,
        inactiveValue: 0,
        value: 1,
        disable: false,
      },
    });
    const clickSwicth = wrapper.find('.t-switch');
    const clickBeforeValue = wrapper.vm.$data.currentValue;
    // 触发点击事件
    clickSwicth.trigger('click');
    setTimeout(() => {
      const clickAfterValue = wrapper.vm.$data.currentValue;
      // 断言：点击后是否有触发事件改变value
      expect(clickBeforeValue).to.equal(1);
      // 断言：点击后是否有触发事件改变value
      expect(clickAfterValue).to.equal(0);
      done();
    }, 100);
  });
  it('$emit事件是否有触发到', () => {
    const wrapper = factory();
    const clickSwicth = wrapper.find('.t-switch');
    clickSwicth.trigger('click');
    // 断言：点击click事件后传true给change
    expect(wrapper.emitted('change')[0]).to.eql([true]);
  });
  it('value值改变是否触发到watch部分的代码', (done) => {
    const wrapper = factory({
      propsData: {
        activeValue: 1,
        inactiveValue: 0,
        value: 0,
      },
    });
    setTimeout(() => {
      wrapper.setProps({ value: 1 });
      expect(wrapper.vm.value).to.equal(1);
      setTimeout(() => {
        wrapper.setProps({ value: 0 });
        expect(wrapper.vm.value).to.equal(0);
        done();
      }, 10);
    }, 10);
  });
  it('slot内容是否正常渲染', (done) => {
    const wrapper = factory({
      slots: {
        openText: '<span>open</span>',
        closeText: '<span>close</span>',
      },
    });
    expect(wrapper.find('.t-switch-label span').text()).to.eql('close');
    setTimeout(() => {
      wrapper.setProps({ value: true });
      expect(wrapper.find('.t-switch-label span').text()).to.eql('open');
      done();
    }, 100);
  });
});
