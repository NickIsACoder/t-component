import Vue from 'vue/dist/vue';
import { shallowMount } from '@vue/test-utils';
import Tooltip from '../../../packages/tooltip/index';
import TooltipVue from '../../../packages/tooltip/tooltip';

describe('tooltip', () => {
  const triggerEvent = (elm, name, ...opts) => {
    let eventName;

    if (/^mouse|click/.test(name)) {
      eventName = 'MouseEvents';
    } else if (/^key/.test(name)) {
      eventName = 'KeyboardEvent';
    } else {
      eventName = 'HTMLEvents';
    }
    const evt = document.createEvent(eventName);

    evt.initEvent(name, ...opts);
    elm.dispatchEvent ? elm.dispatchEvent(evt) : elm.fireEvent(`on${name}`, evt);

    return elm;
  };
  beforeEach(() => {
    const el = document.querySelector('#app');
    if (!el) {
      const elm = document.createElement('div');
      elm.id = 'app';
      document.body.appendChild(elm);
    }
  });
  afterEach(() => {
    const el = document.querySelector('.t-tooltip');
    if (!el) return;
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    if (el.__vue__) {
      el.__vue__.$destroy();
    }
  });
  /* 全局引入 */
  it('打开tooltip，位置（topCenter)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'topCenter' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-50%, -100%)');
      done();
    }, 10);
  });
  it('打开tooltip，默认位置（topLeft)', (done) => {
    const elm = document.createElement('div');
    elm.id = 'app';
    document.body.appendChild(elm);
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, '1234');
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(0px, -100%)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（topRight)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'topRight', icon: 'icon-error', iconColor: 'red' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv.querySelector('.icon-error')).to.be.not.empty;
      expect(tooltipDiv.querySelector('.icon-error').style.color).to.eql('red');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-100%, -100%)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（leftTop)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'leftTop' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-100%, 0px)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（leftCenter)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'leftCenter' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-100%, -50%)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（leftBottom)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'leftBottom' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-100%, -100%)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（bottomLeft)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'bottomLeft' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.marginTop).to.be.eql('15px');
      done();
    }, 10);
  });
  it('打开tooltip，位置（bottomCenter)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'bottomCenter' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-50%, 0px)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（bottomRight)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @mouseout="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'bottomRight' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    triggerEvent(vm.$el, 'mouseout');
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.transform).to.be.eql('translate(-100%, 0px)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（rightTop)', (done) => {
    const Constructor = Vue.extend({
      template: '<input class="tooltip-btn" @keyup="openTooltip($event)"/>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'rightTop' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    triggerEvent(vm.$el, 'keyup');
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.marginLeft).to.be.eql('15px');
      done();
    }, 10);
  });
  it('打开tooltip，位置（rightCenter)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @mouseenter="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'rightCenter' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    triggerEvent(vm.$el, 'mouseenter');
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.marginLeft).to.be.eql('15px');
      expect(tooltipDiv.style.transform).to.be.eql('translate(0px, -50%)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（rightBottom)', (done) => {
    const Constructor = Vue.extend({
      template: '<input class="tooltip-input" @focus="openTooltip($event)"/>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: 'rightBottom' });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    triggerEvent(vm.$el, 'focus');
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.marginLeft).to.be.eql('15px');
      expect(tooltipDiv.style.transform).to.be.eql('translate(0px, -100%)');
      done();
    }, 10);
  });
  it('打开tooltip，位置（自定义)', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="tooltip-btn" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: '1234', position: { top: '50px', left: '30px' } });
        },
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      expect(tooltipDiv.style.top).to.be.eql('50px');
      expect(tooltipDiv.style.left).to.be.eql('30px');
      done();
    }, 10);
  });
  it('多个tooltip，', (done) => {
    const Constructor = Vue.extend({
      template: '<div class="tool-div"><button class="tooltip-btn"@click="openTooltip($event)">打开tooltip</button><button class="tooltip-btn2" ref="tooltipBtn" @click="openTooltip($event)">打开tooltip</button></div>',
      methods: {
        openTooltip(e) {
          Tooltip(e, { title: this.count += 1, position: { top: '100px', left: '30px' } });
        },
      },
      data() {
        return {
          count: 1,
        };
      },
    });
    const vm = new Constructor().$mount('#app');
    vm.$el.querySelector('.tooltip-btn').click();
    setTimeout(() => {
      const tooltipDiv = window.document.querySelector('.t-tooltip');
      expect(tooltipDiv).to.be.not.empty;
      vm.$el.querySelector('.tooltip-btn2').click();
      vm.$el.querySelector('.tooltip-btn').click();
      setTimeout(() => {
        expect(tooltipDiv.innerText.trim()).to.eql('4');
        vm.$el.click();
        done();
      }, 10);
    }, 10);
  });

  /* 单例引用 */
  it('单例引用', () => {
    const wrapper = shallowMount(TooltipVue, {
      propsData: {
        value: false,
        customTpl: '<span class="iconfont icon-error"></span>',
        refTarget: this,
      },
    });
    wrapper.setProps({
      value: true,
    });
    expect(wrapper.findAll('.icon-error').length).to.eql(1);
    expect(wrapper.isVisible()).to.be.true;
  });
});
