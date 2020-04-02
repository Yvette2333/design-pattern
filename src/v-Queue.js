// ===================基于对象的队列=================

class Queue {
  constructor() {
    this.items = {} // 队列
    this.lowestCount = 0  // 追踪队头的索引
    this.count = 0 // 队列数量
  }
  enqueue(element) {
    this.items[this.count] = element
    this.count++
  }
  dequeue() {
    if (this.isEmpty()) {
      return undefined
    }
    let result = this.items[this.lowestCount]; //读取队头数据
    delete this.items[this.lowestCount]
    this.lowestCount++ //队头索引向后移动 
    return result
  }
  peek() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.lowestCount - 1]
  }
  clear() {
    this.items = {}
    this.count = 0
    this.lowestCount = 0
  }
  size() {
    return this.count - this.lowestCount
  }
  isEmpty() {
    // 如果队列长度与队头的索引相差为0，则队列为空
    return this.size() === 0
  }
  // 模拟数组读取元素
  //该函数时间复杂度 为O(this.count - this.lowestCount)
  toString() {
    if (this.isEmpty()) { return '' }
    // 由于我们无法确定队头的索引是多少，需要使用 lowestCount来确定循环起始位置, 而不是栈中的0(栈底)
    let objString = `${this.items[this.lowestCount]}`;
    console.log('tostring',this.lowestCount,this.count)
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`
    }
    return objString
  }
}

let que = new Queue()
que.enqueue('1')
que.enqueue('2')
que.enqueue('3')
console.log(que.toString())
que.dequeue()
console.log(que.toString())


// ===================基于对象的双端队列=================
// 需要保持队头的索引总为0
class Deque {
  constructor() {
    this.items = {} // 队列
    this.lowestCount = 0  // 追踪队头的索引
    this.count = 0 // 队列数量
  }
  addFront(element) {
    if (this.isEmpty()) {
      // 双端队列为空
      this.addBack()
    } else if (this.lowestCount > 0) {
      // 双端队列的队头曾经被移除过
      this.lowestCount--
      this.items[this.lowestCount] = element
    } else {
      // this.lowestCount = 0 && this.count !==0 
      // 但是我们需要在-1位置 添加一个元素，而我们需要保持双端索引为0
      // 整体元素向后移动一位
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i-1]
      }
      this.count++;
      this.lowestCount = 0;
      this.items[0] = element; // 将新增的元素放在队头
    }
  }
  addBack(element) {
    // 与Queue.enquque保持一致
    this.items[this.count] = element
    this.count++
  }
  removeFront(){
    // 同Queue.dequeue
    if (this.isEmpty()) {
      return undefined
    }
    let result = this.items[this.lowestCount]; //读取队头数据
    delete this.items[this.lowestCount]
    this.lowestCount++ //队头索引向后移动 
    return result
  }
  removeBack(){
    // 同Stack.pop
    if (this.isEmpty()) {
      return undefined
    }
    this.count--
    let result = this.items[this.count];
    delete this.items[this.count]
    return result
  }
  peekFront(){
    // 同Queue.peek
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.lowestCount - 1]
  }
  peekBack() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.count - 1]
  }
  // 与队列保持一致
  clear() {
    this.items = {}
    this.count = 0
    this.lowestCount = 0
  }
  size() {
    return this.count - this.lowestCount
  }
  isEmpty() {
    // 如果队列长度与队头的索引相差为0，则队列为空
    return this.size() === 0
  }
  toString() {
    if (this.isEmpty()) { return '' }
    // 由于我们无法确定队头的索引是多少，需要使用 lowestCount来确定循环起始位置, 而不是栈中的0(栈底)
    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`
    }
    return objString
  }
}

let deq = new Deque();

deq.addBack('addBack')
deq.addFront('1')

console.log(deq.toString())