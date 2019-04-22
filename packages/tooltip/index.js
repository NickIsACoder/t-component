import Vue from 'vue';
import tooltip from './tooltip';

const Tooltip = Vue.extend(tooltip);
const instancesArray = []; // 使用队列缓存已建立的tooltip，以事件的currentTaget作为唯一标识
function openTooltip($event, config) { // 传入参数，事件对象，还有设置
  let option;
  const refevent = $event;
  refevent.refTarget = refevent.currentTarget; // 需要及时缓存currentTarget，不然后面这个属性会消失为null
  if (typeof config === 'string') { // 如果是字符串的话，直接赋给title
    option = {
      title: config,
      target: refevent,
    };
  } else {
    option = config;
    option.target = refevent;
    if (option.position && typeof option.position === 'object') { // 如果有位置属性且是对象就把位置属性的对象转为字符串
      option.position = JSON.stringify(option.position);
    }
  }
  let instance; // 确保每个currentTarget只有一个对应的实例
  const existInstance = instancesArray.find(value =>
    value.target.refTarget === $event.refTarget);
  if (existInstance) {
    instance = existInstance;
  } else {
    instance = new Tooltip({ // 新建实例
      el: document.createElement('div'),
    });
    instancesArray.push(instance);
    const parent = $event.refTarget.offsetParent ?
      $event.refTarget.offsetParent : window.document.documentElement;
    instance.parent = parent;
    parent.appendChild(instance.$el);
  }
  Object.keys(option).forEach((key) => { // 把属性赋给实例
    instance[key] = option[key];
  });
  if (this) {
    this.$once('hook:beforeDestroy', () => {
      instancesArray.forEach((x, index) => {
        const parent = x.parent;
        if (x && parent) {
          parent.removeChild(x.$el);
          x.$destroy();
        }
        instancesArray.splice(index, 1);
      });
    });
  }
  Vue.nextTick(() => {
    instance.visible = true;
  });
}

export default openTooltip;
