// import React, { Component } from 'react'
// import { Button, message } from 'antd'
// // import './App.css';
// /*
// 应用根组件
// */
// class App extends Component {
//   handleClick = () => {
//     message.success('成功啦...');
//   }
//   render() {
//     return (
//       <Button type='primary' onClick={this.handleClick}>学习</Button>)
//   }
// }
// expo rt default App

import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
/*
应用根组件
*/
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </BrowserRouter>)
  }
}
export default App