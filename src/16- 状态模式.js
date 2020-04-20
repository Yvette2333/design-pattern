// 状态模式
(function () {
  console.log('====== 电灯程序  ======')
  let Light = function () {
    this.state = 'off';
    this.button = null
  }
  Light.prototype.init = function () {
    const button = document.createElement('button');
    const self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild(button);
    this.button.onclick = function () {
      self.buttonWasPressed()
    }
  }
  Light.prototype.buttonWasPressed = function () {
    if (this.state === 'off') {
      console.log('开灯');
      this.state = 'on';
    } else if (this.state === 'on') {
      console.log('关灯');
      this.state = 'off';
    }
  }
  // const light = new Light();
  // light.init();
})();

// 状态模式
(function () {
  console.log('====== 电灯程序 - 状态改写  ======')
  // 状态模式等关键是把事物的每种状态都封装成单独的类
  // 弱光 -》 强光 -》 关灯 -》弱光

  const OffLightState = function (light) {
    this.light = light;
  }
  OffLightState.prototype.buttonWasPressed = function () {
    console.log('开灯')
    this.light.setState(this.light.weakLightState)
  }

  const WeakLightState = function (light) {
    this.light = light
  }
  WeakLightState.prototype.buttonWasPressed = function () {
    console.log('弱光')
    this.light.setState(this.light.strongLightState)
  }

  const StrongLightState = function (light) {
    this.light = light;
  }
  StrongLightState.prototype.buttonWasPressed = function () {
    console.log('强光');
    this.light.setState(this.light.superStrongLightState)
  }

  const SuperStrongLightState = function (light) {
    this.light = light;
  }
  SuperStrongLightState.prototype.buttonWasPressed = function () {
    console.log('超强光');
    this.light.setState(this.light.offLightState)
  }
  class Light {
    constructor() {
      this.offLightState = new OffLightState(this)
      this.weakLightState = new WeakLightState(this)
      this.strongLightState = new StrongLightState(this)
      this.superStrongLightState = new SuperStrongLightState(this);
      this.button = null;
      this.currState = null;
    }

    init() {
      const button = document.createElement('button');
      const self = this;
      this.button = document.body.appendChild(button);
      this.button.innerHTML = '开关';

      this.currState = this.offLightState; // 初始化状态

      this.button.onclick = function () {
        self.currState.buttonWasPressed();
      }
    }
    setState(newState) {
      this.currState = newState;
    }
  }

  const light = new Light();
  light.init();
})();

