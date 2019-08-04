import React from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'
const BMap = window.BMap
class Map extends React.Component {
  componentDidMount() {
    const map = new BMap.Map('container')
    const point = new BMap.Point(121.61887341233741, 31.040603951746952)
    map.centerAndZoom(point, 15)
    var marker = new BMap.Marker(point) // 创建标注
    map.addOverlay(marker)
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
