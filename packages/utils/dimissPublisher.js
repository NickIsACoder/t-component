let publisher; // 单例发布器，确保整个应用只有一个发布器

function Publisher() { // 发布器构造器
  const subscribeMap = {}; // dom事件订阅表，键名为dom事件，键值为订阅者对象数组。
  return {
    subscribe(subscriber, subscribeType) { // 订阅方法
      if (subscribeMap[subscribeType]) { // 把订阅对象分类存进订阅表
        subscribeMap[subscribeType].push(subscriber);
      } else {
        subscribeMap[subscribeType] = [subscriber];
        this.setListener(subscribeType, subscriber);
      }
    },
    publish(event) { // 发布事件，接收到发布动作之后，逐个订阅对象发布事件
      const subscribeType = event.type;
      const subscribers = subscribeMap[subscribeType];
      subscribers.forEach((subscriber) => {
        subscriber.receive(event); // 耦合了订阅对象的receive方法
      });
    },
    setListener(subscribeType, subscriber) { // 设置全局的监听方法
      if (subscribeType === 'blur' || subscribeType === 'focus') { // blur和focus是不冒泡的事件，所以只能在订阅者上监听
        subscriber.node.addEventListener(subscribeType, this.publish);
      } else {
        window.addEventListener(subscribeType, this.publish); // 通过冒泡来监听全局的事件，然后执行发布方法
      }
    },
    unsubscribe(subscriber, subscribeType) { // 取消订阅的方法，当发布完成了的时候可以按需要取消订阅
      if (subscribeMap[subscribeType]) {
        const index = subscribeMap[subscribeType].findIndex(item => item === subscriber);
        if (index > -1) {
          subscribeMap[subscribeType].splice(index, 1);
        }
        if (subscribeMap[subscribeType].length === 0) { // 没有订阅者的时候释放监听器，减少页面开销
          window.removeEventListener(subscribeType, this.publish);
          delete subscribeMap[subscribeType];
        }
      }
    },
  };
}
export default {
  registerListener(component, eventType) { // 把发布器封装成外部方法，方便调用
    const subsciber = component;
    if (!publisher) {
      publisher = new Publisher();
    }
    publisher.subscribe(subsciber, eventType);
  },
  destoryListener(component, eventType) { // 取消订阅的方法也封装起来
    if (!publisher) {
      return;
    }
    publisher.unsubscribe(component, eventType);
  },
};
