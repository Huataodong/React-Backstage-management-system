import React, { Component } from 'react'

//非路由组件要引入 withRouter
import { withRouter } from 'react-router'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../link-button';
import menuList from '../../config/menuConfig'
import '../header/index.less'
import { formateDate } from '../../utils/dateUtils'
//默认暴露不用大括号
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


//左侧导航的组件
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()) //当前时间字符串
    }

    getTime = () => {
        //每隔一秒获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { //如果当前item对象的key与path匹配，item的title就是要显示的
                title = item.title
            } else if (item.children) {
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                //如果有值说明才匹配
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    //退出登录
    logout = () => {
        //显示确认框
        Modal.confirm({
            title: 'Are you sure you want to exit？',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                //删除保存user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login
                this.props.history.replace('/login')
            },

        })
    }

    /*
    第一次render()之后执行一次
    一般在次执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount() {
        //获取当前时间
        this.getTime()
    }

    //当前组件卸载之前调用
    componentWillUnmount() {
        //清楚定时器
        clearInterval(this.intervalId)
    }

    render() {

        const { currentTime } = this.state
        const username = memoryUtils.user.username
        //取出当前需要的title
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>{username}</span>
                    <LinkButton onClick={this.logout}>Logout</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                    </div>

                </div>
            </div>
        )
    }
}
export default withRouter(Header)