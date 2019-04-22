import Vue from 'vue';
import loading from './loading';

const Loading = Vue.extend(loading); // 构建基于vue的子类的构造方法

let instance;

export default {
  open(...args) { // 不定长的函数入参
    if (!instance) { // 单例模式，如果存在一个实例的话就不会创建新的实例
      instance = new Loading({ // 用新建的HTMLElement来构建一个实例，这时的实例可以达到mounted的生命周期
        el: document.createElement('div'),
      });
    }
    if (instance.visible) return;
    if (args.length) { // 有入参就分类来设置对应属性
      instance.title = args[0] === true ? instance.title : args[0] || instance.title;
      instance.icon = args[1] === true ? instance.icon : args[1] || instance.icon;
      instance.duration = args[2] || instance.duration;
    }
    document.body.appendChild(instance.$el); // 把实例挂载到dom上去
    Vue.nextTick(() => { // 下一帧让实例显示出来
      instance.visible = true;
    });
  },

  config(config = {}) {
    if (!instance) {
      instance = new Loading({
        el: document.createElement('div'),
      });
    }
    if (instance.visible) return this;
    // boolean属性的覆盖不能用或运算来处理，否则会永远都是true
    instance.backdrop = config.backdrop === undefined ? instance.backdrop : config.backdrop;
    instance.backdropColor = config.backdropColor || instance.backdropColor;
    instance.title = config.title || instance.title;
    instance.customTpl = config.customTpl || instance.customTpl;
    instance.icon = config.icon || instance.icon;
    instance.duration = config.duration || instance.duration;
    if (config.duration) {
      const closeThis = setTimeout(() => {
        instance.visible = false;
        clearTimeout(closeThis);
      }, config.duration * 1000);
    }
    document.body.appendChild(instance.$el);
    return this; // 返回这个对象执行的自身，方便下一步链式执行.open()
  },

  close() {
    if (instance) {
      instance.visible = false; // 关闭实例的显示
    }
  },
};
