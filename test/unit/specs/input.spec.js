import { shallowMount } from '@vue/test-utils';
import { Input } from '../../../packages/index';


describe('Input', () => {
  let wrapper;
  afterEach(() => {
    if (wrapper)wrapper.destroy();
  });
  it('配置输入框value为"输入值",type为text,maxLength,minLength,只读readonly,配置正则validate,报错语句', () => {
    wrapper = shallowMount(Input);
    wrapper.setProps({
      value: 'sastif',
      type: 'text',
      maxLength: 6,
      minLength: 2,
      readonly: true,
      validate: /[-a-z]/,
      errorMessage: {
        color: '#4bcd1e',
        text: '请输入英文',
      },
    });
    // 断言:model的值为'输入值'
    expect(wrapper.vm.$el.querySelector('input').value).to.equal('sastif');
    // 断言输入框类型为input
    expect(wrapper.find('.t-input').attributes().type).to.equal('text');
    // 断言:最大长度为6
    expect(wrapper.find('.t-input').attributes().maxlength).to.equal('6');
    // 断言:最小长度为2,没有写方法限制,暂时屏蔽
    expect(wrapper.find('.t-input').attributes().minlength).to.equal('2');
    // 断言:readonly
    expect(wrapper.find('.t-input').attributes().readonly).to.equal('readonly');
    // 断言:匹配正则
    wrapper.find('.t-input').setValue('124444');
    expect(wrapper.find('.t-input-error').exists()).to.equal(true);
    // 断言:报错提示语
    expect(wrapper.find('.t-input-error').text()).to.equal('请输入英文');
  });
  it('配置输入框size为small,disable,placeholder,autofocus', () => {
    wrapper = shallowMount(Input);
    wrapper.setProps({
      size: 'small',
      disable: true,
      placeholder: '请输入姓名',
      autofocus: true,
      clearable: true,
    });
    const inputElm = wrapper.vm.$el.querySelector('input');
    // 断言:input的大小
    expect(wrapper.find('.t-input-wrapper-small').exists()).to.equal(true);
    // 断言:placeholder
    expect(wrapper.find('.t-input').attributes().placeholder).to.equal('请输入姓名');
    // 断言:disabled
    expect(wrapper.find('.t-input').attributes().disabled).to.equal('disabled');
    // 断言:鼠标聚焦
    expect(wrapper.find('.t-input').attributes().autofocus).to.equal('autofocus');
  });
  it('配置输入框size为large,type为number,max为10,min为5', () => {
    wrapper = shallowMount(Input);
    wrapper.setProps({
      size: 'large',
      type: 'number',
      max: 10,
      min: 5,
    });
    // 断言:input的大小
    expect(wrapper.find('.t-input-large').exists()).to.equal(true);
    // 断言输入框类型为number
    expect(wrapper.find('.t-input').attributes().type).to.equal('number');
    // 断言:最大数字为10
    expect(wrapper.find('.t-input').attributes().max).to.equal('10');
    // 断言:最小数字为5
    expect(wrapper.find('.t-input').attributes().min).to.equal('5');
  });
  it('配置输入框type为textarea,rows为10,cols为5', () => {
    wrapper = shallowMount(Input);
    wrapper.setProps({
      type: 'textarea',
      rows: 10,
      cols: 5,
    });
    const areaInput = wrapper.find('.t-textarea');
    // textarea
    expect(areaInput.exists()).to.equal(true);
    // 断言:rows为10
    expect(areaInput.attributes().rows).to.equal('10');
    // 断言:cols为5
    expect(areaInput.attributes().cols).to.equal('5');
  });
  it('配置输入框左边带icon', () => {
    let iconWrapper;
    afterEach(() => {
      if (iconWrapper)iconWrapper.destroy();
    });
    // beforeEach(() => {
    iconWrapper = shallowMount(Input, {
      slots: {
        leftIcon: '<i class="iconfont icon-add"></i>',
      },
    });
    // });
    // setTimeout(() => {
    // 断言:具名插槽是否存在
    expect(iconWrapper.find('.icon-add').exists()).to.equal(true);
    // }, 20);
  });
  it('配置输入框右边带icon', () => {
    let iconWrapper;
    afterEach(() => {
      if (iconWrapper)iconWrapper.destroy();
    });
    // beforeEach(() => {
    iconWrapper = shallowMount(Input, {
      slots: {
        rightIcon: '<i class="iconfont icon-add"></i>',
      },
    });
    // });
    // setTimeout(() => {
    // 断言:具名插槽是否存在
    expect(iconWrapper.find('.icon-add').exists()).to.equal(true);
    // }, 20);
  });
  it('测试change事件,返回变化之后的数组', () => {
    wrapper = shallowMount(Input);
    wrapper.vm.$emit('change', '这是内容');
    expect(wrapper.emitted().change.length).to.equal(1);
  });
  it('测试focus事件,返回变化之后的数组', () => {
    wrapper = shallowMount(Input);
    wrapper.vm.$emit('focus', '聚焦了!');
    expect(wrapper.emitted().focus.length).to.equal(1);
  });
  it('测试input事件,返回变化之后的数组', () => {
    wrapper = shallowMount(Input);
    wrapper.vm.$emit('input', '输入了!');
    expect(wrapper.emitted().input.length).to.equal(1);
  });
  it('测试blur事件,返回变化之后的数组', () => {
    wrapper = shallowMount(Input);
    wrapper.vm.$emit('blur', '失焦了!');
    expect(wrapper.emitted().blur.length).to.equal(1);
  });
  it('测试keyup事件,返回变化之后的数组', () => {
    wrapper = shallowMount(Input);
    wrapper.vm.$emit('keyup', '键盘回弹了!');
    expect(wrapper.emitted().keyup.length).to.equal(1);
  });
  it('测试enter事件,返回变化之后的数组', () => {
    wrapper = shallowMount(Input);
    wrapper.vm.$emit('enter', 'enter了!');
    expect(wrapper.emitted().enter.length).to.equal(1);
  });
});

