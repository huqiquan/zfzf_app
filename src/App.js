import React from 'react'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          {/* <ul>
            <li>
              <Link to="/home">Home组件</Link>
            </li>
            <li>
              <Link to="/map">Map组件</Link>
            </li>
            <li>
              <Link to="/city">City组件</Link>
            </li>
          </ul> */}
          <Route path="/home" component={Home} />
          <Route path="/city" component={City} />
          <Route path="/map" component={Map} />
        </div>
      </BrowserRouter>
    )
  }
}
export default App
