/*
后台管理主路由组件
*/
import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav';
import Header from '../../components/header/header';
import Home from '../home/home'
import Category from '../category/category'
import Product from '../profuct/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {

  render() {
    const user = memoryUtils.user
    //如果内存中没有存储user ==>当前没有登陆
    if (!user || !user._id) {
      //自动跳转到登陆（在render（）中）
      return <Redirect to='/login' />
    }
    return (
      <Layout>
        <Sider style={{ backgroundColor: "#b0d2d6" }}>
          <LeftNav />
        </Sider>
        <Layout >
          <Header >Header</Header>
          <Content style={{ margin: '15px' }}>

            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center', color: '#aaaaaa' }}>It is recommended to use Google Chrome for better page operation</Footer>
        </Layout>
      </Layout >
    )
  }
}