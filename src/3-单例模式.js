// Javascript设计模式与开发实践 - 单例模式
// - 符合单一职责原则
// - 没有违反开放闭合原则


// ================== 基本的单例模式 ===================ç
// class LoginForm {
//   constructor() {
//     this.state = 'hide'
//   }
//   show() {
//     if (this.state === 'show') {
//       alert('哈市show ')
//       return
//     }
//     this.state = 'show'
//     console.log('登陆框展示成功')
//   }
//   hide() {
//     if (this.state === 'hide') {
//       alert('哈市show ')
//       return
//     }
//     this.state = 'hide'
//     console.log('登陆框隐藏成功')
//   }
// }

// // 利用闭包来使Instance为单例
// LoginForm.getInstance = (function () {
//   let instance
//   return function () {
//     if (!instance) {
//       instance = new LoginForm()
//     }
//     return instance
//   }
// })()

// let login1 = LoginForm.getInstance()
// login1.show()

// let login2 = LoginForm.getInstance()
// login2.hide()

// console.log('login1 === login2', login1 === login2)

// ================== 透明的单例模式 ===================
console.log('================== 透明的单例模式 ===================')

// var CreateDiv = (function () {
//   var instance;

//   var CreateDiv = function(html) {
//     if (instance){ return instance }
//     this.html = html;
//     this.init();
//     return instance = this;
//   }
//   CreateDiv.prototype.init = function () {
//     var div = document.createElement('div');
//     div.innerHTML = this.html;
//     console.log(div)
//   }
//   return CreateDiv
// }) ()

// var a = new CreateDiv('666')
// var b = new CreateDiv('777')
// console.log(a)
// console.log(b)


console.log('================== 用代理实现的单例模式 ===================')
// ================== 用代理实现的单例模式 ===================
// class CreateDiv {
//   constructor (html) {
//     this.html = html;
//     this.init()
//   }
//   init() {
//     var div = document.createElement('div');
//     div.innerHTML = this.html;
//     console.log('div',div)
//   }
// }
// // 这里的代理专门针对与 new CreateDiv(html) 
// let proxySingletonCreateDiv = (function() {
//   var instance ;
//   return function (html) {
//     if (instance) { return instance}
//     instance = new CreateDiv(html);
//     return instance
//   }
// })()

// let a1 = proxySingletonCreateDiv('444');
// let a2 = proxySingletonCreateDiv('666');
// console.log(a1)
// console.log(a2)
// console.log('a1===a2',a1 === a2)


console.log('================== 通用的惰性单例模式 ===================')
// ================== 通用的惰性单例模式 ===================
// 也就是说，我们需要把用户需要做的事情，单独分离出来
// 而管理单例 我们只专注于区分该单例模式是否存在 - 任何用户传入的对象，都可以与单例进行组合使用

var getSingle = function (fn) {
  var result;
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}

// function createLoginLayer(html) {
//   var div = document.createElement('div');
//   div.innerHTML = html;
//   console.log(html)
//   div.style.display = 'none';
//   return div;
// }
// createLoginLayer.prototype.getHtml = function () {
//   console.log(this.html)
// }

// var singleCreateLogin = getSingle(createLoginLayer);

// let a = singleCreateLogin('123')
// let b = singleCreateLogin('2333')
// console.log(a === b)

