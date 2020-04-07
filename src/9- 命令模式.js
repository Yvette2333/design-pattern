// 命令模式
// 命令模式中 -通常会包含3中角色 - (触发者 - 命令者 - 执行者)
// 命令模式只负责执行command命令，
// 只需要约定为指定方法名称即可

const dom = document.getElementById('count');
const cancelDom = document.getElementById('cancelDom');

// ============= 基于传统面向对象的命令模式实现 =============
(function () {

  // 执行者
  const MenuBar = {
    refresh: function () {
      console.log('refresh ....')
    }
  }

  // 命令者
  const RefreshMenuBarCommand = function (receiver) {
    this.receiver = receiver
  }
  RefreshMenuBarCommand.prototype.execute = function () {
    this.receiver.refresh()
  }

   // 触发者
   const setCommand = function (button, command) {
    button.onclick = function () {
      command.execute()
    }
  }

  // 将命令与执行命令结合，使接收对象注册execute方法
  const refreshCommand = new RefreshMenuBarCommand(MenuBar)

  // 执行命令
  setCommand(dom, refreshCommand); // refresh ....

})();

// ============= 简化的命令模式实现 =============
(function () {
  // 以下方法中，省去了Command接收对象的声明
  // 也省去了约定的execute函数
  const btnClick = (dom, fn) => {
    dom.onclick = fn
  }
  const MenuBar = {
    refresh: () => {
      console.log('simple refresh....')
    }
  }

  btnClick(dom, MenuBar.refresh)
})();

// ============= 基于闭包的命令模式实现 =============
window.onload = function () {
  // 命令执行者
  const setCommand = (btn, fn) => {
    btn.onclick = () => {
      fn()
    }
  }

  // 命令对象
  const MenuBar = {
    refresh: () => {
      console.log(this.name)
      console.log('closure refresh....')
    }
  }

  // 扩展命令,当前的函数只能支持refresh一种命令
  const RefreshCommand = (receiver) => {
    this.name = 'create command';
    // 返回一个匿名函数,此处使用了闭包
    // receiver.refresh()中将访问到当前执行环境的name
    return () => {
      receiver.refresh()
    }
  }

  const doCommand = RefreshCommand(MenuBar)

  setCommand(dom, doCommand)
}

// ============= 扩展命令模式 - 撤销 =============
window.onload = function () {
  console.log(this)

  // 命令执行者
  const setCommand = (btn, fn) => {
    btn.onclick = () => {
      fn()
    }
  }

  // 命令对象
  const MenuBar = {
    refresh: (args) => {
      // console.log(this.name)
      console.log('closure refresh....')
      return args
    }
  }

  // 扩展命令,当前的函数只能支持refresh一种命令
  const RefreshCommand = (receiver) => {
    this.name = 'create command';
    this.oldRefresh = null; // cache
    // 返回一个匿名函数,此处使用了闭包
    // receiver.refresh()中将访问到当前执行环境的name
    return {
      execute: (args) => {
        this.oldRefresh = args;
        return () => receiver.refresh(args)
      },
      unexecute: () => {
        return () => {
          console.log(this.oldRefresh)
          return this.oldRefresh
        }
      }
    }
  }

  const doCommand = RefreshCommand(MenuBar);

  setCommand(dom, doCommand.execute(1))
  setCommand(cancelDom, doCommand.unexecute())
  setCommand(dom, doCommand.execute(1))
}

// ============= 宏命令 =============
// 一组命令的集合，通过执行宏命令，一次执行一批命令

// 1- 逐步创建宏命令
var closeDoorCommand = {
  execute: function () {
    console.log('关门');
  }
};
var openPcCommand = {
  execute: function () {
    console.log('开电脑');
  }
};
var openQQCommand = {
  execute: function () {
    console.log('登录 QQ');
  }
};

// 创建宏命令
const MacroCommand = function () {
  return {
    commandsList: [],
    add: function (command) {
      this.commandsList.push(command);
    },
    execute: function () {
      for (var i = 0, command; command = this.commandsList[i++];) {
        command.execute();
      }
    },
    undo: function () {
      // ...
    },
  }
}
var macroCommand = MacroCommand();
macroCommand.add( closeDoorCommand );
macroCommand.add( openPcCommand );
macroCommand.add( openQQCommand );
macroCommand.execute();
