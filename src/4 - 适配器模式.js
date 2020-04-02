// 适配器模式
// 主要解决两个现有接口直接不匹配的问题

// ================== 基本的适配器模式 ===================ç

// 原来已有的接口
const google = {
  show: () => {
    console.log('google Map')
  }
}

const baidu = {
  show: () => {
    console.log('baidu Map')
  }
}

function RenderMap(maps) {
  if (maps.show instanceof Function) {
    maps.show()
  }
}
RenderMap(baidu)
RenderMap(google)

// 第三方接口 。 
const gaode = {
  display: () => {
    console.log('gaode Map')
  }
}
// 编写对应renderMap的适配器函数
// 使得原有接口与第三方接口，均可直接调用
function RenderMapAdapter(maps) {
  return {
    show: function () {
      return maps.display()
    }
  }
}
RenderMap(RenderMapAdapter(gaode))

// ================== 基本的适配器模式2  ===================
// 还可以通过适配器模式 来更改新增数据的结构或其他

var getGuangDongCity = function () {
  return [
    {
      name: 'shenzhen',
      id: 11,
    }, {
      name: 'guangzhou',
      id: 12,
    }
  ]
}

function renderCity(data) {
  data.map((item) => console.log(`${item.name} , hi~ `))
}

renderCity(getGuangDongCity())

// 当我们第三方接口需要如下格式当时候，
var guangdongCity = {
  shenzhen: 11,
  guangzhou: 12,
  zhuhai: 13
};
// 则我们编写适配器如下
function CityAdapter(oldAdressFn) {
  let address = {};
  if (oldAdressFn instanceof Function) {
    let oldAdress = oldAdressFn();
    for (let i = 0; i < oldAdress.length; i++) {
      let current = oldAdress[i];
      address[current.name] = current.id;
    }
    return address
  }
  return address
}
let b = CityAdapter(getGuangDongCity)
console.log(b)