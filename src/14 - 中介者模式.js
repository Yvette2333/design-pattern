//  中介者模式


// ========== 中介者模式的例子 -- 泡泡糖 =============
(function () {
  function Player(name) {
    this.name = name;
    this.enemy = null; // 敌人
  }

  Player.prototype.win = function () {
    console.log(this.name + 'won')
  }

  Player.prototype.lose = function () {
    console.log(this.name + 'lose')
  }

  Player.prototype.die = function () {
    this.lose();
    this.enemy.win()
  }

  var player1 = new Player('1')
  var player2 = new Player('2')

  player1.enemy = player2;
  player2.enemy = player1;

  player1.die()
})();

// ========== 中介者模式的例子 -- 泡泡糖 增加队伍 =============
(function () {
  console.log('===== 中介者模式的例子 -- 泡泡糖 增加队伍 =====')
  var players = []; // 保持所有的玩家
  function Player(name, teamColor) {
    this.partners = [];
    this.enemies = [];
    this.state = 'live';
    this.name = name;
    this.teamColor = teamColor;
  }

  Player.prototype.win = function () {
    console.log(this.name + 'won')
  }

  Player.prototype.lose = function () {
    console.log(this.name + 'lose')
  }

  Player.prototype.die = function () {
    var all_dead = true;
    this.state = 'dead';

    for (var i = 0; i < this.partners.length; i++) {
      let partners = this.partners[i];
      if (partners.state !== 'dead') {
        all_dead = false;
        break;
      }
    }

    if (all_dead === true) {
      this.lose();
      for (var i = 0; i < this.partners.length; i++) {
        let partners = this.partners[i];
        partners.lose()
      }
      for (var i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        enemy.win()
      }
    }
  }

  // 定义一个工厂来创建玩家
  var playerFactory = function (name, teamColor) {
    var newPlayer = new Player(name, teamColor);
    for (var i = 0; i < players.length; i++) {
      let player = players[i];
      if (player.teamColor === newPlayer.teamColor) {
        player.partners.push(newPlayer)
        newPlayer.partners.push(player)
      } else {
        player.enemies.push(newPlayer);
        newPlayer.enemies.push(player)
      }
    }
    players.push(newPlayer)
    return newPlayer
  }

  var player1 = playerFactory('1', 'red'),
    player2 = playerFactory('2', 'red'),
    player3 = playerFactory('3', 'red'),
    player4 = playerFactory('4', 'red');

  var player5 = playerFactory('5', 'blue'),
    player6 = playerFactory('6', 'blue'),
    player7 = playerFactory('7', 'blue'),
    player8 = playerFactory('8', 'blue');


  player1.die();
  player2.die();
  player3.die();
  player4.die();


})();


// ========== 用中介者模式 Director 改造以上案例
(function () {
  console.log('========== 用中介者模式 Director 改造以上案例 ==========')
  class Player {
    constructor(name, teamColor) {
      this.name = name;
      this.teamColor = teamColor;
      this.state = 'alive'
    }
    win() {
      console.log(this.name + 'won')
    }
    lose() {
      console.log(this.name + 'lose')
    }
    die() {
      this.state = 'dead';
      // 给中介者发送消息，玩家死亡
      playerDirector.reciveMessage('playerDead', this)
    }
    remove() {
      this.state = 'dead';
      // 给中介者发送消息，移除一个玩家
      playerDirector.reciveMessage('removePlayer', this)
    }
    changeTeam(color) {
      playerDirector.reciveMessage('changeTeam', this, color)
    }
  }

  // 创建玩家的工厂函数的更改如下
  function playerFactory(name, teamColor) {
    var newPlayer = new Player(name, teamColor);
    playerDirector.reciveMessage('addPlayer', newPlayer)
    return newPlayer
  }

  // 实现一个中介者对象
  var playerDirector = (function () {

    var players = {},// 保存所有玩家
      operations = {}; // 中介者可以执行的操作


    /****************新增一个玩家***************************/
    operations.addPlayer = function (player) {
      var teamColor = player.teamColor; // 玩家的队伍颜色
      players[teamColor] = players[teamColor] || []; // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
      players[teamColor].push(player); // 添加玩家进队伍
    };

    /****************移除一个玩家***************************/
    operations.removePlayer = function (player) {
      var teamColor = player.teamColor, // 玩家的队伍颜色
        teamPlayers = players[teamColor] || []; // 该队伍所有成员
      for (var i = teamPlayers.length - 1; i >= 0; i--) { // 遍历删除
        if (teamPlayers[i] === player) {
          teamPlayers.splice(i, 1);
        }
      }
    };

    /****************玩家换队***************************/
    operations.changeTeam = function (player, newTeamColor) { // 玩家换队
      operations.removePlayer(player); // 从原队伍中删除
      player.teamColor = newTeamColor; // 改变队伍颜色
      operations.addPlayer(player); // 增加到新队伍中
    };

    operations.playerDead = function (player) { // 玩家死亡
      var teamColor = player.teamColor,
        teamPlayers = players[teamColor]; // 玩家所在队伍
      var all_dead = true;
      for (var i = 0, player; player = teamPlayers[i++];) {
        if (player.state !== 'dead') {
          all_dead = false;
          break;
        }
      }
      if (all_dead === true) { // 全部死亡
        for (var i = 0, player; player = teamPlayers[i++];) {
          player.lose(); // 本队所有玩家 lose
        }
        for (var color in players) {
          if (color !== teamColor) {
            var teamPlayers = players[color]; // 其他队伍的玩家
            for (var i = 0, player; player = teamPlayers[i++];) {
              player.win(); // 其他队伍所有玩家 win
            }
          }
        }
      }
    };

    // 该函数将所有关于reciveMessage的操作转接到了operations
    var reciveMessage = function () {
      var message = Array.prototype.shift.call(arguments); // arguments 的第一个参数为消息名称
      operations[message].apply(this, arguments);
    };

    return {
      reciveMessage: reciveMessage
    }
  })()

  // 红队：
  var player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('小乖', 'red'),
    player3 = playerFactory('宝宝', 'red'),
    player4 = playerFactory('小强', 'red');
  // 蓝队：
  var player5 = playerFactory('黑妞', 'blue'),
    player6 = playerFactory('葱头', 'blue'),
    player7 = playerFactory('胖墩', 'blue'),
    player8 = playerFactory('海盗', 'blue');
  player1.die();
  player2.die();
  player3.die();
  player4.die();

})();


