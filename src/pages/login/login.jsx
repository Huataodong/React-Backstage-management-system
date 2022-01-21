/*
用户登陆的路由组件
*/
import React, { Component } from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api'
import { withRouter } from 'react-router';

class Login extends Component {
  /*
  async和await
  1.作用：简化promise对象的使用，不再使用then（）来制定成功/失败的回调函数
    以同步编码（没有回调函数了）方式实现异步流程
  2.哪里写await？
    在返回promise的表达方式左侧写await：不想要promise，想要promise异步执行的成功的value数据
  3.哪里写async？
    await所在函数（最近的）定义的左侧写async
  */
  onFinish = async (values) => {
    // 这个value就是我们需要获取的值
    const { username, password } = values
    const response = await reqLogin(username, password)
    console.log('请求成功', response.data)
    const result = response.data //{status:0, data:use .....}

    if (result.status === 0) { //登陆成功
      //提示登陆成功
      message.success('LOGIN SUCCESSFUL')

      //跳转到管理界面(不需要再退回到登陆)
      // return <Redirect to='/admin' />
      // this.props.history('/admin')
      this.props.history.push('/admin');


    }
    else {
      message.error(result.msg)
    }
  }



  // onFinish = async (values) => {
  //   //console.log("Received values of form: ", values);
  //   //
  //   // console.log('this----',this) 
  //   const { username, password } = values;
  //   try {
  //     //调用异步请求，
  //     this.props.login(username, password);

  //   } catch (error) {
  //     console.log("请求出错", error);
  //   }
  // };

  // onFinishFailed = (values, errorFields, outOfDate) => {
  //   console.log("校验失败");
  //   values.errorFields.map((x) => {
  //     return console.log(x.errors);
  //   });
  //   //console.log('value------',values)
  // };



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
            onFinishFailed={this.onFinishFailed}
          >

            <Form.Item
              initialValue='admin'
              name="username"
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
              ]}
            >
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

export default withRouter(Login);