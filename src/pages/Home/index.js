import React from 'react'
import { Route, Redirect, Switch, NavLink } from 'react-router-dom'
import './index.scss'
import Index from './index/index'
import House from './house/index'
import News from './news/index'
import My from './my/index'
class Home extends React.Component {
  render() {
    return (
      <div className="home">
        {/* 首页 */}
        <Switch>
          <Redirect exact from="/home" to="/home/index" />
          <Route path="/home/index" component={Index} />
          <Route path="/home/house" component={House} />
          <Route path="/home/news" component={News} />
          <Route path="/home/my" component={My} />
        </Switch>
        <ul className="ul">
          <li>
            <NavLink to="/home/index">
              <i className="iconfont icon-ind" />
              <p>首页</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/house">
              <i className="iconfont icon-findHouse" />
              <p>找房</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/news">
              <i className="iconfont icon-infom" />
              <p>资讯</p>
            </NavLink>
          </li>
          <li>
            <NavLink to="/home/my">
              <i className="iconfont icon-my" />
              <p>我的</p>
            </NavLink>
          </li>
        </ul>
      </div>
    )
  }
}
export default Home
