// //包含应用中所有请求函数的模块
// //每个函数的返回值都是promise
// //要求：能根据API接口文档定义接口要求

// import ajax from './ajax'

// // const BASE = "http://localhost:5001"; //跨域，站在3000的端口请求5001
// //所以要用代理   "proxy": "http://localhost:5001"

// const BASE = ''
// //const 函数写法---只用写一行
// //登陆
// export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')


// // //添加用户
// export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')
// // 获取一级或某个二级分类列表
// export const reqCategorys = (parentId) => ajax('/manage/category/list', { parentId })


// // 添加分类
// export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')
// // 更新品类名称
// export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')








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



/*
 * @Author: your name
 * @Date: 2021-05-14 09:47:41
 * @LastEditTime: 2021-05-27 14:25:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \JSStudye:\Bili前端学习\5.React\workspace\react-admin-client\src\api\index.js
 */

/**
 * 要求:能根据接口文档定义接口请求函数
 * 包含应用中所有接口请求函数的模块
 * 每个接口的返回值都是promise
 */
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

const allReq = {
    reqLogin(username, password) {
        return ajax("/login", { username, password }, "POST");
    },
    reqAddUser(userDetail) {
        return ajax("/manage/user/add", userDetail, "POST");
    },

    // json请求的接口请求函数
    reqWeather() {
        return new Promise((resolve, reject) => {
            const url =
                "https://restapi.amap.com/v3/weather/weatherInfo?city=420100&key=10bf3cbb5656059a6e2462481330f976";
            jsonp(url, {}, (err, data) => {
                // console.log("@@@@");
                // console.log("jsonp", err, data);
                if (!err && data.info === "OK") {
                    const { weather } = data.lives[0];
                    resolve(weather);
                } else {
                    message.error("获取天气信息失败");
                }
            });
        });
    },

    //获取一级/二级分类的列表
    reqCategorys(parentId) {
        return ajax("/manage/category/list", { parentId }, "GET");
    },
    //添加分类
    reqAddCategory(categoryName, parentId) {
        return ajax("/manage/category/add", { categoryName, parentId }, "POST");
    },
    //更新分类
    reqUpdateCategory(categoryId, categoryName) {
        return ajax(
            "/manage/category/update",
            { categoryId, categoryName },
            "POST"
        );
    },

    //获取一个分类
    reqCategory(categoryId) {
        return ajax("/manage/category/info", { categoryId }, "GET");
    },
    //获取商品分页列表
    reqProducts(pageNum, pageSize) {
        return ajax("/manage/product/list", { pageNum, pageSize }, "GET");
    },
    //更新商品的状态(上架/下架)
    reqUpdateStatus(productId, status) {
        return ajax("/manage/product/updateStatus", { productId, status }, "POST");
    },

    //搜索商品分页列表    searchType:搜索类型，productDesc/productName
    reqSearchProducts({ pageNum, pageSize, searchName, searchType }) {
        return ajax(
            "/manage/product/search",
            {
                pageNum,
                pageSize,
                //想要一个变量名作为属性值的时候，需要加[]
                [searchType]: searchName,
            },
            "GET"
        );
    },

    //删除指定名称的图片
    reqDeleteImg(name) {
        return ajax("/manage/img/delete", { name }, "POST");
    },

    //添加/修改商品
    reqAddOrUpdateProduct(product) {
        return ajax(
            "/manage/product/" + (product._id ? "update" : "add"),
            product,
            "POST"
        );
    },

    //获取所有角色的列表
    reqRoles() {
        return ajax("manage/role/list");
    },

    //添加角色
    reqAddRole(roleName) {
        return ajax("manage/role/add", { roleName }, "POST");
    },

    //更新角色权限,形参role为对象
    reqUpdateRole(role) {
        return ajax("manage/role/update", role, "POST");
    },

    //获取用户列表
    reqUsers() {
        return ajax("/manage/user/list");
    },

    //删除指定用户
    reqDeleteUser(userId) {
        return ajax("/manage/user/delete", { userId }, "POST");
    },

    //添加/删除用户
    reqAddOrUpdateUser(user) {
        return ajax("/manage/user/" + (user._id ? "update" : "add"), user, "POST");
    },
};
// allReq.reqWeather();
export default allReq;