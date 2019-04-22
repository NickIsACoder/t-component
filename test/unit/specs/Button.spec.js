import { shallowMount } from '@vue/test-utils';
import { Button } from '../../../packages/index';


describe('Button', () => {
  let wrapper;
  afterEach(() => {
    if (wrapper)wrapper.destroy();
  });
  it('配置Button参数size:small,type:primary,disable:true', () => {
    wrapper = shallowMount(Button, {
      propsData: {
        size: 'small',
        type: 'primary',
        disable: true,
      },
    });
    expect(wrapper.find('.t-btn-small').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-primary').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-primary').attributes().disabled).to.equal('disabled');
    // expect(wrapper.find('.t-backtop').trigger('click')).to.throw();
  });
  it('配置Button参数size:normal,type:warning,icon:icon-ios-arrow-back', () => {
    wrapper = shallowMount(Button, {
      propsData: {
        size: 'normal',
        type: 'warning',
        icon: 'icon-ios-arrow-back',
      },
    });
    expect(wrapper.find('.t-btn-normal').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-warning').exists()).to.equal(true);
    expect(wrapper.find('.t-btn').html()).to.equal('<button class="t-btn t-btn-warning t-btn-normal"><i class="iconfont icon-ios-arrow-back"></i> <span></span></button>');
  });
  it('配置Button参数size:large,type:danger,shape:ellipse', () => {
    wrapper = shallowMount(Button, {
      propsData: {
        size: 'large',
        type: 'danger',
        shape: 'ellipse',
      },
    });
    expect(wrapper.find('.t-btn-large').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-danger').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-ellipse').exists()).to.equal(true);
  });
  it('配置Button参数,默认size,type:success,shape:circle', () => {
    wrapper = shallowMount(Button, {
      propsData: {
        type: 'success',
        shape: 'circle',
      },
    });
    expect(wrapper.find('.t-btn-success').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-circle').exists()).to.equal(true);
  });
  it('配置Button参数,默认size,默认shape,type:info', () => {
    wrapper = shallowMount(Button, {
      propsData: {
        type: 'info',
      },
    });
    expect(wrapper.find('.t-btn-info').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-normal').exists()).to.equal(true);
  });
  it('配置Button参数,默认size,默认shape,type:t-btn-text', () => {
    wrapper = shallowMount(Button, {
      propsData: {
        type: 'text',
      },
    });
    expect(wrapper.find('.t-btn-text').exists()).to.equal(true);
    expect(wrapper.find('.t-btn-normal').exists()).to.equal(true);
  });
});
