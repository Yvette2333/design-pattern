// 封装 与 多态
var googleMap = {
  show: () => {
    console.log('this is a google Map')
  }
}

var baiduMap = {
  show: () => {
    console.log('this is a baidu Map')
  }
}

const RenderMap = (mapOrg) => {
  if (mapOrg.show instanceof Function) {
    mapOrg.show()
  }
}
RenderMap(googleMap)
RenderMap(baiduMap)