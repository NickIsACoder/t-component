import { shallowMount } from '@vue/test-utils';
import { Modal } from '../../../packages/index';

describe('Modal', () => {
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
  it('配置Modal的slot,并且通过close关闭', (done) => {
    const wrapper = shallowMount(Modal, {
      slots: {
        header: '<div class="title">这是标题</div>',
        body: '<div><input data-v-d74bed68="" type="text" id="1"></div>',
        footer: '<p>这是footer</p>',
      },
    });
    after(() => {
      if (wrapper) wrapper.destroy();
    });
    // 断言:Modal的header-slot渲染
    expect(wrapper.find('.t-modal .t-modal-content-header').exists()).to.equal(true);
    expect(wrapper.find('.t-modal .title').text()).to.equal('这是标题');
    // 断言:Modal的body-slot渲染
    expect(wrapper.find('.t-modal .t-modal-content-body').exists()).to.equal(true);
    expect(wrapper.find('.t-modal .t-modal-content-body input').exists()).to.equal(true);
    // 断言:Modal的footer-slot渲染
    expect(wrapper.find('.t-modal .t-modal-content-footer').exists()).to.equal(true);
    expect(wrapper.find('.t-modal .t-modal-content-footer p').text()).to.equal('这是footer');
    wrapper.find('.t-modal .icon-close').trigger('click');
    setTimeout(() => {
      expect(wrapper.vm.$el.querySelector('.t-modal').style.display).to.equal('none');
      done();
    }, 10);
  });
  it('测试close的回调', (done) => {
    const wrapper = shallowMount(Modal, {
      slots: {
        header: '<div class="title">这是标题</div>',
        body: '<div><input data-v-d74bed68="" type="text" id="1"></div>',
        footer: '<p>这是footer</p>',
      },
      propsData: {
        onClose: function(){
          wrapper.vm.$el.querySelector('input').value ='触发关闭啦啦啦';
        },
      },
    });
    after(() => {
      if (wrapper) wrapper.destroy();
    });
    wrapper.find('.t-modal .icon-close').trigger('click');
    setTimeout(() => {
      expect(wrapper.vm.$el.querySelector('.t-modal input').value).to.equal('触发关闭啦啦啦');
      expect(wrapper.vm.$el.querySelector('.t-modal').style.display).to.equal('none');
      done();
    }, 10);
  });
  it('测试禁止close', () => {
    const wrapper = shallowMount(Modal, {
      slots: {
        header: '<div class="title">这是标题</div>',
        body: '<div><input data-v-d74bed68="" type="text" id="1"></div>',
        footer: '<p>这是footer</p>',
      },
      propsData: {
        canClose: false,
      },
    });
    after(() => {
      if (wrapper) wrapper.destroy();
    });
    // 断言:关闭按钮不存在
    expect(wrapper.find('.t-modal .icon-close').exists()).to.equal(false);
  });
  it('测试隐藏backdrop并修改颜色', () => {
    const wrapper = shallowMount(Modal, {
      slots: {
        header: '<div class="title">这是标题</div>',
        body: '<div><input data-v-d74bed68="" type="text" id="1"></div>',
        footer: '<p>这是footer</p>',
      },
      propsData: {
        backdrop: false,
        backdropColor: '#76EEC6',
      },
    });
    after(() => {
      if (wrapper) wrapper.destroy();
    });
    // 断言:bakcdrop不显示
    expect(wrapper.vm.$el.querySelector('.t-modal .t-modal-backdrop').style.opacity).to.equal('0');
    // 断言:background
    expect(wrapper.vm.$el.querySelector('.t-modal .t-modal-backdrop').style.backgroundColor).to.equal('rgb(118, 238, 198)');
  });
});
