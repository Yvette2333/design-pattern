// 发布 - 订阅者模式

// 普通的发布订阅者模式
console.log("====================普通的发布订阅模式========")
var salesOffices = {} // 发布者

salesOffices.clentList = [] // 缓存列表

// 监听消息
salesOffices.listen = function (fn) {
  this.clentList.push(fn)
}

// 发布消息 - 循环缓存列表中的回调函数
salesOffices.trigger = function () {
  for (let i = 0; i < this.clentList.length; i++) {
    let fn = this.clentList[i];
    fn.apply(this, arguments)
  }
}
// trigger的时候会告知所有的订阅者
salesOffices.listen(function (price, squareMeter) { // 小明订阅消息
  console.log('价格= ' + price);
  console.log('squareMeter= ' + squareMeter);
});

salesOffices.listen(function (price, squareMeter) { // 小明订阅消息
  console.log('价格2= ' + price);
  console.log('squareMeter2= ' + squareMeter);
});

salesOffices.trigger(2000000, 88); // 输出： 200 万， 88 平方米
salesOffices.trigger(3000000, 110); // 输出： 300 万， 110 平方米


console.log("====================定制化的发布订阅模式========")
// 即设定特殊的类型，供订阅者订阅，在发布的时候，根据类型来进行发布。
// 存储在对象中，使用key-value 的形式

class MyListener {
  constructor() {
    this.clientList = {}
  }

  /**
   * 
   * @param {String} key 
   * @param {Function} fn 
   */
  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [] //初始化消息队列
    }
    this.clientList[key].push(fn) // 将回调添加进消息列表
  }

  trigger() {
    // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
    let key = Array.prototype.shift.call(arguments) // 获取第一个参数
    let fns = this.clientList[key];

    if (!fns || !fns.length) {
      return false
    }

    for (let i = 0; i < fns.length; i++) {
      let fn = fns[i];
      fn.apply(this, arguments) //调用监听的回调函数，并将trigger的参数传过去
    }

  }

}

let lis = new MyListener()
lis.listen('89m', function (price) {
  console.log('最优房产面积89，单价：', price)
})
lis.listen('128m', function (price) {
  console.log('最适宜房产面积128，单价：', price)
})

lis.trigger('89m', '18k')
lis.trigger('89m', '17k')
lis.trigger('128m', '16k')

console.log('==============为其他的销售房产人也添加一个发布订阅=========')
console.log('==============还想 取消订阅========')

// 给所有对象动态安装发布-订阅功能，继承即可。。
class OtherSales extends MyListener {
  constructor(props) {
    super(props)
    console.log('has been instance')
  }

  // 取消订阅
  remove(key, fn) {
    let fns = this.clientList[key];
    if (!fns || !fns.length) {
      return false
    }
    if (!fn) { // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
      fns && (fns.length = 0);
    } else {
      // 删除指定的订阅
      for (var l = fns.length; l >= 0; l--) {
        var _fn = fns[l];
        if (fn === _fn) {
          // 移除
          fns.splice(l, 1)
        }
      }
      console.log('cancel observed')
    }
  }
}

let lis2 = new OtherSales()
lis2.listen('89m', function (price) {
  console.log('最优房产面积89，单价：', price)
})
let fnCB = function (price) {
  console.log('最适宜房产面积128，单价：', price)
}
lis2.listen('128m', fnCB)

lis2.trigger('89m', '18k')
lis2.trigger('89m', '17k')
lis2.trigger('128m', '16k')
lis2.trigger('128m', '20k')
// lis2.remove('128m', fnCB) // 删除订阅
lis2.trigger('89m', '16k')
console.log(lis2)

let lis3 = new OtherSales()
lis3.listen('89m', function (price) {
  console.log('最优房产面积89，单价：', price)
})
console.log(lis3)


console.log('==============一个全局的发布-订阅对象========')

const Event = (function () {
  var clientList = {},
    listen,
    trigger,
    remove;
  listen = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  };
  trigger = function () {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key];
    if (!fns || fns.length === 0) {
      return false;
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments);
    }
  };
  remove = function (key, fn) {
    let fns = this.clientList[key];
    if (!fns || !fns.length) {
      return false
    }
    if (!fn) { // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
      fns && (fns.length = 0);
    } else {
      // 删除指定的订阅
      for (var l = fns.length; l >= 0; l--) {
        var _fn = fns[l];
        if (fn === _fn) {
          // 移除
          fns.splice(l, 1)
        }
      }
      console.log('cancel observed')
    }
  }

  return {
    clientList, listen, trigger, remove
  }
})()
Event.listen('squareMeter88', function (price) { // 小红订阅消息
  console.log('价格= ' + price); // 输出： '价格=2000000'
});
Event.listen('squareMeter162', function (price) { // 小红订阅消息
  console.log('价格= ' + price); // 输出： '价格=2000000'
});
Event.listen('squareMeter28', function (price) { // 小红订阅消息
  console.log('价格= ' + price); // 输出： '价格=2000000'
});
Event.trigger('squareMeter88', 2000000); // 售楼处发布消息
Event.trigger('squareMeter28', 2000000);
console.log(Event)

