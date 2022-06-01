import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import '../left-nav/index.less'
import { Menu } from 'antd'
import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;


//左侧导航的组件
class LeftNav extends Component {

    //判断当前登陆用户对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        //1. 如何当前用户是admin
        //2. 如果当前item是公开的
        //3. 当前用户有此item的权限：key有没有menus中

        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { // 4. 如果当前用户有此item的某个子item权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    //根据menu的数据数组生成对应的标签数组
    //使用map() + 递归调用 
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {

            if (!item.children) {
                return (
                    <Menu.Item key={item.key} >
                        <Link to={item.key}>
                            {<item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {

                return (
                    <SubMenu
                        key={item.key} title={
                            <span >
                                {<item.icon />}
                                <span>{item.title}</span>
                            </span>}
                    > {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    //根据menu的数据数组生成对应的标签数组
    //使用reduce() + 递归调用 
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {

            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                //向pre添加<Menu.Item> 
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                {<item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>))
                } else {

                    //查找一个与当前请求路径匹配的子Item
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                        //如果存在 说明当前item的子列表需要打开
                        this.openKey = item.key
                    }


                    //向pre添加<SubMenu> 
                    pre.push((
                        <SubMenu
                            key={item.key} title={
                                <span>
                                    {<item.icon />}
                                    <span>{item.title}</span>
                                </span>}
                        > {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }

    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)

    }

    render() {


        //得到当前请求的路由路径
        let path = this.props.location.pathname

        if (path.indexOf('/product') === 0) { //当前请求的是商品或者其子路由界面
            path = '/product'
        }
        //得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className='left-nav' >
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>C.M.S</h1>
                </Link >

                <Menu
                    mode="inline"
                    theme="light"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    style={{ width: '201px' }}
                // theme="dark"
                // style={{ backgroundColor: '#b5f5ec' }}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div >
        )
    }
}

/*
withRouter高阶组件：
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(LeftNav)



/* <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to='/home'>
                            <span>首页</span>
                        </Link>

                    </Menu.Item>

                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
                        <Menu.Item key="2">
                            <Link to='/category'>
                                <span>品类管理</span>
                            </Link>

                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to='/product'>
                                <span> 商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="4" icon={<UserOutlined />}>
                        <Link to='/user'>
                            <span>用户管理</span>
                        </Link>

                    </Menu.Item>

                    <Menu.Item key="5" icon={<SafetyOutlined />}>
                        <Link to='/role'>
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>

                    <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表">

                        <Menu.Item key="6" icon={<BarChartOutlined />} >
                            <Link to='/charts/bar'>
                                <span>柱形图</span>
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="7" icon={<LineChartOutlined />} >
                            <Link to='/charts/line'>
                                <span>折线图</span>
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="8" icon={<PieChartOutlined />} >
                            <Link to='/charts/pie'>
                                <span>饼图</span>
                            </Link>
                        </Menu.Item>

                    </SubMenu> */