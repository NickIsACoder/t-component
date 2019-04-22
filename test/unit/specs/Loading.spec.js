import Vue from 'vue/dist/vue';
import Loading from '../../../packages/loading/index';

describe('Loading', () => {
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
  it('测试全局使用loading开启关闭', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.open();
        },
        closeLoading() {
          Loading.close();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:图层遮罩显示
      expect(window.document.querySelector('.t-loading-backdrop').style.opacity).to.equal('0.4');
      // 断言:loading默认文字;
      expect(window.document.querySelector('.t-loading-title').innerText).to.equal('加载中...');
      vm.closeLoading();
      setTimeout(() => {
        // 断言:loading为关闭状态
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试Loading配置backdrop,backdropColor,title,icon,duration', (done) => {
    const Constructor2 = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.config({
            backdrop: false,
            backdropColor: '#76EEC6',
            title: '拼命查询中...',
            icon: 'win8',
            duration: 0.2 }).open();
        },
      },
    });
    const vm = new Constructor2().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:图层遮罩不显示
      expect(window.document.querySelector('.t-loading-backdrop').style.opacity).to.equal('0');
      // 断言:图层遮罩颜色为#808080;
      expect(window.document.querySelector('.t-loading-backdrop').style.backgroundColor).to.equal('rgb(118, 238, 198)');
      // 断言:loading文字;
      expect(window.document.querySelector('.t-loading-title').textContent).to.equal('拼命查询中...');
      // 断言:loading的icon类型;
      expect(window.document.querySelector('.windows8')).to.not.be.empty;
      // 断言自动关闭时间
      setTimeout(() => {
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 200);
    }, 10);
  });
  it('测试Loading配置icon类型为ballqueue', (done) => {
    const Constructor3 = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.config({ icon: 'ballqueue', duration: 0.2 }).open();
        },
      },
    });
    const vm = new Constructor3().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:loading的icon类型;
      expect(window.document.querySelector('.cssload-container')).to.not.be.empty;
      // 断言自动关闭时间
      setTimeout(() => {
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 400);
    }, 10);
  });
  it('测试Loading配置icon类型为circle3', (done) => {
    const Constructor4 = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.config({ icon: 'circle3', duration: 0.2 }).open();
        },
      },
    });
    const vm = new Constructor4().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:loading的icon类型;
      expect(window.document.querySelector('#circleG')).to.not.be.empty;
      // 断言自动关闭时间
      setTimeout(() => {
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 200);
    }, 10);
  });
  it('测试Loading配置icon类型为walkSquare', (done) => {
    const Constructor5 = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.config({ icon: 'walkSquare', duration: 0.2 }).open();
        },
      },
    });
    const vm = new Constructor5().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:loading的icon类型;
      expect(window.document.querySelector('.cssload-box-loading')).to.not.be.empty;
      // 断言自动关闭时间
      setTimeout(() => {
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 500);
    }, 10);
  });
  it('测试Loading配置icon类型为ballring', (done) => {
    const Constructor2 = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.config({ icon: 'ballring', duration: 0.2 }).open();
        },
      },
    });
    const vm = new Constructor2().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:loading的icon类型;
      expect(window.document.querySelector('#bowlG')).to.not.be.empty;
      // 断言自动关闭时间
      setTimeout(() => {
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 200);
    }, 10);
  });
  it('测试Loading配置icon类型为stripper', (done) => {
    const Constructor2 = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openLoading">打开loading</button>',
      methods: {
        openLoading() {
          Loading.config({ icon: 'stripper', duration: 0.2 }).open();
        },
      },
    });
    const vm = new Constructor2().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:loading为显示状态
      expect(window.document.querySelector('.t-loading')).to.not.be.empty;
      // 断言:loading的icon类型;
      expect(window.document.querySelector('.line-scale-pulse-out')).to.not.be.empty;
      // 断言自动关闭时间
      setTimeout(() => {
        expect(window.document.querySelector('.t-loading').style.display).to.equal('none');
        done();
      }, 200);
    }, 10);
  });
});
