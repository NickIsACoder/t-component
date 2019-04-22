/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
import Vue from 'vue';
import messagebox from './messagebox';

const Message = Vue.extend(messagebox);

let messageQueue = []; // 当多次调用message的时候会缓存这里，一次只能显示一次对话框
let instance; // 只有一个实例
let runningMsg; // 正在运行的对话框的配置

const defaultOption = { // 默认配置，用于补充默认配置/重置配置
  title: '',
  text: '',
  icon: '',
  iconColor: '',
  hasInput: false,
  inputValidate: null,
  customTpl: '',
  type: '',
  theme: '',
  buttonText: ['取消', '确定'],
  buttonClass: ['t-msgbox-cancelBtn', 't-msgbox-confirmBtn'],
  canClose: true,
  onClose: null,
  backdrop: true,
  backdropColor: '#767676',
};

function mergeOption(target, ...args) { // 合并配置的函数
  const result = target;
  for (let i = 0, j = args.length; i < j; i++) {
    const source = args[i];
    Object.keys(source).forEach((key) => {
      result[key] = source[key];
    });
  }

  return result;
}
const defaultCallback = (action) => { // 默认的返回函数，带有promise返回
  if (runningMsg) { // 没有运行中实例便无法触发回调
    const callback = runningMsg.callback;
    if (typeof callback === 'function') { // 单纯是函数回调直接调用
      if (instance.type === 'prompt') {
        callback(instance.inputValue, action);
      } else {
        callback(action);
      }
    }
    if (runningMsg.resolve) { // 如果是promise对象则根据情况返回resolve或者reject
      if (action === 'confirm') {
        if (instance.type === 'prompt') {
          runningMsg.resolve({ value: instance.inputValue, action });
        } else {
          runningMsg.resolve(action);
        }
      } else if (runningMsg.reject && (action === 'cancel' || action === 'close')) {
        runningMsg.reject(action);
      }
    }
  }
};

function initMsg() { // 组件实例化
  instance = new Message({
    el: document.createElement('div'),
  });
  instance.callback = defaultCallback;
}

const runMsg = () => { // 把配置挂载到实例上，然后显示实例
  if (!instance) {
    initMsg();
  }
  instance.action = '';

  if (!instance.visible || instance.closeTimer) {
    if (messageQueue.length > 0) {
      runningMsg = messageQueue.shift();

      let options = runningMsg.options;
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }
      options = mergeOption({}, defaultOption, options);
      Object.keys(options).forEach((key) => {
        instance[key] = options[key];
      });
      const oldCb = instance.callback;
      instance.callback = (action, instances) => {
        oldCb(action, instances);
        runMsg();
      };
      document.body.appendChild(instance.$el);
      Vue.nextTick(() => {
        instance.visible = true;
      });
    }
  }
};

const Messagebox = (options, callback) => { // 获取配置，然后把配置压入存储数组
  let newOption = options;
  let newCallback = callback;
  if (typeof newOption === 'string') {
    newOption = {
      title: newOption,
    };
    if (arguments[1]) {
      newOption.text = arguments[1];
    }
    if (arguments[2]) {
      newOption.type = arguments[2];
    }
  } else if (options.callback && !callback) {
    newCallback = options.callback;
  }
  if (typeof Promise !== 'undefined') {
    return new Promise(function(resolve, reject) { // eslint-disable-line
      messageQueue.push({
        options: newOption,
        newCallback,
        resolve,
        reject,
      });
      runMsg();
    });
  } else {
    messageQueue.push({
      options: newOption,
      newCallback,
    });
    runMsg();
  }
};

Messagebox.alert = (...args) => {
  const option = {
    title: args[0] || defaultOption.title,
    icon: args[2] || defaultOption.icon,
    text: args[1] || defaultOption.text,
    buttonText: args[3] || defaultOption.buttonText,
    type: 'alert',
  };
  return Messagebox(option);
};
Messagebox.confirm = (...args) => {
  const option = {
    title: args[0] || defaultOption.title,
    icon: args[2] || defaultOption.icon,
    text: args[1] || defaultOption.text,
    buttonText: args[3] || defaultOption.buttonText,
    type: 'confirm',
  };
  return Messagebox(option);
};
Messagebox.prompt = (...args) => {
  const option = {
    title: args[0] || defaultOption.title,
    icon: args[2] || defaultOption.icon,
    text: args[1] || defaultOption.text,
    buttonText: args[3] || defaultOption.buttonText,
    type: 'prompt',
    hasInput: true,
  };
  return Messagebox(option);
};
// 关闭Messagebox
Messagebox.close = () => {
  if (instance) {
    instance.feedback('close');
    instance.visible = false;
  }
  messageQueue = [];
  runningMsg = null;
};
export default Messagebox;
