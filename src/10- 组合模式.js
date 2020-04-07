// 组合模式
// 组合模式将对象组合成一个树形结构，以表示“部分-整体”的层次结构

// ============  通过命令模式中的宏命令 来实现一个复杂的树结构 ==========
(function () {

  // 宏命令处理器
  const MacroCommand = function () {
    return {
      commandList: [],
      add: function (command) {
        this.commandList.push(command)
      },
      execute: function () {
        console.log(this.commandList); // 在每个子节点中this.commandList都不一样
        this.commandList.map((command) => {
          command.execute()
        })
      }
    }
  }
  // 各种子节点 或叶节点的命令
  // 叶节点
  const openAcCommand = {
    execute: function () {
      console.log('打开空调');
    }
  }
  // 子节点1
  const openTvCommand = {
    execute: function () {
      console.log('打开电视');
    }
  };
  const openSoundCommand = {
    execute: function () {
      console.log('打开音响');
    }
  };
  const macroCommand1 = MacroCommand();
  macroCommand1.add(openTvCommand);
  macroCommand1.add(openSoundCommand);

  // 子节点2
  const closeDoorCommand = {
    execute: function () {
      console.log('关门');
    }
  };
  const openPcCommand = {
    execute: function () {
      console.log('开电脑');
    }
  };
  const openQQCommand = {
    execute: function () {
      console.log('登录 QQ');
    }
  };
  const macroCommand2 = MacroCommand();
  macroCommand2.add(closeDoorCommand);
  macroCommand2.add(openPcCommand);
  macroCommand2.add(openQQCommand);

  // 将以上的每个子节点，放入根节点
  const root = MacroCommand();
  root.add(openAcCommand)
  root.add(macroCommand1)
  root.add(macroCommand2)

  // 执行者 -
  const setCommand = (function (command) {
    document.getElementById("count").onclick = () => {
      command.execute()
    }
  })(root)
  console.log(root)
})();

// ============ 给组合模式的叶节点添加add方法，提醒异常 ==========
(function () {
  const MacroCommand = function () {
    return {
      commandList: [],
      add: function (command) {
        this.commandList.push(command)
      },
      execute: function () {
        console.log(this.commandList); // 在每个子节点中this.commandList都不一样
        this.commandList.map((command) => {
          command.execute()
        })
      }
    }
  }

  // 叶节点
  const openAcCommand = {
    execute: function () {
      console.log('打开空调');
    },
    add: function () {
      throw new Error('叶对象不能添加子节点');
    }
  }

  const root = MacroCommand();
  root.add(openAcCommand);
  // openAcCommand.add(root); // Error

})();


// ============ 组合模式的例子，扫描文件夹 ==========
(function () {


  class Folder {
    constructor(name) {
      this.name = name;
      this.files = [];
    }
    add(file) {
      this.files.push(file)
    }
    scan() {
      console.log("开始扫描文件夹")
      this.files.map((file) => {
        file.scan();
      })
    }
  }

  class File {
    constructor(name) {
      this.name = name;
    }
    add(file) {
      throw new Error('文件下面不能再添加文件')
    }
    scan() {
      console.log('开始扫描文件', this.name)
    }
  }

  // 创建文件夹目录
  // folder
  //   - folder1 
  //     - file1
  //   - folder2
  //     - file2
  //   - file3
  //   - folder3
  //     - file4
  //   - file5
  var folder = new Folder('学习资料');
  var folder1 = new Folder('JavaScript');
  var folder2 = new Folder('jQuery');
  var file1 = new File('JavaScript 设计模式与开发实践');
  var file2 = new File('精通 jQuery');
  var file3 = new File('重构与模式')
  folder1.add(file1);
  folder2.add(file2);
  folder.add(folder1);
  folder.add(folder2);
  folder.add(file3);
  var folder3 = new Folder('Nodejs');
  var file4 = new File('深入浅出 Node.js');
  folder3.add(file4);
  var file5 = new File('JavaScript 语言精髓与编程实践');
  folder.add(folder3);
  folder.add(file5);

  // 操作顶端的扫描即可
  folder.scan()


})();

// ============ 组合模式 引用父对象 ==========
(function () {

  console.log('============ 组合模式 引用父对象 ==========')
  class Folder {
    constructor(name) {
      this.name = name;
      this.parent = null;
      this.files = []
    }
    add(file) {
      file.parent = this; // 
      this.files.push(file)
    }
    scan() {
      console.log('开始扫描文件夹: ' + this.name);
      this.files.map(file => file.scan())
    }
    remove() {
      if (!this.parent) {//根节点或者树外的游离节点
        return;
      }
      for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
          files.splice(l, 1);
        }
      }
    }
  }

  class File {
    constructor(name) {
      this.name = name;
      this.parent = null;
    }
    add() {
      throw new Error('不能添加在文件下面');
    }
    scan() {
      console.log('开始扫描文件夹: ' + this.name);
    }
    remove() {
      if (!this.parent) {//根节点或者树外的游离节点
        return;
      }
      for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
        var file = files[l];
        if (file === this) {
          files.splice(l, 1);
        }
      }

    }
  }

  var folder = new Folder('学习资料');
  var folder1 = new Folder('JavaScript');
  var file1 = new Folder('深入浅出 Node.js');
  folder1.add(new File('JavaScript 设计模式与开发实践'));
  folder.add(folder1);
  folder.add(file1);
  folder1.remove(); //移除文件夹
  folder.scan();

})()