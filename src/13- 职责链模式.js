// 职责链模式
// 职责链中会有多个处理函数用于处理对象，

//案例流程
// orderType：表示订单类型（定金用户或者普通购买用户）， code 的值为 1 的时候是 500 元
// 定金用户，为 2 的时候是 200 元定金用户，为 3 的时候是普通购买用户。
// pay：表示用户是否已经支付定金，值为 true 或者 false, 虽然用户已经下过 500 元定金的
// 订单，但如果他一直没有支付定金，现在只能降级进入普通购买模式。
// stock：表示当前用于普通购买的手机库存数量，已经支付过 500 元或者 200 元定金的用
// 户不受此限制。

// ============ 普通的流程代码 ===========

let order = function (orderType, pay, stock) {
  if (orderType === 1) { // 500元定金购买模式
    if (pay === true) {
      console.log('500 元定金预购, 得到 100 优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，0优惠')
      } else {
        console.log('手机库存不足');
      }
    }
  } else if (orderType === 2) { // 200元定金购买模式
    if (pay === true) {
      console.log('200 元定金预购, 得到 50 优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，0优惠')
      } else {
        console.log('手机库存不足');
      }
    }
  } else if (orderType === 3) { // 普通购买
    if (stock > 0) {
      console.log('普通购买，0优惠')
    } else {
      console.log('手机库存不足');
    }
  } else {
    throw new Error('别买了 啥也不是')
  }
};

// ========== 职责链重构以上代码 =============
// 将不同类型的购买方式分离出来，并传序后续的判断
(function () {

  const order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500 元定金预购, 得到 100 优惠券');
    } else {
      order200(orderType, pay, stock)
    }
  }

  const order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200 元定金预购, 得到 50 优惠券');
    } else {
      orderNormal(orderType, pay, stock)
    }
  }

  const orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买')
    } else {
      console.log('没库存了')
    }
  }

  order500(1, true, 500); // 输出： 500 元定金预购, 得到 100 优惠券
  order500(1, false, 500); // 输出：普通购买, 无优惠券
  order500(2, true, 500); // 输出： 200 元定金预购, 得到 500 优惠券
  order500(3, false, 500); // 输出：普通购买, 无优惠券
  order500(3, false, 0); // 输出：手机库存不足
})();

// ============= 灵活拆分职责链节点 ===========
// 上面的案例耦合度太强了，需要解藕
// 不符合开放-封闭原则
(function () {
  console.log("============= 灵活拆分职责链节点 ===========")

  const order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500 元定金预购, 得到 100 优惠券');
    } else {
      return 'nextSuccessor'
    }
  }

  const order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200 元定金预购, 得到 50 优惠券');
    } else {
      return 'nextSuccessor'
    }
  }

  const orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买')
    } else {
      console.log('没库存了')
    }
  }

  //将函数包装进职责链节点
  class Chain {
    constructor(fn) {
      this.fn = fn;
      this.successor = null;
    }

    setNextSuccessor(successor) {
      return this.successor = successor;
    }

    passRequest() {
      // 执行传入的fn，并获取返回值
      const ret = this.fn.apply(this, arguments);
      if (ret === 'nextSuccessor') {
        // 如果仍然有下一个函数，那么就反复调用该函数.passRequest 
        // .. 直到有返回值
        return this.successor && this.successor.passRequest.apply(this.successor, arguments)
      }
      return ret
    }
  }

  var chainOrder500 = new Chain(order500);
  var chainOrder200 = new Chain(order200);
  var chainOrderNormal = new Chain(orderNormal);

  // 设定职责链的顺序
  chainOrder500.setNextSuccessor(chainOrder200).setNextSuccessor(chainOrderNormal)

  // 执行  此处的起点永远是chainOrder500 🌈
  chainOrder500.passRequest(1, true, 500); // 输出： 500 元定金预购，得到 100 优惠券
  chainOrder500.passRequest(2, true, 500); // 输出： 200 元定金预购，得到 50 优惠券
  chainOrder500.passRequest(3, true, 500); // 输出：普通购买，无优惠券
  chainOrder500.passRequest(1, false, 0); // 输出：手机库存不足

})();

// ============= 异步职责链  ===========
(function () {
  console.log("============= 异步职责链 ===========")
  class Chain {
    constructor(fn) {
      this.fn = fn;
      this.successor = null;
    }

    setNextSuccessor(successor) {
      return this.successor = successor;
    }

    passRequest() {
      // 执行传入的fn，并获取返回值
      const ret = this.fn.apply(this, arguments);
      if (ret === 'nextSuccessor') {
        // 如果仍然有下一个函数，那么就反复调用该函数.passRequest 
        // .. 直到有返回值
        return this.successor && this.successor.passRequest.apply(this.successor, arguments)
      }
      return ret
    }

    // 异步函数直接调用下一个链式节点
    next() {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }
  }

  var fn1 = new Chain(function () {
    console.log(1)
    return 'nextSuccessor'
  })

  var fn2 = new Chain(function () {
    console.log(2)
    setTimeout(() => { //箭头函数的闭包直接记录this
      this.next()
    }, 2000)
  })

  var fn3 = new Chain(function () {
    console.log(3)
    return 'nextSuccessor'
  })

  fn1.setNextSuccessor(fn2).setNextSuccessor(fn3)
  fn1.passRequest()
})();

// =========== AOP 实现 =============
(function () {

  console.log("============= AOP 实现职责链 ===========")

  const order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500 元定金预购, 得到 100 优惠券');
    } else {
      return 'nextSuccessor'
    }
  }

  const order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200 元定金预购, 得到 50 优惠券');
    } else {
      return 'nextSuccessor'
    }
  }

  const orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买')
    } else {
      console.log('没库存了')
    }
  }

  Function.prototype.after = function (fn) {
    let _this = this;
    return function () {
      var ret = _this.apply(fn, arguments);
      if (ret === 'nextSuccessor') {
        return fn.apply(this, arguments)
      }
      return ret
    }
  }

  let order = order500.after(order200).after(orderNormal);

  order(1,true,500)

})()
