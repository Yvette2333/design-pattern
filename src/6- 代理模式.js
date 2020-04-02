// 代理模式
// 🌟🌟🌟 代理模式遵循单一职责的原则，需要保证每个函数调用的粒度
// 🌟🌟🌟 本体与代理的接口需要保持一致。并且调用的时候，结果保持一致性
// 🌟🌟🌟 同时代理模式通常是在本体上做处理， 这也可以符合单例的要求

// 代理模式
console.log('// ====================通过图片占位图来展示代理概念====================')

let imgPic = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'

var myImg = (function () {
  var imgNode = document.createElement('img');
  document.body.appendChild(imgNode);

  return function (src) {
    imgNode.src = src
  }

})()
myImg('32332')
var proxyImg = (function () {
  var img = new Image;
  img.onload = function () {
    myImg(this.src)
  }
  return function (src) {
    myImg('previe loading...')
    img.src = src
  }
})()
proxyImg('imgPic')

// ====================虚拟代理合并Http请求 - 模拟====================
console.log('// ====================虚拟代理合并Http请求 - 模拟====================')
// 本体函数
function synchronousFile(id) {
  console.log('id:', id)
}
for (let c = 0; c < 3; c++) {
  synchronousFile(c);
}
// id:0
// id:1
// id:2

// 代理需求 ， - 将Httpq请求整合到一起发出请求
let proxySynchronousFile = (function () {
  var cache = []; //保存一段时间内需要同步的ID
  var timer = null; // 定时器
  return function (id) {
    cache.push(id);
    if (timer) { return; }
    // 2s 后向本体发送需要的同步的ID合集
    timer = setTimeout(function () {
      synchronousFile(cache.join(','))
      clearTimeout(timer); // reset
      timer = null;// reset
      cache = []; // reset
    }, 2000)
  }
})()

// 实现2s后的延时处理
for (let c = 0; c < 3; c++) {
  proxySynchronousFile(c); // id: 0,1,2
}


// ============== 缓存代理函数 ==============
// 如果该传入参数一致，则不参与本体计算，直接使用代理缓存

console.log('// ==================== 缓存代理函数 ====================')
// 本体
function mul() {
  let result = 1;
  console.log('本体mul被调用了')
  if (!arguments.length) { return 0 }
  for (let i = 0; i < arguments.length; i++) {
    result *= arguments[i]
  }
  return result
}
mul(2, 3, 4)

// 利用闭包来进行代理缓存的处理
var proxtMul = (function () {
  let cache = {}
  return function () {
    // 将参数组为字符串，存储在cache中
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return cache[args] = mul.apply(this, arguments)
  }
})()
proxtMul(1, 2, 3, 4)
proxtMul(1, 2, 3, 4) // 此处的result 将会从cache中返回 


console.log('// ==================== 使用高阶组件进行动态代理 ====================')
// ==================== 使用高阶组件进行动态代理 ====================
// 高阶组件的缓存代理，无须介意本体的执行函数为什么

/**************** 计算乘积 *****************/
var mult = function () {
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};
/**************** 计算加和 *****************/
var plus = function () {
  console.log('called: plus')
  var a = 0;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a + arguments[i];
  }
  return a;
};

// 高阶函数
function createProxyCache(fn) {
  let cache = {}
  return function () {
    var args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    return cache[args] = fn.apply(this, arguments);
  }
}

let proxyPlus = createProxyCache(plus);
let result = proxyPlus(1,2,3,4)
let result1 = proxyPlus(1,2,3,4)
console.log('√proxyPlus',result)