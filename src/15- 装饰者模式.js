// 装饰者模式

(function () {

  console.log("======== 模拟传统面向对象语言对装饰者模式 ========")
  const Plane = function () { };
  Plane.prototype.fire = function () {
    console.log('发射普通子弹')
  }
  const MissileDecorator = function (plane) {
    this.plane = plane;
  }
  MissileDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射导弹')
  }

  const AtomDecorator = function (plane) {
    this.plane = plane;
  }
  AtomDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射原子弹')
  }

  let p = new Plane();
  p = new MissileDecorator(p);
  p = new AtomDecorator(p);

  p.fire()

})();


(function () {

  console.log('=========JS的装饰者=======')
  var plane = {
    fire: function () {
      console.log('发射普通子弹')
    }
  }

  var missileDecorator = function () {
    console.log('发射导弹');
  }

  var atomDecorator = function () {
    console.log('发射原子弹');
  }

  // 改写plane.fire

  var fire1 = plane.fire;
  plane.fire = function () {
    fire1();
    missileDecorator();
  }

  // 改写plane.fire
  var fire2 = plane.fire;
  plane.fire = function () {
    fire2();
    atomDecorator();
  }
  plane.fire();


})();


(function(){
  console.log('======= 使用AOP的方式来装饰函数 ==========')
  // 该方式是在原型上进行before/after的扩展 
  Function.prototype.before = function (beforeFn) {
    var _self = this;
    return function () {
      // 此处的this指向function
      beforeFn.apply(this,arguments);
      return _self.apply(this,arguments)
    }
  }

  Function.prototype.after = function (afterFn) {
    var _self = this;
    return function () {
      let ret = _self.apply(this,arguments);
      // 在执行函数之后进行处理
      afterFn.apply(this,arguments);
      return ret;
    }
  }


  console.log('======= 使用函数来进行装饰 ==========')
  // 即装饰新函数与原函数
  var before = function (fn,beforefn) {
    return function () {
      beforefn.apply(this,arguments);
      return fn.apply(this,arguments);
    }
  }

  // var a = before(
  //   function(){ alert(3)},
  //   function(){ alert(2)}
  // )
  // a = before(a,function(){alert(1)})
  // a ()

})();

(function(){
  console.log("========= AOP 的实际案例 =======")

  var getToken = function () {
    return 'token';
  }

  var ajax = function(type,url,param) {
    param = param || {};
    param.Token = getToken();
  }

  // 以上的ajax中耦合了两个职能，可以通过装饰者模式将其拆开
  console.log("========= AOP动态改变函数的参数 =======")

  var ajax = function(type,url,param) {
    param = param || {};
    console.log(param)
  }

  Function.prototype.before = function(beforefn) {
    var _self = this;
    return function() {
      // 此处beforefn会处理function中的参数，
      beforefn.apply(this,arguments);
      return _self.apply(this,arguments);

    }
  }
  
  ajax = ajax.before(function(type,url,param){
    param.Token = getToken()
  })

  ajax( 'get', 'http:// xxx.com/userinfo', { name: 'sven' } ); //{name: "sven", Token: "token"}

})();


