/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
import dimiss from './dimissPublisher';

/**
 * 订阅器的mixin。这样可以按需嵌入对应的组件中。
 * 方便使用
 * {{data(): dimissObject, 用于存储订阅对象，不能修改。
 * methods: {
 * setDimiss(*string, *HTMLElement, *string, *function): void,
 * 接收四个参数：分别是监听事件类型，Event.type的值，如‘click’、'mouseenter'等
 * 用于比较用的dom元素，
 * 触发回调的dom域，有固定的选项值：'self'/仅本身,'children'/本身及子元素,'other'/除自己之外的其他元素
 * 回调函数，当事件的触发元素在dom范围的时候会执行，相应的动作都在里面执行，使用箭头函数可以绑定上下文的this，方便访问对应的资源
 * cancelDimiss(): void 取消订阅的方法
 * }
 * }}
 * 注意：本mixin的主要目的是为了方便各个组件对全局事件监听从而执行相应的状态（比如选择框的列表收起的动作）。
 * 这个方法适用于改变状态之后需要根据dom事件自动取消状态之后调用。
 */

const dimissMixin = {
  data() {
    return {
      dimissObject: null,
    };
  },
  methods: {
    setDimiss(eventType, compareNode = null, scope = 'other', handler = null) {
      const _this = this;
      this.dimissObject = {
        node: compareNode || _this.$el, // 没有指定对比元素的话，会默认为实例的挂载节点
        eventType,
        scope,
        receive(event) { // 耦合的receive方法在这里事先耦合，不用用户调用的时候自己耦合方便使用
          const target = event.target;
          if (!target.compareDocumentPosition) return;
          // 某些dom事件是没有这个方法的，比如控制台的‘click’事件，
          // 因为不属于dom范畴所以要提前退出
          const positionCode = target.compareDocumentPosition(this.node);
          // 使用compareDocumentPosition的原因是它比contains方法的兼容性更好，
          // 而且可以细分出很多种情况，唯一的缺点是它使用了掩码返回所以要进行按位与才能识别相应的选项
          let pass;
          switch (this.scope) { // 根据scope来判断使用什么判断条件
            case 'other': // 其他元素的话就不会是子元素和本身
              pass = !(positionCode & 8) && positionCode; // 按位与判断原理： 二进制位数和一个数与，
              break; // 如果那个数的对应位有值则会返回那个位数，否则返回0，8 & 10 = 8， 4 & 10 = 0
            case 'self': // 如果是本身的话positionCode等于0
              pass = !positionCode;
              break;
            case 'children': // 如果是子元素的话positionCode会包含8，和8与会等于8
              pass = (positionCode & 8) || !positionCode;
              break;
            default: // 默认是other
              pass = !(positionCode & 8) && positionCode;
              break;
          }
          if (pass && handler) {
            handler();
          }
        },
      };
      dimiss.registerListener(this.dimissObject, eventType);
    },
    cancelDimiss() { // 取消订阅，一般在触发之后执行的回调中最后使用，不然会导致监听一直触发，到时状态出错
      dimiss.destoryListener(this.dimissObject, this.dimissObject.eventType);
    },
  },
};
export default dimissMixin;
