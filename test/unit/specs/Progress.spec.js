import { mount } from '@vue/test-utils';
import { Progress } from '../../../packages/index';

describe('Progress', () => {
  // let vm;
  // afterEach(() => {
  //   const el = document.querySelector('.t-loading');
  //   if (!el) return;

  //   if (el.parentNode) {
  //     el.parentNode.removeChild(el);
  //   }
  //   if (el.__vue__) {
  //     el.__vue__.$destroy();
  //   }
  // });
  it('测试Progress的line配置', () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 20,
        type: 'line',
        color: 'blue',
        strokeWidth: 15,
        showInfo: true,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:line正常显示
    expect(wrapper.find('.t-progress-line').exists()).to.be.equal(true);
    //  断言:line的颜色
    expect(wrapper.vm.$el.querySelector('.t-progress-line-inner').children[0].style.backgroundColor).to.be.equal('blue');
    //  断言:当前进度数显示
    expect(wrapper.find('.t-progress-text').text()).to.be.include('20');
    //  断言:进度条的高度
    expect(wrapper.vm.$el.querySelector('.t-progress-line-inner').children[0].style.height).to.be.equal('15px');
  });
  it('测试Progress的circle配置', () => {
    const wrapper = mount(Progress, {
      propsData: {
        percent: 100,
        type: 'circle',
        color: 'red',
        strokeWidth: 15,
        showInfo: true,
        width: 200,
      },
    });
    after(() => {
      if (wrapper)wrapper.destroy();
    });
    //  断言:circle正常显示
    expect(wrapper.find('.t-progress-circle').exists()).to.be.equal(true);
    //  断言:circle的颜色
    expect(wrapper.vm.$el.querySelector('#progress').getAttribute('stroke')).to.be.equal('red');
    //  断言:当前进度数显示
    expect(wrapper.find('.t-progress-text').text()).to.be.include('100');
    //  断言:circle显示的直径
    expect(wrapper.vm.$el.querySelector('.t-progress-circle svg').getAttribute('width')).to.be.include('200');
  });
});