Event.remove('squareMeter28');
Event.trigger('squareMeter162', 2000000); // 售楼处发布消息
console.log('remove squareMeter28', Event)


// ==============模块间的通信 ==============

var a = (function () {
  var count = 1;
  var button = document.getElementById('count');
  button.onclick = function () {
    Event.trigger('add', count++);
  }
})();
var b = (function () {
  var div = document.getElementById('show');
  Event.listen('add', function (count) {
    div.innerHTML = count;
  });
})();


// =================== 一个带有缓存的订阅-发布对象================
console.log('// =================== 一个带有缓存的订阅-发布对象================')
var NamespaceEvent = (function () {
  var Event, // 观察者
    _default = 'default'; // 默认的命名空间

  Event = function () {
    var _listen,
      _trigger,
      _remove,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      //全局命名空间的存储变量 新增命名空间，此处 namespaceCache = {default:{}, newNameSpace:{} }
      namespaceCache = {},
      _create,
      each = function (ary, fn) {
        // 一个手写的each方法
        var ret;
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };
    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };
    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };
    _trigger = function () {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        stack = cache[key]; //就是普通的获取 当前的key分类对应的 回调队列
      if (!stack || !stack.length) {
        return;
      }
      return each(stack, function () {
        return this.apply(_self, args);
      });
    };
    _create = function (namespace) {
      var namespace = namespace || _default;
      var cache = {}, // 存储对应命名空间的监听事件队列
        offlineStack = [], // 离线栈堆
        ret = {
          cache,
          namespaceCache,
          offlineStack,
          listen: function (key, fn, last) {
            _listen(key, fn, cache);
            if (offlineStack === null) {
              return;
            }
            if (last === 'last') { // 触发最后一个监听事件
              offlineStack.length && offlineStack.pop()();
            } else {
              // 执行每个离线堆栈事件
              each(offlineStack, function () {
                this();
              });
            }
            offlineStack = null;
          },
          one: function (key, fn, last) {
            _remove(key, cache);
            this.listen(key, fn, last);
          },
          remove: function (key, fn) {
            _remove(key, cache, fn);
          },
          trigger: function () {
            var fn,
              args,
              _self = this;
            _unshift.call(arguments, cache);
            args = arguments;
            fn = function () {
              return _trigger.apply(_self, args);
            };
            // 如果有离线事件，将其添加到队列中。
            if (offlineStack) {
              return offlineStack.push(fn);
            }
            return fn();
          }
        };
      return namespace ?
        (namespaceCache[namespace] ? namespaceCache[namespace] :  //如果创建的命名空间存在，则返回当前的命名空间的函数内容，否则返回ret
          namespaceCache[namespace] = ret)
        : ret;
    };

    // 如果没有创造命名空间，那么会依然会创建一个default的命名空间，否则，会执行create. 再创建空间 
    // 其中Event的命名空间 可以共享，因为它是全局的观察者模式
    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        var event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        var event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        var event = this.create();
        event.trigger.apply(this, arguments);
      }
    };
  }();


  return Event;
})()

/************** 先发布后订阅 ********************/
NamespaceEvent.trigger('click', 1);
NamespaceEvent.trigger('click', 2);
// NamespaceEvent.trigger('move', 1);
NamespaceEvent.listen('click', function (a) {
  console.log(a); // 输出： 1 2
});
/************** 使用命名空间 ********************/
let name1 = NamespaceEvent.create('namespace1')

name1.trigger('click', '123', 'last')
name1.trigger('click', '123', 'last')

console.log(name1)
console.log(NamespaceEvent) // create 增加命名空间

name1.listen('click', function (a) {
  console.log(a); // 输出： 1
});
name1.listen('click', function (a) {
  console.log('我是 namespace1 命名空间中 cache队列的最后一个回调函数 2',a); // 输出： 123
});

Event.create('namespace1').trigger('click', 1);
Event.create('namespace2').listen('click', function (a) {
  console.log(a); // 输出： 2
});
Event.create('namespace2').trigger('click', 2);