(function () {

  console.log('====== 状态模式 - 文件上传  ======')
  // 状态模式来写一个上传

  // 提供 window.external.upload 函数。在页面中模拟创建上传插件
  const plugins = (function () {

    var plugin = document.createElement('embed');
    plugin.style.display = 'none';

    plugin.type = 'application/txfrn-webkit';

    plugin.sign = function () {
      console.log('开始文件扫描')
    }
    plugin.pause = function () {
      console.log('暂停文件上传');
    };
    plugin.uploading = function () {
      console.log('开始文件上传');
    };
    plugin.del = function () {
      console.log('删除文件上传');
    }
    plugin.done = function () {
      console.log('文件上传完成');
    }

    document.body.appendChild(plugin)
    return plugin

  })()

  // 构造函数中为每种状态子类都创建一个实例对象
  class Upload {

    constructor(fileName) {
      this.plugin = plugins;
      this.fileName = fileName;
      this.button1 = null;
      this.button2 = null;

      // 规范多个状态
      this.signState = new SignState(this);
      this.uploadingState = new UploadingState(this);
      this.pauseState = new PauseState(this);
      this.doneState = new DoneState(this);
      this.errorState = new ErrorState(this);

      this.currState = this.signState; // 设置当前状态
      // this.state = 'sign'; // 初始状态waiting
    }

    // 流程相关的内容 无需优化
    init() {
      this.dom = document.createElement('div');
      this.dom.innerHTML =
        '<span>文件名称:' + this.fileName + '</span>\
      <button data-action="button1">扫描中</button>\
      <button data-action="button2">删除</button>';
      document.body.appendChild(this.dom);
      this.button1 = this.dom.querySelector('[data-action="button1"]'); // 第一个按钮
      this.button2 = this.dom.querySelector('[data-action="button2"]'); // 第二个按钮
      this.bindEvent();
    }

    // 负责具体的按钮事件实现， Context 不做任何操作，把请求委托给当前状态类来执行
    bindEvent() {
      var self = this;
      this.button1.onclick = function () {

        self.currState.clickHandler1();

        // if (self.state === 'sign') { // 扫描状态下，任何操作无效
        //   console.log('扫描中，点击无效...');
        // } else if (self.state === 'uploading') { // 上传中，点击切换到暂停
        //   self.changeState('pause');
        // } else if (self.state === 'pause') { // 暂停中，点击切换到上传中
        //   self.changeState('uploading');
        // } else if (self.state === 'done') {
        //   console.log('文件已完成上传, 点击无效');
        // } else if (self.state === 'error') {
        //   console.log('文件上传失败, 点击无效');
        // }
      };
      this.button2.onclick = function () {

        self.currState.clickHandler2();

        // if (self.state === 'done' || self.state === 'error'
        //   || self.state === 'pause') {
        //   // 上传完成、上传失败和暂停状态下可以删除
        //   self.changeState('del');
        // } else if (self.state === 'sign') {
        //   console.log('文件正在扫描中，不能删除');
        // } else if (self.state === 'uploading') {
        //   console.log('文件正在上传中，不能删除');
        // }
      }
    }

    sign() {
      this.plugin.sign();
      this.currState = this.signState
    }
    uploading() {
      this.button1.innerHTML = '正在上传，点击暂停';
      this.plugin.uploading();
      this.currState = this.uploadingState;
    }

    pause() {
      this.button1.innerHTML = '已暂停，点击继续上传';
      this.plugin.pause();
      this.currState = this.pauseState;
    }

    done() {
      this.button1.innerHTML = '上传完成';
      this.plugin.done();
      this.currState = this.doneState;
    }

    error() {
      this.button1.innerHTML = '上传失败';
      this.currState = this.errorState;
    }

    el() {
      this.plugin.del();
      this.dom.parentNode.removeChild(this.dom);
    }


    // changeState(state) {
    //   switch (state) {
    //     case 'sign':
    //       this.plugin.sign();
    //       this.button1.innerHTML = '扫描中，任何操作无效';
    //       break;
    //     case 'uploading':
    //       this.plugin.uploading();
    //       this.button1.innerHTML = '正在上传，点击暂停';
    //       break;
    //     case 'pause':
    //       this.plugin.pause();
    //       this.button1.innerHTML = '已暂停，点击继续上传';
    //       break;
    //     case 'done':
    //       this.plugin.done();
    //       this.button1.innerHTML = '上传完成';
    //       break;
    //     case 'error':
    //       this.button1.innerHTML = '上传失败';
    //       break;
    //     case 'del':
    //       this.plugin.del();
    //       this.dom.parentNode.removeChild(this.dom);
    //       console.log('删除完成');
    //       break;
    //   }

    //   this.state = state;

    // }

  }

  // 状态工厂
  const StateFactory = (function () {
    // 抽象类的实现
    const State = function () { }
    State.prototype.clickHandler1 = function () {
      throw new Error('子类必须重写')
    }
    State.prototype.clickHandler2 = function () {
      throw new Error('子类必须重写')
    }
    return function (param) {
      var F = function (uploadObj) {
        this.uploadObj = uploadObj;
      }
      F.prototype = new State();

      for (let i in param) {
        F.prototype[i] = param[i]
      }
      return F;
    }
  })()

  // 以下方法完成changeState相关的工作
  const SignState = StateFactory({
    clickHandler1: function () {
      console.log('扫描中，点击无效...');
    },
    clickHandler2: function () {
      console.log('文件正在上传中，不能删除');
    }
  })

  const UploadingState = StateFactory({
    clickHandler1: function () {
      this.uploadObj.pause();
    },
    clickHandler2: function () {
      console.log('文件正在上传中，不能删除');
    }
  });
  const PauseState = StateFactory({
    clickHandler1: function () {
      this.uploadObj.uploading();
    },
    clickHandler2: function () {
      this.uploadObj.del();
    }
  });
  const DoneState = StateFactory({
    clickHandler1: function () {
      console.log('文件已完成上传, 点击无效');
    },
    clickHandler2: function () {
      this.uploadObj.del();
    }
  });
  const ErrorState = StateFactory({
    clickHandler1: function () {
      console.log('文件上传失败, 点击无效');
    },
    clickHandler2: function () {
      this.uploadObj.del();
    }
  });










  var uploadObj = new Upload('JavaScript 设计模式与开发实践');
  uploadObj.init();
  console.log(uploadObj)
  window.external.upload = function (state) { // 插件调用 JavaScript 的方法
    // uploadObj.changeState(state);
    debugger
    uploadObj[state]();
  };
  window.external.upload('sign'); // 文件开始扫描
  setTimeout(function () {
    window.external.upload('uploading'); // 1 秒后开始上传
  }, 1000);
  setTimeout(function () {
    window.external.upload('done'); // 5 秒后上传完成
  }, 5000);
})();


(function () {
  console.log('====== 状态模式 - JS的状态机  ======')

  const Light = function () {
    this.currState = FSM.off;
    this.button = null;
  }
  Light.prototype.init = function () {
    var button = document.createElement('button');
    const self = this;

    button.innerHTML = '已关灯';
    this.button = document.body.appendChild(button);

    this.button.onclick = function () {
      self.currState.buttonWasPressed.call(self); // ? 把请求委托给状态机
    }
  }


  var FSM = {
    off: {
      buttonWasPressed: function () {
        this.button.innerHTML = '下一次按我是开灯';
        this.currState = FSM.on;
      }
    },
    on: {
      buttonWasPressed: function () {
        console.log('开灯');
        this.button.innerHTML = '下一次按我是关灯';
        this.currState = FSM.off;
      }
    }
  }

  var light = new Light();
  light.init()

})()