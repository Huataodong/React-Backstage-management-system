//包含应用中所有请求函数的模块
//每个函数的返回值都是promise
//要求：能根据API接口文档定义接口要求

import ajax from './ajax'

// const BASE = "http://localhost:5001"; //跨域，站在3000的端口请求5001
//所以要用代理   "proxy": "http://localhost:5001"

const BASE = ''
//const 函数写法---只用写一行
//登陆
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')




//统一暴露写法
// export default {
//     xxx() {
//     },
//     yyy() {
//     }
// }

//分别暴露写法
// export function reqLogin() {
//     return ajax('/login', { username, password }, 'POST')
// }