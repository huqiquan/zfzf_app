import React from 'react'
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'
const BMap = window.BMap
class Map extends React.Component {
  attribute() {
    Toast.info('哈哈哈哈', 3, null, true)
  }
  componentDidMount() {
    const map = new BMap.Map('container')
    const point = new BMap.Point(121.61887341233741, 31.040603951746952)
    map.centerAndZoom(point, 14)
    // var circle = new BMap.Circle(point, 30)
    // map.addOverlay(circle)
    // var marker = new BMap.Marker(point) // 创建标注
    // map.addOverlay(marker)
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-40, -40) //设置文本偏移量
    }
    var opts1 = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-10, -100) //设置文本偏移量
    }
    var label = new BMap.Label('黑马', opts) // 创建文本标注对象
    label.addEventListener('click', this.attribute)
    label.setStyle({
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      height: '100px',
      width: '100px',
      borderRadius: '50%',
      lineHeight: '100px',
      textAlign: 'center',
      fontFamily: '微软雅黑',
      backgroundColor: 'rgba(12, 181, 106, 0.9)',
      border: '2px solid rgba(255, 255, 255, 0.8)'
    })
    map.addOverlay(label)
    var label1 = new BMap.Label('航头镇', opts1) // 创建文本标注对象
    label1.setStyle({
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      height: '100px',
      width: '100px',
      borderRadius: '50%',
      lineHeight: '100px',
      textAlign: 'center',
      fontFamily: '微软雅黑',
      backgroundColor: 'rgba(12, 181, 106, 0.9)',
      border: '2px solid rgba(255, 255, 255, 0.8)'
    })
    map.addOverlay(label1)
  }
  render() {
    return (
      <div className="map">
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={this.goBack}
        >
          地图找房
        </NavBar>
        <div id="container" />
      </div>
    )
  }
  goBack = () => {
    this.props.history.go(-1)
  }
}
export default Map
