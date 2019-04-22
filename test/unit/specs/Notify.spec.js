import Vue from 'vue/dist/vue';
import Notification from '../../../packages/notification/index';

describe('notification', () => {
  afterEach(() => {
    const el = document.querySelector('.t-notification');
    if (!el) return;

    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    if (el.__vue__) {
      el.__vue__.$destroy();
    }
  });
  it('测试Notify为info', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.info('这是提示文本');
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.icon-info-fill')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content h3').innerText).to.equal('这是提示文本');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 500);
    }, 10);
  });
  it('测试Notify为warn', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      methods: {
        openNotify() {
          Notification.warning('这是警告文本');
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.icon-warn-fill')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content h3').innerText).to.equal('这是警告文本');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 500);
    }, 10);
  });
  it('测试Notify为error', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      methods: {
        openNotify() {
          Notification.error('这是错误文本');
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.icon-error')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content h3').innerText).to.equal('这是错误文本');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 500);
    }, 10);
  });
  it('测试Notify为success', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      methods: {
        openNotify() {
          Notification.success('这是成功文本');
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.icon-radio-choosed')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content h3').innerText).to.equal('这是成功文本');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 500);
    }, 10);
  });
  it('自定义Notify自动关闭', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: { top: '200px', right: '100px' },
            customTpl: '<p>用于测试自定义内容模板内容用于测试自定义内容模板内容用于测试自定义内容模板内容用于测试自定义内容模板内容</p>',
            delay: 0.3,
            autoDimiss: true,
          }).open().onclick(() => {
            this.time = 2;
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.t-notification-content span .iconfont')).to.be.null;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('用于测试自定义内容模板内容用于测试自定义内容模板内容用于测试自定义内容模板内容用于测试自定义内容模板内容');
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 800);
    }, 10);
  });
  it('自定义Notify触发关闭事件', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: { top: '200px', right: '100px' },
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open().onclose(() => {
            this.time = 2;
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.icon-info-fill')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:触发关闭事件
        expect(vm.time).to.be.equal(2);
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 500);
    }, 10);
  });
  it('自定义Notify触发点击事件', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: { top: '200px', right: '100px' },
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open().onclick(() => {
            this.time = 2;
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify的icon;
      expect(window.document.querySelector('.icon-info-fill')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 手动触发Notify点击事件
      window.document.querySelector('.t-notification-content').click();
      setTimeout(() => {
        // 断言:触发关闭事件
        expect(vm.time).to.be.equal(2);
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 500);
    }, 10);
  });
  it('notify位置为topRight', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: 'topRight',
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.top).to.equal('10px');
      expect(window.document.querySelector('.t-notification').style.right).to.equal('0px');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
  it('notify位置为topLeft', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: 'topLeft',
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.top).to.equal('10px');
      expect(window.document.querySelector('.t-notification').style.left).to.equal('0px');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
  it('notify位置为bottomLeft', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: 'bottomLeft',
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.bottom).to.equal('10px');
      expect(window.document.querySelector('.t-notification').style.left).to.equal('0px');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
  it('notify位置为bottomRight', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: 'bottomRight',
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.bottom).to.equal('10px');
      expect(window.document.querySelector('.t-notification').style.right).to.equal('0px');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
  it('notify位置为bottomCenter', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: 'bottomCenter',
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.bottom).to.equal('10px');
      expect(window.document.querySelector('.t-notification').style.left).to.equal('50%');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
  it('notify位置为topCenter', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: 'topCenter',
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.top).to.equal('10px');
      expect(window.document.querySelector('.t-notification').style.left).to.equal('50%');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
  it('notify自定义位置', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openNotify">打开Notify</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openNotify() {
          Notification.config({
            position: { bottom: '500px', right: '600px' },
            theme: 'info',
            autoDimiss: false,
            text: '这是一条没用的消息',
          }).open();
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:Notify为显示状态
      expect(window.document.querySelector('.t-notification')).to.not.be.empty;
      // 断言:Notify标题;
      expect(window.document.querySelector('.t-notification-content p').innerText).to.equal('这是一条没用的消息');
      // 断言:notify的位置
      expect(window.document.querySelector('.t-notification').style.bottom).to.equal('500px');
      expect(window.document.querySelector('.t-notification').style.right).to.equal('600px');
      // 手动关闭Notify
      window.document.querySelector('.t-notification .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-notification')).to.be.null;
        done();
      }, 510);
    }, 10);
  });
});
