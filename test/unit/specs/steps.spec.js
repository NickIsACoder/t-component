import Vue from 'vue/dist/vue';
import { Steps, Step } from '../../../packages/index';

describe('Steps', () => {
  it('创建steps', () => {
    const Constructor = Vue.extend({
      template: `<div>
        <steps :active="0">
          <step title="开始" description="输入密码"></step>
          <step title="开始" description="输入密码"></step>
          <step title="开始" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
    });
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('.t-step').length).to.equal(3);
  });
  it('纵向的steps', () => {
    const Constructor = Vue.extend({
      template: `<div>
        <steps :active="0" direction="vertical">
          <step title="开始" description="输入密码"></step>
          <step title="开始" description="输入密码"></step>
          <step title="开始" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
    });
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.t-step-mainbox-v')).to.be.not.empty;
  });
  it('横向的steps变纵向', (done) => {
    const Constructor = Vue.extend({
      template: `<div>
        <steps :active="0" :direction="direction">
          <step title="开始" description="输入密码"></step>
          <step title="开始" description="输入密码"></step>
          <step title="开始" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
      data() {
        return {
          direction: 'horizontal',
        };
      },
    });
    const vm = new Constructor().$mount();
    vm.direction = 'vertical';
    setTimeout(() => {
      expect(vm.$el.querySelectorAll('.t-step-mainbox-v').length).to.equal(3);
      done();
    }, 10);
  });
  it('步骤2', () => {
    const Constructor = Vue.extend({
      template: `<div>
        <steps :active="1" direction="vertical" status="process">
          <step title="步骤1"  description="输入密码"></step>
          <step title="步骤2" description="输入密码"></step>
          <step title="步骤3" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
    });
    const vm = new Constructor().$mount();
    const numberClasses = vm.$el.querySelectorAll('.number');
    expect(numberClasses.length).to.equal(2);
    expect(numberClasses[0].innerText).to.eql('2');
    expect(numberClasses[1].innerText).to.eql('3');
  });
  it('步骤3的状态为process', () => {
    const Constructor = Vue.extend({
      template: `<div>
        <steps :active="active" :useNumber="false" direction="vertical" :status="status">
          <step title="步骤1" icon="icon-error" description="输入密码"></step>
          <step title="步骤2" description="输入密码"></step>
          <step title="步骤3" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
      data() {
        return {
          active: 2,
          status: 'process',
        };
      },
    });
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('.icon-hourglass').length).to.equal(1);
  });
  it('步骤3的状态为wait', () => {
    const Constructor = Vue.extend({
      template: `<div>
        <steps :active="active" :useNumber="false" direction="vertical" :status="status">
          <step title="步骤1" icon="icon-error" description="输入密码"></step>
          <step title="步骤2" description="输入密码"></step>
          <step title="步骤3" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
      data() {
        return {
          active: 2,
          status: 'wait',
        };
      },
    });
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('.icon-more').length).to.equal(1);
  });
  it('步骤3的状态为error', () => {
    const Constructor = Vue.extend({
      template: `<div style="width: 400px; height: 500px;">
        <steps :active="active" :useNumber="false" direction="vertical" :status="status">
          <step title="步骤1" icon="icon-error" description="输入密码"></step>
          <step title="步骤2" description="输入密码"></step>
          <step title="步骤3" description="输入密码"></step>
        </steps></div>`,
      components: { Steps, Step },
      data() {
        return {
          active: 2,
          status: 'error',
        };
      },
    });
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelectorAll('.icon-error-line').length).to.equal(1);
  });
});
