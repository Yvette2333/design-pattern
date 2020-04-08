/*
 * @Author: yuwei LinkedList 链表
 * @Date: 2020-04-03 16:43:56 
 * @Last Modified by: yuwei
 * @Last Modified time: 2020-04-08 22:58:34
 */

// 实现一个链表
function defaultEquals(a, b) {
  return a === b
}

// 模拟一个链表项所拥有的属性 ，元素由【存储元素本身的节点】和【一个指向下一个元素的引用】（指针）组成
class Node {
  constructor(element) {
    this.element = element;
    this.next = undefined
  }
}

// ================ 写一个单向链表结构 =======================
// 链表的特性， 永远要从 this.head向后遍历来获取节点， 
// 单向链表，每个节点中，都有一个next 来指向下一个节点
class LinkedList {
  constructor(equalsFn = defaultEquals) {
    this.count = 0; // 存储链表中的数量
    this.head = undefined; // 保存第一个元素的引用
    this.equalsFn = equalsFn; // 用于对比元素是否相等
  }

  push(element) {
    let node = new Node(element)
    let current; // 存储当前遍历的项
    if (!this.head) {
      // 如果链表为空
      this.head = node
    } else {
      // 找到链表的最后一项，
      while (!current.next) {
        current = current.next;
      }
      current.next = node; // 将最后一项的next复制给node即可
    }
    this.count++;
  }

  /**
   * 
   * @param {定位信息} index 
   */
  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next; // undefined
      } else {
        let previous = this.getElementAt(index - 1); // 当前元素的前一个
        current = previous.next; // 上一个next中存放的current {element:xx,next:xx}
        previous.next = current.next;
      }
      this.count--;
      return current.element //返回当前删除的元素
    } else {
      return undefined
    }
  }

  getElementAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      // 遍历锁定的位置，为最大次数，
      for (let i = 0; i < index && current != null; i++) {
        current = current.next;
      }
      return current
    }
    return undefined
  }

  insert(element, index) {
    if (index >= 0 && index < this.count) {
      const node = new Node(element); // 要插入的元素
      if (index === 0) {
        const current = this.head;// 获取原始链头
        node.next = current; // 将node放到this.head前面
        this.head = node;
      } else {
        const previous = this.getElementAt(index - 1)
        const current = previous.next;
        //以下排序后链表实际的顺序： previous node current 
        previous.next = node;
        node.next = current;
      }
      this.count++;
      return true // 添加成功返回true

    } else {
      return undefined
    }
  }

  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.count && current !== null; i++) {
      if (defaultEquals(element, current.element)) {
        return i
      }
      current = current.next; // 替换下一个current
    }
    return -1 // 默认返回未找到的值
  }

  size() {
    return this.count
  }

  isEmpty() {
    return this.size() === 0
  }

  toString() {
    if (this.head === null) {
      return ''
    }
    let objString = `${thie.head.element}`;
    let current = this.head.next;
    for (let i = 1; i < this.size() && current != null; i++) {
      objString = `${objString},${current.element}`;
      current = current.element;
    }
    return objString
  }

}

// ================ 双向链表 ============================
// 双向链表中的节点，都会存在 prev来指向上一个节点，而next会指向下一个节点，
// 在新增删除的时候，我们需要更改前后的prev 与next链接。
class DoublyNode extends Node {
  constructor(element, next, prev) {
    super(element, next)
    this.prev = prev
  }
}

class DoublyLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
    super(equalsFn)
    this.tail = undefined; // 保存最后一个元素的引用
  }

  // 添加成功后返回bool
  insert(element, index) {
    if (index >= 0 && index < this.count) {
      const node = new DoublyNode(element); // 创建双向链表元素
      let current = this.head;
      // 在链头增加
      if (index === 0) { // 当链表数据为空
        // this.head总是等于链表的第一个元素
        if (this.head === null) {
          // 当前链表中没有任何一个元素
          this.head = node;
          this.tail = nodel
        } else {
          node.next = this.head;
          current.prev = node;
          this.head = node; // 更改this.head的指向
        }
      } else if (index === this.count) {
        // 在链尾增加
        current = this.tail;
        current.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        // 在中间插入
        const prev = current = this.getElementAt(index - 1);
        current = prev.next; // 这是下一个要链接的
        prev.next = node;
        current.prev = node;
        node.prev = prev;
        node.next = current;
      }

      this.count++;
      return true
    }
    return false
  }

  // removeAt
  removeAt(element, index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) { // 删除第一个
        this.head = current.next;
        if (this.count === 1) {
          //当前链表如果只有一个元素，
          this.tail = undefined
        } else {
          this.head.prev = undefined
        }

      } else if (idnex === this.count - 1) {
        // 删除最后一项
        current = this.tail;
        this.tail = current.prev;
        this.tail.next = undefined;
      } else {
        let previous = this.getElementAt(index - 1); // 当前元素的前一个
        current = previous.next; // 上一个next中存放的current {element:xx,next:xx}
        current.next.prev = previous;
        previous.next = current.next;
      }
      this.count--;
      return current.element //返回当前删除的元素
    } else {
      return undefined
    }
  }

}

// =========== 循环单向链表 =============
class CircularLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
    super(equalsFn)
  }

  insert(element, index) {
    if (index >= 0 && index < this.count) {
      const node = new Node(element); // 要插入的元素
      let current = this.head;// 获取原始链头
      if (index === 0) {
        // 🌟🌟🌟 这里做了更改
        if (this.head = null) {
          this.head = node;
          node.next = this.head; // 🌟形成链表循环
        } else {
          node.next = current; // 将node放到this.head前面
          this.head = node;
          // 🌟需要将最后一个元素.next 指向新增的元素
          current = this.getElementAt(this.size());
          current.next = this.head;

        }
      } else {
        const previous = this.getElementAt(index - 1)
        const current = previous.next;
        //以下排序后链表实际的顺序： previous node current 
        previous.next = node;
        node.next = current;
      }
      this.count++;
      return true // 添加成功返回true

    } else {
      return undefined
    }
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next; // undefined
        // 🌟如果当前链表只有一条数据
        if (this.size() === 1) {
          this.head = undefined;
        } else {
          // 🌟删除第一个
          const removed = this.head;
          current = this.getElementAt(this.size()); // 找到最后一个元素
          this.head = removed.next; // 将this.head 指向下一个
          current.next = removed.next; // 将最后一个元素的next指向this.head
          current = removed;  // 设置当前移除的元素
        }
      } else {
        let previous = this.getElementAt(index - 1); // 当前元素的前一个
        current = previous.next; // 上一个next中存放的current {element:xx,next:xx}
        previous.next = current.next;
      }
      this.count--;
      return current.element //返回当前删除的元素
    } else {
      return undefined
    }
  }
}

// =========== 有序链表 =============
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
}

function defaultCompare(a, b) {
  if (a === b) {
    return 0
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN
}

class SortedLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals, CompareFn = defaultCompare) {
    super(equalsFn);
    this.CompareFn = CompareFn;
  }

  insert(element, index = 0) {
    if (this.isEmpty()) {
      return super.insert(element, 0)
    }

    const pos = this.getIndexNextSortedElement(element);
    return super.insert(element, pos)

  }

  getIndexNextSortedElement(element) {
    let current = this.head;
    let i = 0;
    for (; i < this.size() && current; i++) {
      // 比较两个元素的大小/
      const comp = this.CompareFn(element,current.element);
      if (comp === Compare.LESS_THAN) {
        // 插入的元素小于当前的元素，那么就在此处insert
        return i
      }
      current = current.next ;//遍历链表
    }
    return i 
  }
}