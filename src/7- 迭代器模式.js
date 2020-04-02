// 迭代器模式 
// =============  常见的内部迭代器 ================
// jQuery 中的迭代器

// $.each([1, 2, 3], function (i, n) {
//   console.log('当前下标：', i)
//   console.log('当前值：', n)
// })

//  ==========实现一个内部迭代器====================
var each = function (ary, callback) {
  if (!(callback instanceof Function)) {
    throw Error('第二个参数需要为function')
  }
  for (let i = 0; i < ary.length; i++) {
    // 更改callback的this指向，并传递当前的下标与值
    callback.call(ary[i], i, ary[i])
  }
}
// 验证内部迭代器
each([1, 2, 3], function (i, n) {
  console.log('当前下标：', i)
  console.log('当前值：', n)
})

// 如果需要对比两个数组直接的不同,在内部迭代器中，只能通过callback来处理
let arr1 = [1, 2, 3]
let arr2 = [1, 2, 3]

function compare(ary1, ary2) {
  if (ary1.length !== arr2.length) {
    throw new Error('ary1和ary2 not equal')
  }
  // 内部迭代器 需要在callback中来处理
  each(ary1, function (i, n) {
    if (n !== ary2[i]) {
      throw new Error('ary1和ary2 not equal')
    }
  })
  console.log('ary1和ary2 is equal')
}

compare(arr1, arr2)

//  ==========实现一个外部迭代器====================
var iterator = function (obj) {
  var current = 0;

  var next = function () {
    current += 1;
  }

  var isDone = function () {
    return current >= obj.length;
  }

  var getCurrItem = function () {
    return obj[current]
  }

  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem
  }

}

// 
var iterCompare = function (iterator1, iterator2) {

  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
      throw new Error('iterator1 和 iterator2 不相等');
    }
    iterator1.next();
    iterator2.next();
  }

  console.log('iterator1 和 iterator2 相等');

}

var iterator1 = iterator([1, 2, 3]);
var iterator2 = iterator([1, 2, 3]);
iterCompare(iterator1, iterator2); // 输出： iterator1 和 iterator2 相等


//  ==========实现一个 倒序迭代器 ====================
var reverseEach = function (ary, callback) {
  for (var l = ary.length - 1; l >= 0; l--) {
    callback(l, ary[l]);
  }
}
reverseEach([0, 1, 2], function (i, n) {
  console.log(n); // 分别输出： 2, 1 ,0
});

//  ==========实现一个 中止迭代器 ====================
var each = function (ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    if (callback(i, ary[i]) === false) { // callback 的执行结果返回 false，提前终止迭代
      break;
    }
  }
};

each([1, 2, 3, 4, 5], function (i, n) {
  if (n > 3) { // n 大于 3 的时候终止循环
    return false;
  }
  console.log(n); // 分别输出： 1, 2, 3
});

// ========== 迭代器模式的应用举例 =============

//基础案例
var getUploadObj = function () {
  try {
    return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
  } catch (e) {
    if (supportFlash()) { // supportFlash 函数未提供
      var str = '<object type="application/x-shockwave-flash"></object>';
      return $(str).appendTo($('body'));
    } else {
      var str = '<input name="file" type="file"/>'; // 表单上传
      return $(str).appendTo($('body'));
    }
  }
};

// 以上的案例中，需要判断兼容性环境下使用哪种方式来进行上传处理
// 案例更改
function getActiveUploadObj() {
  try {
    return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
  } catch (e) {
    return false;
  }
}

function getFlashUploadObj() {
  if (supportFlash()) { // supportFlash 函数未提供
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $(str).appendTo($('body'));
  }
  return false;
}
function getFormUpladObj() {
  var str = '<input name="file" type="file" class="ui-file"/>'; // 表单上传
  return $(str).appendTo($('body'));
}

// 编写一个迭代器 来返回可用的兼容函数
function iteratorUplpadObj() {
  for (var i = 0, fn; fn = arguments[i++];) {
    var uploadObj = fn();
    if (uploadObj !== false) {
      return uploadObj;
    }
  }
}
var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj );
