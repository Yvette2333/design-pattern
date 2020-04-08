// JavaScrpt 数据结构与算法 -- Set

// ============= 使用class 来写一个 set集合 ================
console.log('============= 使用class 来写一个 set集合 ===============')

class MySet {
  constructor() {
    this.items = {}
  }

  // 检测当前集合是否存在该元素，以下方法都可实现boolean的返回
  has(element) {
    // return !!this.items[element] 

    // xx in xx,会顺势对原型链作出查找，不采用
    // return element in items 

    // 由于this.items是一个对象，防止原型链的产生，则此处使用hasOwnProperty
    return Object.prototype.hasOwnProperty.call(this.items, element)
  }

  // 集合是由一组无序且唯一（即不能重复）的项组成的
  add(element) {
    if (!this.has(element)) {
      this.items[element] = element
      return true
    }
    return false
  }

  // 删除集合中的某个元素
  delete(element) {
    if (this.has(element)) {
      delete this.items[element];
      return true
    }
    return false
  }

  // 清空
  clear() {
    this.items = {}
  }

  //当前集合的元素个数
  size() {
    // let size = Object.keys(this.items).length;  
    // let size = Object.values(this.items).length; 

    // 🌟为了防止原型链或其他状况， 我们仍需要使用hasOwnProperty 来判断，当前key是否真实存在
    let size = 0;
    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        size++;
      }
    }
    return size
  }

  values() {
    // 可以直接使用Object.values 
    // return Object.values(this.items);

    // 🌟为了防止原型链或其他状况， 我们仍需要使用hasOwnProperty 来判断，当前values是否真实存在
    let realValues = [];
    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        realValues.push(key) // 放入当前遍历的值
      }
    }
    return realValues
  }

  // 取一个值的集合，并去重，返回一个新集合
  union(otherSet) {
    const unionSet = new MySet();
    this.values().forEach(value => unionSet.add(value))
    otherSet.values().forEach(value => unionSet.add(value))
    return unionSet
  }

  // 交集，返回一个新集合 intersection
  intersection(otherSet) {
    const intersectionSet = new MySet();
    // 由于时间复杂度问题， 我们通常会 取最小长度的集合来进行forEach，
    const values = this.values(); // 返回数组
    const otherValues = otherSet.values();// 返回数组
    let biggerSet = values;
    let smallerSet = otherValues;
    if (smallerSet.length - biggerSet.length > 0) {
      smallerSet = values;
      biggerSet = otherValues;
    }

    smallerSet.forEach(item => {
      if (biggerSet.includes(item)) {
        intersectionSet.add(item)
      }
    })

    return intersectionSet
  }

  // 差集， 返回一个【存在于第一个集合】且【不存在于第二个集合中的元素】的新集合。
  // 此处不可以减少时间复杂度， 因为在数学中，A与B的差集 不等于 B与A的差集 
  difference(otherSet) {
    const differenceSet = new MySet();
    const otherValues = otherSet.values()
    this.values().forEach(item => {
      if (!otherValues.includes(item)) {
        differenceSet.add(item)
      }
    })
    return differenceSet
  }

  // 判断A(this)是否为B子集
  isSubsetOf(otherSet) {
    // 如果A集长度大于B集，那么肯定不是B的子集
    if (this.size() > otherSet.size()) {
      return false
    }
    let isSubset = true;

    // every 相当于一个while循环，当回调函数返回false的时候，跳出循环
    this.values().every(item => {
      if (!otherSet.has(item)) {
        isSubset = false;
        return false
      }
      return true
    })

    return isSubset
  }
}

const A = new MySet();
A.add("a")
A.add("3")
A.add("c")
// console.log(A.values()) // 3,a,c  object中会按照ascii输出排序？？

const B = new MySet();  // a,3,9
B.add("a")
B.add("3")
B.add("9")

console.log(A.union(B).values())  // 3,9,a,c
console.log(A.intersection(B).values())  // 3,a
console.log(A.difference(B).values())  // c
console.log(A.isSubsetOf(B))  // false


// ============= 使用es5 Set 来进行模拟运算 ================
console.log('============= 使用es5 Set 来进行模拟运算 ===============')
const SetA = new Set([1, 2, 3])
const SetB = new Set([2, 3, 4])

const union = (A, B) => {
  const AB = new Set();
  A.forEach(item => AB.add(item))
  B.forEach(item => AB.add(item))
  return AB
}
console.log(union(SetA, SetB)) // 1234


const intersection = (A, B) => {
  const C = new Set();
  A.forEach(item => {
    if (B.has(item)) {
      C.add(item)
    }
  })
  return C
}
console.log(intersection(SetA, SetB)) // 23


const difference = (A, B) => {
  const C = new Set();
  A.forEach(item => {
    if (!B.has(item)) {
      C.add(item)
    }
  })
  return C
}
console.log(difference(SetA, SetB)) // 1
console.log(difference(SetB, SetA)) // 4

// ============= 使用es5 扩展运算符 来进行模拟运算, ================
console.log('============= 使用es5 扩展运算符 来进行模拟运算===============')
// 并集
console.log(new Set([...SetA, ...SetB]))

// 交集
console.log(new Set([...SetA].filter(item => [...SetB].includes(item))))
console.log(new Set([...SetA].filter(item => SetB.has(item))))

// 差集
console.log(new Set([...SetA].filter(item => ![...SetB].includes(item))))
console.log(new Set([...SetA].filter(item => !SetB.has(item))))




