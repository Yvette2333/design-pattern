// 享元（flyweight）模式

// ======== 文件上传的初始化案例 ===============

(function () {
  var id = 0;
  window.startUpload = function (uploadType, files) { // uploadType 区分是控件还是 flash
    for (var i = 0, file; file = files[i++];) {
      var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
      uploadObj.init(id++); // 给 upload 对象设置一个唯一的 id
    }
  };

  var Upload = function (uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom = null;
  };
  Upload.prototype.init = function (id) {
    var that = this;
    this.id = id;
    this.dom = document.createElement('div');
    this.dom.innerHTML =
      '<span>文件名称:' + this.fileName + ', 文件大小: ' + this.fileSize + '</span>' +
      '<button class="delFile">删除</button>';
    this.dom.querySelector('.delFile').onclick = function () {
      that.delFile();
    }
    document.body.appendChild(this.dom);
  };
  Upload.prototype.delFile = function () {
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  };

  // startUpload('plugin', [
  //   {
  //     fileName: '1.txt',
  //     fileSize: 1000
  //   },
  //   {
  //     fileName: '2.html',
  //     fileSize: 3000
  //   },
  //   {
  //     fileName: '3.txt',
  //     fileSize: 5000
  //   }
  // ]);
  // startUpload('flash', [
  //   {
  //     fileName: '4.txt',
  //     fileSize: 1000
  //   },
  //   {
  //     fileName: '5.html',
  //     fileSize: 3000
  //   },
  //   {
  //     fileName: '6.txt',
  //     fileSize: 5000
  //   }
  // ]);
})();

// ======== 使用享元模式改写的案例 ===============
// 思路：此处要分辨内部状态与外部状态
// 内部状态：可以独立具体场景
// 外部状态： 取决于具体场景
// 即，在 new Upload(uploadType, file.fileName, file.fileSize)
// Upload方法中， uploadType 可以作为内部状态，
// 而fileName、fileSize随着文件变化而变化，作为外部状态
(function () {
  var id = 0;
  window.startUpload = function (uploadType, files) {
    for (var i = 0, file; file = files[i++];) {
      var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
    }
  };
  var MyUpload = function (uploadType) {
    this.uploadType = uploadType
  }
  MyUpload.prototype.delFile = function (id) {
    // 获得需要的外部状态 🌟🌟🌟
    uploadManager.setExternalState(id, this);

    // 对外部状态的处理
    if (this.fileSize < 3000) {
      return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('确定要删除该文件吗? ' + this.fileName)) {
      return this.dom.parentNode.removeChild(this.dom);
    }
  }

  // 工厂模式针对对象进行实例化
  // 即内部状态工厂化处理
  // 如果某种内部状态对应的共享对象被创建，那么直接返回这个对象
  var UploadFactory = (function () {
    var createdFlyWerightObjs = {}; // 相当于一个对象池

    return {
      create: (uploadType) => {
        console.log(createdFlyWerightObjs)
        if (createdFlyWerightObjs[uploadType]) {
          return createdFlyWerightObjs[uploadType]
        }
        // 返回一个实例化的Upload对象
        return createdFlyWerightObjs[uploadType] = new MyUpload(uploadType);
      }
    }
  })()

  // 管理器封装外部状态
  // 负责向 UploadFactory 提交创建对象的请求，
  //并用一个 uploadDatabase 对象保存所有 upload 对象的外部状态，
  // 以便在程序运行过程中给 upload 共享对象设置外部状态
  var uploadManager = (function () {
    var uploadDAtabase = {}; // 记录外部状态

    return {
      add: function (id, uploadType, fileName, fileSize) {

        // 从对象池中取存在的对象 OR 创建一个新uploadType类型的对象
        var flyWeightObj = UploadFactory.create(uploadType);

        // 自定义操作
        var dom = document.createElement('div');
        dom.innerHTML =
          '<span>文件名称:' + fileName + ', 文件大小: ' + fileSize + '</span>' +
          '<button class="delFile">删除</button>';

        dom.querySelector('.delFile').onclick = function () {
          flyWeightObj.delFile(id);
        }
        document.body.appendChild(dom);

        // 记录当前的对象的外部状态
        console.log('uploadDAtabase', uploadDAtabase)
        uploadDAtabase[id] = {
          fileName,
          fileSize,
          dom
        }

        return flyWeightObj
      },

      setExternalState: function (id, flyWeightObj) {
        var uploadData = uploadDAtabase[id];//快速取值
        // 在必要时将外部状态传入共享对象，来组装成一个完整的对象 🌟🌟🌟
        for (let i in uploadData) {
          // 设置 当前删除的这个对象的  外部属性
          flyWeightObj[i] = uploadData[i]
        }
      }
    }

  })()


  // ============调用
  startUpload('plugin', [
    {
      fileName: '1.txt',
      fileSize: 1000
    },
    {
      fileName: '2.html',
      fileSize: 3000
    },
    {
      fileName: '3.txt',
      fileSize: 5000
    }
  ]);
  startUpload('flash', [
    {
      fileName: '1.txt',
      fileSize: 1000
    },
    {
      fileName: '2.html',
      fileSize: 3000
    },
    {
      fileName: '3.txt',
      fileSize: 5000
    }
  ]);
})();


// ============ 没有内部状态的享元========
// 等同一个单例工厂模式。。
// 将以上的享元模式部分更改如下
(function () {
  var Upload = function () { };
  var UploadFactory = (function () {
    var uploadObj;
    return {
      create: function () {
        if (uploadObj) {
          return uploadObj;
        }
        return uploadObj = new Upload();
      }
    }
  })();

})();

// ============ 没有外部状态的享元========


// ============ 对象池的实现 ==============
var toolTipFactory = function () {
  var toolTipPool = []; //对象池

  return {
    create: () => {
      if (toolTipPool.length === 0) {
        var div = document.createElement('div'); // 创建一个 dom
        document.body.appendChild(div);
        return div;
      } else {
        toolTipPool.shift();
      }
    },
    recover: function (tooltipDom) {
      return toolTipPool.push(tooltipDom); // 对象池回收 dom
    }
  }
}
var ary = [];
for (var i = 0, str; str = ['A', 'B'][i++];) {
  var toolTip = toolTipFactory.create();
  toolTip.innerHTML = str;
  ary.push(toolTip);
};

for (var i = 0, toolTip; toolTip = ary[i++];) {
  toolTipFactory.recover(toolTip);
};

for (var i = 0, str; str = ['A', 'B', 'C', 'D', 'E', 'F'][i++];) {
  var toolTip = toolTipFactory.create();
  toolTip.innerHTML = str;
};



// ============ 通用对象池工厂的实现 ==============
var objectPoolFactory = function (createObjFn) {
  var objectPool = [];
  return {
    create: function () {
      var obj = objectPool.length === 0 ?
        createObjFn.apply(this, arguments) : objectPool.shift(); // 🌟🌟🌟
      return obj;
    },
    recover: function (obj) {
      objectPool.push(obj);
    }
  }
}

var iframeFactory = objectPoolFactory(function () {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.onload = function () {
    iframe.onload = null; // 防止 iframe 重复加载的 bug
    iframeFactory.recover(iframe); // iframe 加载完成之后回收节点
  }
  return iframe;
});
var iframe1 = iframeFactory.create();
iframe1.src = 'http:// baidu.com';
var iframe2 = iframeFactory.create();
iframe2.src = 'http:// QQ.com';
setTimeout(function () {
  var iframe3 = iframeFactory.create();
  iframe3.src = 'http:// 163.com';
}, 3000);