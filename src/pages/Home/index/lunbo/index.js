import React from 'react'
import { Carousel } from 'antd-mobile'
import './index.scss'
import axios from 'axios'

class Lunbo extends React.Component {
  state = {
    data: [],
    imgHeight: 212
  }
  componentDidMount() {
    // simulate img loading
    this.getInfo()
  }
  async getInfo() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    const { body, status } = res.data
    // console.log(res)
    if (status === 200) {
      this.setState({
        data: body
      })
      // console.log(this.state.data)
    }
  }
  render() {
    if (!this.state.data.length) {
      return null
    }
    return (
      <div style={{ height: this.state.imgHeight }}>
        <Carousel autoplay={false} infinite>
          {this.state.data.map(item => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight
              }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
              />
            </a>
          ))}
        </Carousel>
      </div>
    )
  }
}

// ReactDOM.render(<App />, mountNode)
export default Lunbo
