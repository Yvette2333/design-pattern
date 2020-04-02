// 策略模式
// 通常情况下，我们会使用if else / switch 来表示对不同条件的不同处理

// 普通情况--------
class User {
  constructor(type) {
    this.type = type
  }
  buy() {
    if (this.type === 'orginary') {
      console.log('orginary')
    } else if (this.type === 'member') {
      console.log('member')
    } else if (this.type === 'vip') {
      console.log('vip')
    }
  }
}
let u1 = new User('orginary')
u1.buy()

// - 策略模式
// 将以上的3种if else 进行更改
class OriginaryUser {
  buy() {
    console.log('orginary')
  }
}
class MemberUser {
  buy() {
    console.log('MemberUser')
  }
}
class VipUser {
  buy() {
    console.log('VipUser')
  }
}
let u2 = new VipUser()
u2.buy()

// =============== JS设计模式与开发实践 ===============
// 通常情况下if/else 要处理的业务逻辑需要分离出来。
// 以strategies为例，使用obj的方式来进行策略分离，也可以使用class来进行
/** 策略对象 **/
let strategies = {
  "isNonEmpty": function (val, errMsg) {
    if (val === '') {
      return errMsg
    }
  },
  "minLength": function (val, length, errMsg) {
    if (val.length < length) {
      return errMsg
    }
  },
  "isMobile": function (val, errMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(val)) {
      return errMsg;
    }
  }
}

/** 验证类  **/
class Validator {

  constructor() {
    this.cache = []
  }

  add(dom, rules) {
    for (let i = 0; i > rules.length; i++) {
      let rule = rules[i];
      var strategyAry = rule.strategy.split(':');
      var errorMsg = rule.errorMsg;

      this.cache.push(function () {
        var strategy = strategyAry.shift();
        strategyAry.unshift(dom.value);
        strategyAry.push(errorMsg);
        return strategies[strategy].apply(dom, strategyAry);
      })
    }
  }

  start() {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
      var errorMsg = validatorFunc();
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}
/** 用户调用  **/
var registerForm = document.getElementById('registerForm');
var validataFunc = function () {
  var validator = new Validator();
  validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:6',
    errorMsg: '用户名长度不能小于 10 位'
  }]);
  validator.add(registerForm.password, [{
    strategy: 'minLength:6',
    errorMsg: '密码长度不能小于 6 位'
  }]);
  validator.add(registerForm.phoneNumber, [{
    strategy: 'isMobile',
    errorMsg: '手机号码格式不正确'
  }]);
  // 执行验证，
  var errorMsg = validator.start();
  return errorMsg;
}

registerForm.onsubmit = function () {
  var errMsg = validataFunc();
  if (errMsg) { 
    alert(errMsg)
    return false
  }
}