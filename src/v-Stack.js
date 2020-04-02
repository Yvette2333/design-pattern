// ===================基于数组的栈================ 
class Stack {

  constructor() {
    // 存储栈中元素
    this.items = []
  }
  push(arg) {
    this.items.push(arg)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items[this.items.length - 1]
  }
  clear() {
    this.items = []
  }
  size() {
    return this.items.length
  }
  isEmpty() {
    return this.size() === 0
  }
}

// ===================基于对象的栈=================
// let stack = new Stack();
// stack.push('1')
// stack.push('2')
// stack.push('3')
// stack.size()
// stack.pop()

class StackObj {
  constructor() {
    this.items = {}
    this.count = 0
  }
  push(element) {
    this.items[this.count] = element
    this.count++
  }
  pop() {
    if (this.isEmpty()) {
      return undefined
    }
    this.count--
    let result = this.items[this.count];
    delete this.items[this.count]
    return result
  }
  peek() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.count - 1]
  }
  clear() {
    this.items = {}
    this.count = 0
  }
  size() {
    return this.count
  }
  isEmpty() {
    return this.count === 0
  }
  toString() { //该函数时间复杂度 为O(this.count)
    if (this.isEmpty()) { return '' }
    let objString = `${this.items[0]}`;
    for (let i = 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`
    }
    return objString
  }
}

// let stackObj = new StackObj();
// stackObj.push('1')
// stackObj.push('2')
// stackObj.push('3')
// console.log(stackObj)
// console.log(stackObj.toString())
// console.log(stackObj.pop())
// console.log(stackObj)

// ===================十进制转二进制=================
function decimalToBinary(decNumber) {

  let remStack = new Stack();
  let number = decNumber;
  let rem; // 余数
  let binaryString = ''; // 返回的二进制数字

  while (number > 0) {
    rem = Math.floor(number % 2)
    remStack.push(rem)
    number =  Math.floor(number/2)
  }

  while (!remStack.isEmpty()) {
    binaryString += remStack.pop().toString(); // 拼接出栈的字符串
  }
  return binaryString 
}

console.log(decimalToBinary(10))
console.log(decimalToBinary(233))
console.log(decimalToBinary(1000))

// ===================十进制转任意进制=================
function baseConverter(decNumber,base) {

  let remStack = new Stack();
  const digists = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let number = decNumber;
  let rem; // 余数
  let baseString = ''; // 返回的二进制数字

  while (number > 0) {
    rem = Math.floor(number % base)
    remStack.push(rem)
    number =  Math.floor(number/base)
  }

  while (!remStack.isEmpty()) {
    baseString += digists[remStack.pop()]; // 拼接出栈的字符串
  }

  return baseString 
}

console.log(baseConverter(100345,10)) // 100345
console.log(baseConverter(100345,35)) // 2BW0
