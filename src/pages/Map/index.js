import React from 'react'
import { NavBar } from 'antd-mobile'
import { getCurrentCity } from 'utils/index'
import './index.scss'
import Axios from 'axios'
const BMap = window.BMap
class Map extends React.Component {
  state = {
    isShow: false,
    cityList: []
  }
  // 初始化地图
  async initMap() {
    // 从getCurrentCity中结构出value 和label(需要使用label使用getPoint获取point经纬度)
    const { value, label } = await getCurrentCity()
    const map = new BMap.Map('container')
    this.map = map
    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(label, async point => {
      if (!point) return
      // 将point放在地图的正中心
      map.centerAndZoom(point, 11)
      // 添加控件
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.ScaleControl())
      // 发送ajax请求获取所有区的数据
      // const res = await Axios.get(`http://localhost:8080/area/map?id=${value}`)
      // res.data.body.forEach(item => {
      //   const html = `
      //     <div class="bubble">
      //       <p class="name">${item.label}</p>
      //       <p>${item.count}套</p>
      //     </div>
      //   `
      //   const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
      //   const options = {
      //     position: point,
      //     offset: new BMap.Size(-35, -35)
      //   }
      //   const label = new BMap.Label(html, options)
      //   label.setStyle({
      //     border: '0px solid rgb(255, 0, 0)'
      //   })
      //   // 3. 给地图添加覆盖物
      //   map.addOverlay(label)
      //   label.addEventListener('click', () => {
      //     map.centerAndZoom(point, 13)
      //   })
      // })
      this.renderOverlays(value)
    })

    // var opts = {
    //   position: point, // 指定文本标注所在的地理位置
    //   offset: new BMap.Size(-40, -40) //设置文本偏移量
    // }
    // var opts1 = {
    //   position: point, // 指定文本标注所在的地理位置
    //   offset: new BMap.Size(-10, -100) //设置文本偏移量
    // }
    // var label = new BMap.Label('黑马', opts) // 创建文本标注对象
    // label.addEventListener('click', this.attribute)
    // label.setStyle({
    //   color: 'white',
    //   fontSize: '14px',
    //   fontWeight: '600',
    //   height: '100px',
    //   width: '100px',
    //   borderRadius: '50%',
    //   lineHeight: '100px',
    //   textAlign: 'center',
    //   fontFamily: '微软雅黑',
    //   backgroundColor: 'rgba(12, 181, 106, 0.9)',
    //   border: '2px solid rgba(255, 255, 255, 0.8)'
    // })
    // map.addOverlay(label)
  }
  async renderOverlays(id) {
    const { type, nextzoom } = this.getTypeAndNextZoom()
    const res = await Axios.get(`http://localhost:8080/area/map?id=${id}`)
    res.data.body.forEach(item => {
      this.addOverlay(item, nextzoom, type)
    })
  }
  addOverlay(item, nextzoom, type) {
    if (type === 'circle') {
      this.addCircle(item, nextzoom)
    } else {
      this.addRect(item, nextzoom)
    }
  }
  addCircle(item, nextzoom) {
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const options = {
      position: point,
      offset: new BMap.Size(-35, -35)
    }
    const html = `
          <div class="bubble">
            <p class="name">${item.label}</p>
            <p>${item.count}套</p>
          </div>
        `
    const label = new BMap.Label(html, options)
    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: 0
    })
    // 3. 给地图添加覆盖物
    this.map.addOverlay(label)
    // 3. 给地图添加覆盖物
    this.map.addOverlay(label)
    label.addEventListener('click', () => {
      this.map.centerAndZoom(point, nextzoom)
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
      this.renderOverlays(item.value)
    })
  }
  addRect(item, nextzoom) {
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const options = {
      position: point,
      offset: new BMap.Size(-50, -15)
    }
    const html = `
      <div class="rect">
        <span class="housename">${item.label}</span>
        <span class="housenum">${item.count}套</span>
        <i class="arrow"></i>
      </div>
    `
    const label = new BMap.Label(html, options)
    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: '0px'
    })
    this.map.addOverlay(label)
    label.addEventListener('click', () => {
      Axios.get(`http://localhost:8080/houses?cityId=${item.value}`).then(
        res => {
          // console.log(res.data.body.list)
          this.setState({
            isShow: true,
            cityList: res.data.body.list
          })
        }
      )
    })
  }
  getTypeAndNextZoom() {
    let nextzoom, type
    const zoom = this.map.getZoom()
    if (zoom < 15) {
      nextzoom = zoom + 2
      type = 'circle'
    } else {
      nextzoom = 15
      type = 'rect'
    }
    return {
      nextzoom,
      type
    }
  }
  componentDidMount() {
    this.initMap()
  }
  renderHouses() {
    console.log(this.state.cityList)
    return this.state.cityList.map(item => (
      <div className="house" key={item.houseCode}>
        <div className="imgWrap">
          <img
            className="img"
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className="content">
          <h3 className="title">{item.title}</h3>
          <div className="desc">{item.desc}</div>
          <div>
            <span className="tag tag1">近地铁</span>
          </div>
          <div className="price">
            <span className="priceNum">{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
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
        {/* 房源信息*/}
        <div className={`houseList ${this.state.isShow ? 'show' : ''}`}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">
            {this.state.cityList ? this.renderHouses() : <></>}
          </div>
        </div>
      </div>
    )
  }
  goBack = () => {
    this.props.history.go(-1)
  }
}
export default Map