(function () {
  console.log("=========购买商品======")
  // """ 选择红色手机 ，购买4个 库存不足
  // """ 选择蓝色手机 ，购买5个 加入购物车

  const goods = {
    "red": 3,
    "blue": 6
  }
  var colorSelect = document.getElementById('colorSelect'),
    numberInput = document.getElementById('numberInput'),
    colorInfo = document.getElementById('colorInfo'),
    numberInfo = document.getElementById('numberInfo'),
    nextBtn = document.getElementById('nextBtn');

  // 颜色change
  colorSelect.onchange = function () {
    let color = this.value;
    let number = numberInput.value;
    let stock = goods[color];

    colorInfo.innerHTML = color;

    if (!color) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '请选择手机颜色';
      return;
    }

    if (((number - 0) | 0) !== number - 0) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '请输入正确的购买数量';
      return;
    }

    if (number > stock) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '库存不足';
      return;
    }

    nextBtn.disabled = false;
    nextBtn.innerHTML = '放入购物车';

  }

  numberInfo.oninput = function () {
    var color = colorSelect.value;
    var number = this.value;
    var stock = goods[color];

    numberInfo.innerHTML = number;

    if (!color) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '请选择手机颜色';
      return;
    }

    if (((number - 0) | 0) !== number - 0) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '请输入正确的购买数量';
      return;
    }

    if (number > stock) {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '库存不足';
      return;
    }
    nextBtn.disabled = false;
    nextBtn.innerHTML = '放入购物车';
  }





})();

(function () {
  console.log("=========中介者 购买商品======")
  // 将公用部分可以提取出来，针对不同的属性来进行操作与区分
  // 中介者模式会使每个对象直接获得解藕，而在中介者自身，可能出现极大的复杂性
  const goods = {
    "red|32G": 3,
    "red|16G": 0,
    "blue|32G": 1,
    "blue|16G": 6
  }

  var colorSelect = document.getElementById('colorSelect'),
    memorySelect = document.getElementById('memorySelect'),
    numberInput = document.getElementById('numberInput'),
    colorInfo = document.getElementById('colorInfo'),
    memoryInfo = document.getElementById('memoryInfo'),
    numberInfo = document.getElementById('numberInfo'),
    nextBtn = document.getElementById('nextBtn');


  const mediator = (function () {

    return {
      changed: function (obj) {
        var color = colorSelect.value;
        var memory = memorySelect.value;
        var number = numberInput.value;
        var stock = goods[color + '|' + memory];

        if (obj === colorSelect) {
          colorInfo.innerHTML = color;
        } else if (obj === memorySelect) {
          memoryInfo.innerHTML = memory;
        } else if (obj === numberInput) {
          memoryInfo.innerHTML = number;
        }

        // 判断参数选择
        if (!color) {
          nextBtn.disabled = true;
          nextBtn.innerHTML = '请选择手机颜色';
          return;
        }
        if (!memory) {
          nextBtn.disabled = true;
          nextBtn.innerHTML = '请选择内存大小';
          return;
        }

        // // 输入购买数量是否为正整数
        if (((number - 0) | 0) !== number - 0) { // 输入购买数量是否为正整数
          nextBtn.disabled = true;
          nextBtn.innerHTML = '请输入正确的购买数量';
          return;
        }

        nextBtn.disabled = false;
        nextBtn.innerHTML = '放入购物车';

      }
    }



  })()

  colorSelect.onchange = function() {
    mediator.changed(this)
  }

  memorySelect.onchange = function() {
    mediator.changed( this );
  }

  numberInput.onchange = function() {
    mediator.changed( this );
  }

})();
