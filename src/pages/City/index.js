import React from 'react'
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import { List, AutoSizer } from 'react-virtualized'

class City extends React.Component {
  constructor(props) {
    super(props)
    // 创建ref对象
    this.cityNavRef = React.createRef()
  }
  state = {
    arr: [],
    obj: {},
    rowHeight: 200,
    currentNav: 0,
    navNum: 0
  }
  goBack = () => {
    this.props.history.go(-1)
  }
  async componentDidMount() {
    await this.getCityList()
    this.cityNavRef.current.measureAllRows()
  }
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { status, body } = res.data
    if (status === 200) {
      // console.log(body)
      var obj = {}
      // var arr = []
      // 对拿到的数据进行处理 我们需要一个一个对象 键是字母 值是一个数组 里面是一个一个的对象(是每一个城市的信息) 还需要一个数组是有序的(字母排序)
      body.forEach(item => {
        // 判断这个body中的short属性的第一个字母是不是在我们定义的新对象中 如果在 push一个新的
        // 如果不在 创建一个新的属性 值是一个[]
        var key = item.short.slice(0, 1)
        if (obj[key]) {
          obj[key].push(item)
        } else {
          obj[key] = [item]
        }
      })
      // console.log(obj)
      const arr = Object.keys(obj).sort()
      // console.log(arr)
      const hotRes = await axios.get('http://localhost:8080/area/hot')
      if (hotRes.data.status === 200) {
        arr.unshift('hot')
        arr.unshift('#')
        obj['hot'] = hotRes.data.body
        obj['#'] = [JSON.parse(localStorage.getItem('currentCity'))]
      }
      // console.log(obj, arr)
      this.setState({
        arr: arr,
        obj: obj
      })
      // console.log(this.state.obj, this.state.arr)
    }
  }
  formatTitle(title) {
    if (title === 'hot') {
      return '热门城市'
    } else if (title === '#') {
      return '当前城市'
    } else {
      return title.toUpperCase()
    }
  }
  rowRenderer({
    key, // 唯一的key值
    index, // 每一行的索引号
    style // 样式对象
  }) {
    const letter = this.state.arr[index]
    // console.log(letter)
    const list = this.state.obj[letter]
    // console.log(list)
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatTitle(letter)}</div>
        {/* {console.log(list)} */}
        {list.map(item => (
          <div
            className="name"
            key={item.value}
            onClick={this.changeCity.bind(this, item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 点击选择城市 将城市的信息储存到localStorage中
  changeCity(city) {
    const haveHouseArr = ['北京', '上海', '广州', '深圳']
    if (haveHouseArr.includes(city.label)) {
      localStorage.setItem('currentCity', JSON.stringify(city))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源', 2, null, false)
    }
  }
  setRowHeight({ index }) {
    const letter = this.state.arr[index]
    // console.log(letter)
    const list = this.state.obj[letter]

    return 36 + list.length * 50
  }
  // 渲染右边的导航
  renderShortList() {
    return (
      <ul className="rightNav">
        {this.state.arr.map((item, index) => (
          <li className="rightNavItem" key={item}>
            <span
              className={index === this.state.currentNav ? 'activeNav' : ''}
              onClick={this.clickNav.bind(this, index)}
            >
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    )
  }
  onRowsRendered({ startIndex }) {
    if (this.state.currentNav !== startIndex) {
      this.setState({
        currentNav: startIndex
      })
    }
  }
  // 点击对应的导航切换到相应的城市
  clickNav(index) {
    // console.log(index)
    // console.log(this.state.currentNav)
    this.setState({
      currentNav: index
    })
    this.cityNavRef.current.scrollToRow(index)
  }
  // scrollToIndex({index}) {
  //   index: this.state.currentNav
  // }
  render() {
    return (
      <div className="city">
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={this.goBack}
        >
          城市选择
        </NavBar>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityNavRef}
              width={width}
              height={height}
              rowCount={this.state.arr.length}
              rowHeight={this.setRowHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
              // scrollToIndex={this.state.navNum}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        {this.renderShortList()}
      </div>
    )
  }
}
export default City
