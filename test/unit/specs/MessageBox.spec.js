import Vue from 'vue/dist/vue';
import Messagebox from '../../../packages/messagebox/index';

describe('Messagebox', () => {
  it('测试alert配置和打开关闭', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      methods: {
        openMessageBox() {
          Messagebox.alert('标题标题', '内容内容内容', 'icon-add', ['我知道啦']);
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox的icon;
      expect(window.document.querySelector('.icon-add')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('标题标题');
      // 断言:MessageBox内容;
      expect(window.document.querySelector('.t-msgbox-content').firstChild.innerText).to.equal('内容内容内容');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(1);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('我知道啦');
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试alert配置双按钮回调', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.alert('回调测试', '确定要毁灭世界么?', '', ['毫不犹豫毁灭', '吃完手抓饼再说']).then(() => { this.time = 100; });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('回调测试');
      // 断言:MessageBox内容;
      expect(window.document.querySelector('.t-msgbox-content').firstChild.innerText).to.equal('确定要毁灭世界么?');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('毫不犹豫毁灭');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('吃完手抓饼再说');
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      // window.document.querySelector('.t-msgbox-cancelBtn').click();
      setTimeout(() => {
        // 断言:判断回调是否执行
        expect(vm.time).to.equal(100);
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试alert配置双按钮,取消关闭alert', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          tip: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.alert('回调测试', '确定要毁灭世界么?', '', ['毫不犹豫毁灭', '吃完手抓饼再说']);
        },
      },
    });
    // });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('回调测试');
      // 断言:MessageBox内容;
      expect(window.document.querySelector('.t-msgbox-content').firstChild.innerText).to.equal('确定要毁灭世界么?');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('毫不犹豫毁灭');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('吃完手抓饼再说');
      // 关闭alert
      window.document.querySelector('.t-msgbox-cancelBtn').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试confirm配置', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.confirm('学习学习', '三月呀要努力?', '', ['一定要考上']);
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('学习学习');
      // 断言:MessageBox内容;
      expect(window.document.querySelector('.t-msgbox-content').firstChild.innerText).to.equal('三月呀要努力?');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(1);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('一定要考上');
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试confirm配置双按钮回调', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.confirm('学习学习', '三月呀要努力?', '', ['一定要考上', '考不上要GG啦']).then(() => { this.time = 100; });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('学习学习');
      // 断言:MessageBox内容;
      expect(window.document.querySelector('.t-msgbox-content').firstChild.innerText).to.equal('三月呀要努力?');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('一定要考上');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('考不上要GG啦');
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试confirm配置双按钮取消关闭', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          tip: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.confirm('学习学习', '三月呀要努力?', '', ['一定要考上', '考不上要GG啦']).catch((action) => {
            if (typeof action === 'string') {
              this.tip = '您点击了取消';
            } else {
              this.tip = '报错啦';
            }
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('学习学习');
      // 断言:MessageBox内容;
      expect(window.document.querySelector('.t-msgbox-content').firstChild.innerText).to.equal('三月呀要努力?');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('一定要考上');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('考不上要GG啦');
      // 关闭alert
      window.document.querySelector('.t-msgbox-cancelBtn').click();
      setTimeout(() => {
        expect(vm.tip).to.equal('您点击了取消');
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试prompt配置', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.prompt('请输入你的最爱','', 'icon-add',  ['确定', '取消']);
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('请输入你的最爱');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('确定');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('取消');
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试prompt配置回调', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.prompt('请输入你的最爱1', '',  'icon-add',['确定', '取消']).then(() => { this.time = document.querySelector('.t-msgbox-input').innerHTML; });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('h3').innerText).to.equal('请输入你的最爱1');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('确定');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('取消');
      document.querySelector('.t-msgbox-input').innerHTML = '啦啦啦啦我是卖报的';
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:判断回调是否执行
        expect(vm.time).to.equal('啦啦啦啦我是卖报的');
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试prompt正则', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox({ title: '这是小标题', buttonText: ['对的', '错的'], type: 'prompt', inputValidate: /[0-9]/, errorMessage: '请输入数字' }).then(() => { this.time = document.querySelector('.t-msgbox-input').innerHTML; });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('对的');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('错的');
      document.querySelector('.t-msgbox-input').innerHTML = '啦啦啦啦我是卖报的';
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:判断回调是否执行
        expect(window.document.querySelector('.t-msgbox-content p').innerText).to.equal('请输入数字');
        // 断言:判断回调是否执行
        expect(vm.time).not.to.equal('啦啦啦啦我是卖报的');
        // 断言:MessageBox显示状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('');
        window.document.querySelector('.t-msgbox-cancelBtn').click();
        done();
      }, 10);
    }, 10);
  });
  it('测试prompt配置取消关闭', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          tip: 2,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox.prompt('请输入你的最爱', '', 'icon-add', ['确定', '取消']).then(() => { this.tip = document.querySelector('.t-msgbox-input').innerHTML; }).catch((action) => {
            if (typeof action === 'string') {
              this.tip = '您点击了取消';
            } else {
              this.tip = '报错啦';
            }
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('.t-msgbox-title h3').innerText).to.equal('请输入你的最爱');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('确定');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('取消');
      document.querySelector('.t-msgbox-input').innerHTML = '啦啦啦啦我是卖报的';
      // 关闭alert
      window.document.querySelector('.t-msgbox-cancelBtn').click();
      setTimeout(() => {
        // 断言:判断回调是否执行
        expect(vm.tip).to.equal('您点击了取消');
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 500);
    }, 1000);
  });
  it('测试自定义模板配置', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox({
            customTpl: '<p>您将授权我们进行进一步的对您个人信息记录和使用，您的信息我们将严格保密，并用于正确用途。</p>',
            title: '测试正则来啦',
            buttonText: ['对的', '错的'],
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      // 断言:MessageBox标题;
      expect(window.document.querySelector('.t-msgbox-wrapper p').innerText).to
        .equal('您将授权我们进行进一步的对您个人信息记录和使用，您的信息我们将严格保密，并用于正确用途。');
      // 断言:MessageBox按钮;
      expect(window.document.querySelectorAll('.t-msgbox-btngroup button').length).to.equal(2);
      expect(window.document.querySelector('.t-msgbox-confirmBtn').innerText).to.equal('对的');
      expect(window.document.querySelector('.t-msgbox-cancelBtn').innerText).to.equal('错的');
      // 关闭alert
      window.document.querySelector('.t-msgbox-confirmBtn').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试Messagebox关闭按钮', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          time: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox({
            customTpl: '<p>您将授权我们进行进一步的对您个人信息记录和使用，您的信息我们将严格保密，并用于正确用途。</p>', title: '测试正则来啦', buttonText: ['对的', '错的'],
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;
      expect(window.document.querySelector('.icon-close')).to.not.be.empty;
      // 关闭alert
      window.document.querySelector('.t-msgbox-wrapper .icon-close').click();
      setTimeout(() => {
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
  it('测试Messagebox取消回调', (done) => {
    const Constructor = Vue.extend({
      template: '<button class="openBtn" ref="openBtn" @click="openMessageBox">打开Messagebox</button>',
      data() {
        return {
          tip: 1,
        };
      },
      methods: {
        openMessageBox() {
          Messagebox({
            customTpl: '<p>您将授权我们进行进一步的对您个人信息记录和使用，您的信息我们将严格保密，并用于正确用途。</p>', title: '测试正则来啦', buttonText: ['对的', '错的'],
          }).catch((action) => {
            if (typeof action === 'string') {
              this.tip = '您点击了取消';
            } else {
              this.tip = '报错啦';
            }
          });
        },
      },
    });
    const vm = new Constructor().$mount();
    vm.$el.click();
    setTimeout(() => {
      // 断言:MessageBox为显示状态
      expect(window.document.querySelector('.t-msgbox')).to.not.be.empty;

      // 关闭alert
      window.document.querySelector('.t-msgbox-cancelBtn').click();
      setTimeout(() => {
        // 断言:判断回调是否执行
        expect(vm.tip).to.equal('您点击了取消');
        // 断言:MessageBox为关闭状态
        expect(window.document.querySelector('.t-msgbox').style.display).to.equal('none');
        done();
      }, 10);
    }, 10);
  });
});
