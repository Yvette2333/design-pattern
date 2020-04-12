// 11 - 模版方法模式
// 模版方法模式 的核心内容在于抽象类与具体类的实现，即通过继承/传参的手段来实现相同接口的调用与覆盖

// =========  一个简单的喝咖啡的列子  ==========
// 1- 抽象类中的抽象方法为了防止具体类的漏写，抛出了错误
// 2- 具体类中的具体方法尽量与抽象类中抽象方法保持一致，必须重写🌟🌟🌟
// 3- 为了防止具体类中有特殊的实现，我们可以添加钩子函数在抽象类中，同时，具体类也需要对钩子进行覆盖
class Drink {
  init() {
    this.boilWater();
    this.brewDrink();
    this.pourInCup();
    if (this.customerWantsCondiments()) {
      this.addCondition();
    }
  }
  boilWater() { console.log('烧开水，抽象类的具体方法，随便用！') }
  brewDrink() { throw Error('抽象类的brewDrink抽象方法，你别用！') }
  pourInCup() { throw Error('抽象类的pourInCup抽象方法，把饮料倒进杯子！') }
  addCondition() { throw Error('抽象类的addCondition抽象方法，重新写一个加调料的方法吧～！') }
  // 钩子函数
  customerWantsCondiments() { return true }
}

class Tea extends Drink {
  constructor(teaType) {
    super()
    this.teaType = teaType
  }
  brewDrink() { console.log('开水泡茶', this.teaType) }
  pourInCup() { console.log('倒茶', this.teaType) }
  addCondition() { console.log('加个柠檬精', this.teaType) }
}

class Coffee extends Drink {
  constructor(coffeeType) {
    super()
    this.coffeeType = coffeeType
  }
  brewDrink() { console.log('开水泡咖啡', this.coffeeType) }
  pourInCup() { console.log('倒茶', this.coffeeType) }
  addCondition() { console.log('加奶加糖', this.coffeeType) }
  customerWantsCondiments() { console.log('减肥阿！不加奶不加糖'); return false }
}

const xhlj = new Tea('西湖龙井')
xhlj.init()

console.log("=============================")
const hms = new Coffee('热美式')
hms.init()

//  ===============如果不想写继承，那就用函数传参来形成 ==================
console.log("=========不想继承====================")
function Beverage(params) {
  const boilWater = () => console.log('烧开水')
  const brew = params.brew || function () { throw Error('泡具体的xxx') } 
  const pourInCup = params.pourInCup || function () { throw Error('倒具体的xxx进杯子') } 
  const addCondiments = params.addCondiments || function () { throw Error('添加具体的xxx进xxx') } 

  var F = function () { };
  F.prototype.init = function () {
    boilWater();
    brew();
    pourInCup();
    addCondiments();
  };
  return F;
}
var CoffeeObj = Beverage({
  brew: function () {
    console.log('用沸水冲泡咖啡');
  },
  pourInCup: function () {
    console.log('把咖啡倒进杯子');
  },
  addCondiments: function () {
    console.log('加糖和牛奶');
  }
});
var coffee = new CoffeeObj();
coffee.init();