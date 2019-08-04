import React from 'react'
import Lunbo from './lunbo/index'
import img1 from 'assets/images/nav-1.png'
import img2 from 'assets/images/nav-2.png'
import img3 from 'assets/images/nav-3.png'
import img4 from 'assets/images/nav-4.png'
// import cc from 'assets/images/cc.jpg'
import './index.scss'
import axios from 'axios'
class Index extends React.Component {
  state = {
    area: 1,
    list: [],
    news: [],
    cityName: '北京'
  }
  componentDidMount() {
    this.getSteam()
    this.getNews()
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     console.log(position.coords)
    //   },
    //   error => {
    //     console.log(error)
    //   }
    // )
    // 使用百度地图的api利用ip获取当前城市名
    var myCity = new window.BMap.LocalCity()
    myCity.get(result => {
      // console.log(result)
      this.setState({
        cityName: result.name
      })
      this.getCurrentCityInfo()
    })
  }
  async getCurrentCityInfo() {
    console.log(this.state.cityName)
    const res = await axios.get(`http://localhost:8080/area/info`, {
      params: {
        name: this.state.cityName
      }
    })
    // console.log(res.data)
    const { status, body } = res.data
    if (status === 200) {
      console.log(body)
      localStorage.setItem('currentCity', JSON.stringify(body))
      this.setState({
        cityName: body.label
      })
    }
  }
  async getSteam() {
    const res = await axios.get(
      `http://localhost:8080/home/groups?${this.state.area}`
    )
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        list: body
      })
      // console.log(this.state.list)
    }
  }
  async getNews() {
    const res = await axios.get(
      `http://localhost:8080/home/news?${this.state.area}`
    )
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        news: body
      })
    }
  }
  handleClick = () => {
    // console.log(this.props)
    this.props.history.push('/city')
  }
  goMap = () => {
    // console.log(this.props)
    this.props.history.push('/map')
  }
  render() {
    return (
      <div className="home_index">
        <div className="header clearfix">
          <div className="search clearfix">
            <div className="city" onClick={this.handleClick}>
              <span>{this.state.cityName}</span>
              <i className="iconfont icon-arrow" />
            </div>
            <div className="right">
              <i className="iconfont icon-seach" />
              <input type="text" placeholder="请输入小区或地址" />
            </div>
          </div>
          <div className="map">
            <i className="iconfont icon-map" onClick={this.goMap} />
          </div>
        </div>

        <Lunbo />
        <ul>
          <li>
            <a href="/home/house">
              <img src={img1} alt="" />
              <p>整租</p>
            </a>
          </li>
          <li>
            <a href="/home/house">
              <img src={img2} alt="" />
              <p>合租</p>
            </a>
          </li>
          <li>
            <a href="/map">
              <img src={img3} alt="" />
              <p>地图找房</p>
            </a>
          </li>
          <li>
            <a href="rent">
              <img src={img4} alt="" />
              <p>去出租</p>
            </a>
          </li>
        </ul>
        {/* 租房小组 */}
        <div className="team">
          <h3>租房小组</h3>
          <a href="gh">更多</a>
        </div>
        {/* content */}
        <div className="content">
          <ul>
            {this.state.list.map(item => (
              <li key={item.id}>
                <a href="j">
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                  <div className="text">
                    <p>{item.title}</p>
                    <span>{item.desc}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="new_h3">最新资讯</h3>
          <ul>
            {this.state.news.map(item => (
              <li key={item.id}>
                <a href="123">
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                  <div className="right">
                    <h3>{item.title}</h3>
                    <span>{item.from}</span>
                    <span>{item.date}</span>
                  </div>
                  <p />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
export default Index
