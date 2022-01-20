/*
用户登陆的路由组件
*/

import React, { Component } from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default class Login extends Component {

  onFinish = (value) => {
    // 这个value就是我们需要获取的值
    console.log('校验成功', value)
  }

  onFinishFailed = (values, errorFields, outOfDate) => {
    console.log("校验失败");
    values.errorFields.map((x) => {
      return console.log(x.errors);
    });
    //console.log('value------',values)
  };

  validatePwd = (rule, value) => {
    // console.log(value)
    if (!value) {
      return Promise.reject("");
    } else if (value.length < 5) {
      return Promise.reject("password must be at least 5 characters");
    } else if (value.length > 12) {
      return Promise.reject("password cannot be longer than 12 characters");
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return Promise.reject("password must be letters or numbers");
    } else {
      return Promise.resolve(); //验证通过
    }
  };


  render() {
    return (
      <div className="login">
        {/* header--------------------------- */}
        <header className="login-header">
          <img src={logo} alt="logo"></img>
          <h1>React Project: Backstage management system</h1>
        </header>

        {/* Form------------------------------------- */}
        <section className="login-content">
          <h2>LOGIN</h2>

          {/* Validity requirements for username/password
              1). Must enter
              2). Must be greater than or equal to 5 digits
              3). Must be less than or equal to 10 bits
              4). Must be composed of English or numbers
           */}

          <Form name="normal_login" className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}>

            <Form.Item name="username"
              //配置对象：属性名是一些特定的名称
              //声明式验证：直接使用别人定义好的验证规则进行验证
              rules={[
                {
                  required: true,
                  // whitespace: true,
                },
                {
                  message: 'Please input your Username!'
                },
                {
                  min: 5,
                  message: "username must be at least 5 characters",
                },
                {
                  max: 10,
                  message: "username cannot be longer than 10 characters",
                },
                {
                  pattern: /^[a-zA-Z0-9]+$/,
                  message: "must be letters or numbers",
                }
              ]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                style={{ color: 'rgba(0,0,0,.25)' }}
              />
            </Form.Item>

            <Form.Item name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!'
                },
                {
                  validator: this.validatePwd,
                },

              ]}>

              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                style={{ color: 'rgba(0,0,0,.25)' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>

          </Form>
        </section>

      </div >
    )
  }
}

// {/* 
//   1.前台表单验证
//   2.收集表单验证数据
//         */}