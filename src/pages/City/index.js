import React from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
// import { List } from 'react-virtualized'

class City extends React.Component {
  state = {
    arr: [],
    obj: {}
  }
  goBack = () => {
    this.props.history.go(-1)
  }
  componentDidMount() {
    this.getCityList()
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
        obj['#'] = localStorage.getItem('currentCity')
      }
      // console.log(obj, arr)
      this.setState({
        arr: arr,
        obj: obj
      })
      console.log(this.state.obj, this.state.arr)
    }
  }
  // rowRenderer({
  //   key, // 唯一的key值
  //   index, // 每一行的索引号
  //   isScrolling, // 是否在滚动中
  //   isVisible, // 是否可见
  //   style // 样式对象
  // }) {
  //   return (
  //     <div key={key} style={style}>
  //       {this.state.arr[index]}
  //     </div>
  //   )
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
        {/* <List
          width={300}
          height={300}
          rowCount={this.state.arr.length}
          rowHeight={20}
          rowRenderer={this.rowRenderer}
        /> */}
      </div>
    )
  }
}
export default City
