import { shallowMount } from '@vue/test-utils';
import { Badge } from '../../../packages/index';


describe('Badge', () => {
  let wrapper;
  afterEach(() => {
    if (wrapper)wrapper.destroy();
  });
  it('配置badge显示type类型为dot点', () => {
    wrapper = shallowMount(Badge, {
      propsData: {
        type: 'dot',
      },
    });
    expect(wrapper.find('.t-badge-dot').exists()).to.equal(true);
  });
  it('配置badge显示type类型为text文本', () => {
    wrapper = shallowMount(Badge, {
      propsData: {
        type: 'text',
      },
    });
    expect(wrapper.find('.t-badge-sup').exists()).to.equal(true);
  });
  // 暂时没有isShow功能
  // it('配置badge显示isShow.type类型为dot', () => {
  //   const wrapper = shallowMount(Badge, {
  //     propsData: {
  //       isShow: false,
  //       type: 'dot',
  //     },
  //   });
  //   expect(wrapper.find('.t-badge-dot').exists()).to.equal(false);
  // });
  // it('配置badge显示isShow.type类型为text', () => {
  //   const wrapper = shallowMount(Badge, {
  //     propsData: {
  //       isShow: false,
  //       type: 'text',
  //     },
  //   });
  //   expect(wrapper.find('.t-badge-sup').exists()).to.equal(false);
  // });
  // it('配置badge显示isShow.type类型为text', () => {
  //   const wrapper = shallowMount(Badge, {
  //     propsData: {
  //       isShow: false,
  //       type: 'text',
  //     },
  //   });
  //   expect(wrapper.find('.t-badge-sup').exists()).to.equal(false);
  // });
  it('配置badge显示type类型为text文本,content内容', () => {
    wrapper = shallowMount(Badge, {
      propsData: {
        type: 'text',
        content: '哈哈哈这是内容',
      },
    });
    expect(wrapper.find('.t-badge-sup').exists()).to.equal(true);
    expect(wrapper.find('.t-badge-sup').text()).to.equal('哈哈哈这是内容');
  });
});
