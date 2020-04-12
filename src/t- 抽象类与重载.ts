//  TS 抽象类与具体类 AND  overload 
// ========== 抽象类 ==========
abstract class Animal {
  name!:string;
  abstract speak():void; // 此处被抽象的抽象方法，必须被具体类覆盖 🌟
}
interface Flying {
  fly():void
}
interface DeadLine {
  isDead:boolean
}

// ========== 抽象类Animal的具体类Cat ========= 
class Cat extends Animal {
  // override 重写的抽象方法 🌟
  speak(){
      console.log('喵喵喵');
  }
}

// ========== 具体类 - implements
class Butterfly extends Animal implements Flying,DeadLine {

  // 抽象接口DeadLine的实现，并赋予初始值
  isDead: boolean = false; 

  // override 重写的抽象方法 🌟
  speak(): void {
    console.log('蝴蝶。。怎么叫')
  }
  // 抽象接口Flying的实现
  fly():void {
    console.log("与生俱来的能力")
  }
}

let cat = new Cat();
cat.speak();


// ========== 函数的重载 overload ===============
// 有时候一个函数 参数有不同类型的组合，如  string,number || string,bool || number,bool
function add (arg1:string,arg2:number):any ;
function add (arg1:string,arg2:boolean):any ;
function add (arg1:number,arg2:boolean):any ;
function add (arg1:any,arg2:any):any {
  if (typeof arg2 === 'boolean') {
    return typeof arg1
  } else {
    return arg1 + arg2
  }
}

// add({},12)  // 将会匹配3种overload ， 报错
console.log(add('yuwei',2333)) //yuwei2333
console.log(add('yuwei',false)) // string
console.log(add(123,true))  //number