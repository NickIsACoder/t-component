import { shallowMount, mount } from '@vue/test-utils';
import Vue from 'vue/dist/vue';
import { Checkbox, CheckboxGroup } from '../../../packages/index';


describe('Checkbox', () => {
  let wrapper;
  afterEach(() => {
    if (wrapper)wrapper.destroy();
  });
  it('配置checkbox为不可选,填充内容,显示半选中状态', () => {
    wrapper = mount(Checkbox, {
      propsData: {
        value: '全选',
        disable: true,
        halfCheck: true,
      },
    });
    expect(wrapper.vm.value).to.equal('全选');
    expect(wrapper.contains('.is-disabled')).to.equal(true);
    expect(wrapper.contains('.is-halfCheck')).to.equal(true);
  });
  it('checkbox选中/取消选中', (done) => {
    wrapper = mount(Checkbox);
    wrapper.find('.t-checkbox input[type="checkbox"]').setChecked(true);
    setTimeout(() => {
      expect(wrapper.contains('.is-checked')).to.equal(true);
      wrapper.find('.t-checkbox input[type="checkbox"]').setChecked(false);
      setTimeout(() => {
        expect(wrapper.contains('.is-checked')).to.equal(false);
        done();
      }, 10);
    }, 10);
  });
});
describe('CheckboxGroup 一组CheckBox', () => {
  beforeEach(() => {
    const el = document.querySelector('#app');
    if (!el) {
      const elm = document.createElement('div');
      elm.id = 'app';
      document.body.appendChild(elm);
    }
  });
  it('多选,最多选2项', (done) => {
    const Constructor = Vue.extend({
      template: '<CheckboxGroup v-model="select" :max="2">' +
        '<Checkbox value="1"></Checkbox>' +
        '<Checkbox value="2"></Checkbox>' +
        '<Checkbox value="3"></Checkbox>' +
        '<Checkbox value="4"></Checkbox>' +
        '</CheckboxGroup>',
      data() {
        return {
          select: [],
        };
      },
      components: { Checkbox, CheckboxGroup },
    });
    const vm = new Constructor().$mount('#app');
    const checkboxItems = document.querySelectorAll('.t-checkbox-wrapper-input')
    setTimeout(() => {
      checkboxItems[0].click();
      expect(vm.select).to.eql(['1']);
      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.is-checked').length).to.equal(1);
        checkboxItems[1].click();
        expect(vm.select).to.eql(['1', '2']);
        setTimeout(() => {
          expect(vm.$el.querySelectorAll('.is-checked').length).to.equal(2);
          checkboxItems[2].click();
          expect(vm.select).to.eql(['1', '2']);
          setTimeout(() => {
            checkboxItems[1].click();
            expect(vm.select).to.eql(['1']);
            vm.$destroy && vm.$destroy();
            vm.$el &&
            vm.$el.parentNode &&
            vm.$el.parentNode.removeChild(vm.$el);
            done();
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  });
  it('多选,change', (done) => {
    const Constructor = Vue.extend({
      template: '<CheckboxGroup v-model="select" @change="val => changeData = val">' +
        '<Checkbox value="1"></Checkbox>' +
        '<Checkbox value="2"></Checkbox>' +
        '<Checkbox value="3"></Checkbox>' +
        '<Checkbox value="4"></Checkbox>' +
        '</CheckboxGroup>',
      data() {
        return {
          select: [],
          changeData: [],
        };
      },
      components: { Checkbox, CheckboxGroup },
    });
    const vm = new Constructor().$mount('#app');
    const checkboxItems = document.querySelectorAll('.t-checkbox-wrapper-input')
    setTimeout(() => {
      checkboxItems[0].click();
      expect(vm.select).to.eql(['1']);
      setTimeout(() => {
        expect(vm.$el.querySelectorAll('.is-checked').length).to.equal(1);
        expect(vm.changeData).to.eql(['1']);
        checkboxItems[1].click();
        expect(vm.select).to.eql(['1', '2']);
        vm.$destroy && vm.$destroy();
            vm.$el &&
            vm.$el.parentNode &&
            vm.$el.parentNode.removeChild(vm.$el);
            done();
      }, 10);
    }, 10);
  });
  it('多选,默认选中1', (done) => {
    const Constructor = Vue.extend({
      template: '<CheckboxGroup v-model="select">' +
        '<Checkbox value="1"></Checkbox>' +
        '<Checkbox value="2"></Checkbox>' +
        '<Checkbox value="3"></Checkbox>' +
        '<Checkbox value="4"></Checkbox>' +
        '</CheckboxGroup>',
      data() {
        return {
          select: ['1'],
        };
      },
      components: { Checkbox, CheckboxGroup },
    });
    const vm = new Constructor().$mount('#app');
    const checkboxItems = document.querySelectorAll('.t-checkbox-wrapper-input')
    setTimeout(() => {
      expect(vm.select).to.eql(['1']);
      expect(vm.$el.querySelectorAll('.is-checked').length).to.equal(1);
      checkboxItems[1].click();
      expect(vm.select).to.eql(['1', '2']);
      vm.$destroy && vm.$destroy();
      vm.$el &&
      vm.$el.parentNode &&
      vm.$el.parentNode.removeChild(vm.$el);
      done();
    }, 10);
  });
});
