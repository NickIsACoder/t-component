import Vue from 'vue';
import notification from './notification';

const Notification = Vue.extend(notification); // 构建基于vue的子类的构造方法
let queues = []; // 用于存储所有实例队列的数组
function NotificationQueue(positionName) { // 实例队列的构造函数
  const queue = []; // 实例队列，私有
  const positionList = []; // 各个实例绑定的位置信息，私有
  switch (positionName) { // 根据位置信息（简写或者详细设置均可）来确定具体位置信息
    case 'topRight':
      positionList.push({ top: '10px', right: 0 });
      break;
    case 'topLeft':
      positionList.push({ top: '10px', left: 0 });
      break;
    case 'bottomRight':
      positionList.push({ bottom: '10px', right: 0 });
      break;
    case 'bottomLeft':
      positionList.push({ bottom: '10px', left: 0 });
      break;
    case 'topCenter':
      positionList.push({ top: '10px', left: '50%' });
      break;
    case 'bottomCenter':
      positionList.push({ bottom: '10px', left: '50%' });
      break;
    default:
      positionList.push(JSON.parse(positionName));
      break;
  }
  return { // 实例队列主要执行对象
    positionName, // 位置信息，用于唯一标识队列
    splice(notify) { // 把对应的实例从队列中删除
      document.body.removeChild(notify.$el); // 把实例从dom中移除
      const index = queue.findIndex(val => val === notify);
      queue.splice(index, 1); // 把实例从队列中期初
      notify.$destroy(); // 销毁实例
      if (queue.length) { // 队列还存在元素的话就重新更新位置信息，再重新对应，对应后自动有动画效果
        for (let i = index; i < queue.length; i++) {
          const instance = queue[i];
          const height = window.getComputedStyle(instance.$el.children[0]).height;
          const nextPosition = Object.assign({}, positionList[i]);
          if (nextPosition.top) { // 往上或是往下堆叠实例
            nextPosition.top = `${parseInt(nextPosition.top, 10) + parseInt(height, 10) + 30}px`;
          }
          if (nextPosition.bottom) { // 往上或是往下堆叠实例
            nextPosition.bottom = `${parseInt(nextPosition.bottom, 10) + parseInt(height, 10) + 30}px`;
          }
          positionList[i + 1] = nextPosition;
        }
        queue.forEach((val, inn) => {
          // eslint-disable-next-line
          val.position = positionList[inn];
        });
        positionList.pop(); // 位置信息直接删除最后一个即可
      } else {
        queues = queues.filter(val => val !== this); // 队列空了就把队列从队列数据删掉
      }
    },
    push(notify) { // 把实例加入队列中，并加载到dom中渲染出来
      const n = notify;
      n.position = positionList[positionList.length - 1]; // 使用上一个实例已确定好渲染位置
      n.queue = this; // 把本队列传入实例，便于实例自己调用退出队列的方法
      queue.push(n);
      document.body.appendChild(n.$el); // 挂载到dom上
      Vue.nextTick(() => {
        n.visible = true; // 显示实例
        Vue.nextTick(() => { // 实例要在下一帧才能渲染出来，这时候设置下一个实例要渲染的位置
          const height = window.getComputedStyle(n.$el.children[0]).height;
          const nextPosition = Object.assign({}, positionList[positionList.length - 1]);
          if (nextPosition.top) { // 往上或是往下堆叠实例
            nextPosition.top = `${parseInt(nextPosition.top, 10) + parseInt(height, 10) + 30}px`;
          }
          if (nextPosition.bottom) { // 往上或是往下堆叠实例
            nextPosition.bottom = `${parseInt(nextPosition.bottom, 10) + parseInt(height, 10) + 30}px`;
          }
          positionList.push(nextPosition);
        });
      });
    },
  };
}

/**
 * notice / 注意: 此处链式调用的搭配有某些局限性。
 * info/warning/error/success等函数不建议和config以及open连用。
 * 1.和config连用会把原本设置覆盖掉
 * 2.和open连用会没有反应
 * onclick和onclose这两个函数则不存在这个局限。
 * 不过如果链在config函数后面会有可能吧config里的对应属性给覆盖掉，使用的时候应注意。
 */

const notifyFunc = {
  instance: null, // 实例存存储位置，便于链式调用的时候共享实例来设置对应属性
  positionName: '',
  info(config = {}, text = '', delay = 0) {
    this.instance = new Notification({ // 创建实例
      el: document.createElement('div'),
    });
    this.instance.theme = 'info';
    if (typeof config === 'string') { // 当调用传入字符串才用来设置title
      this.instance.title = config;
    }
    this.instance.text = text;
    if (delay) { // 要非0的时候才用来设置delay
      this.delay = delay;
    }
    let position; // 设置位置信息，若没有则填上默认的数值
    if (!config.position) {
      position = 'topRight';
    } else {
      position = typeof config.position === 'string' ? config.position : JSON.stringify(config.position);
    }
    const queue = queues.find(val => val.positionName === position);
    // 查看是否存在该位置的队列，是的话就直接把实例加入队列，没有的话就新建一个队列
    if (queue) {
      queue.push(this.instance);
    } else {
      const newQueue = new NotificationQueue(position);
      newQueue.push(this.instance);
      queues.push(newQueue);
    }
    return this; // 返回本对象 ，便于链式调用进行进一步调用
  },
  error(config = {}, text = '', delay = 0) {
    this.instance = new Notification({
      el: document.createElement('div'),
    });
    this.instance.theme = 'error';
    if (typeof config === 'string') {
      this.instance.title = config;
    }
    this.instance.text = text;
    if (delay) {
      this.delay = delay;
    }
    let position;
    if (!config.position) {
      position = 'topRight';
    } else {
      position = typeof config.position === 'string' ? config.position : JSON.stringify(config.position);
    }
    const queue = queues.find(val => val.positionName === position);
    if (queue) {
      queue.push(this.instance);
    } else {
      const newQueue = new NotificationQueue(position);
      newQueue.push(this.instance);
      queues.push(newQueue);
    }
    return this;
  },
  success(config = {}, text = '', delay = 0) {
    this.instance = new Notification({
      el: document.createElement('div'),
    });
    this.instance.theme = 'success';
    if (typeof config === 'string') {
      this.instance.title = config;
    }
    this.instance.text = text;
    if (delay) {
      this.delay = delay;
    }
    let position;
    if (!config.position) {
      position = 'topRight';
    } else {
      position = typeof config.position === 'string' ? config.position : JSON.stringify(config.position);
    }
    const queue = queues.find(val => val.positionName === position);
    if (queue) {
      queue.push(this.instance);
    } else {
      const newQueue = new NotificationQueue(position);
      newQueue.push(this.instance);
      queues.push(newQueue);
    }
    return this;
  },
  warning(config = {}, text = '', delay = 0) {
    this.instance = new Notification({
      el: document.createElement('div'),
    });
    this.instance.theme = 'warning';
    if (typeof config === 'string') {
      this.instance.title = config;
    }
    this.instance.text = text;
    if (delay) {
      this.delay = delay;
    }
    let position;
    if (!config.position) {
      position = 'topRight';
    } else {
      position = typeof config.position === 'string' ? config.position : JSON.stringify(config.position);
    }
    const queue = queues.find(val => val.positionName === position);
    if (queue) {
      queue.push(this.instance);
    } else {
      const newQueue = new NotificationQueue(position);
      newQueue.push(this.instance);
      queues.push(newQueue);
    }
    return this;
  },
  open() {
    if (!this.instance) { // 没有实例就返回此对象，便于链式调用
      return this;
    }
    if (this.instance.visible) { // 如果实例已经显示就返回此对象，便于链式调用
      return this;
    }
    const queue = queues.find(val => val.positionName === this.positionName);
    if (queue) {
      queue.push(this.instance);
    } else {
      const newQueue = new NotificationQueue(this.positionName);
      newQueue.push(this.instance);
      queues.push(newQueue);
    }
    return this;
  },
  config(config) {
    this.instance = new Notification({
      el: document.createElement('div'),
    });
    this.instance.theme = config.theme || this.instance.theme;
    this.instance.customTpl = config.customTpl || this.instance.customTpl;
    this.instance.title = config.title || this.instance.title;
    this.instance.text = config.text || this.instance.text;
    this.instance.icon = config.icon || this.instance.icon;
    this.instance.delay = config.delay || this.instance.delay;
    this.instance.onClick = config.onClick || this.instance.onClick;
    this.instance.onClose = config.onClose || this.instance.onClose;
    this.instance.autoDimiss = config.autoDimiss !== undefined ? config.autoDimiss
      : this.instance.autoDimiss;
    if (!config.position) {
      this.positionName = 'topRight';
    } else {
      this.positionName = typeof config.position === 'string' ? config.position : JSON.stringify(config.position);
    }
    return this;
  },
  onclick(callback) { // 绑定回调方法
    if (this.instance) {
      this.instance.onClick = callback;
    }
    return this;
  },
  onclose(callback) {
    if (this.instance) {
      this.instance.onClose = callback;
    }
    return this;
  },
};
export default notifyFunc;
