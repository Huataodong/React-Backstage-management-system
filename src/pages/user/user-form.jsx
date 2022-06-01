import React, { PureComponent } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;

export default class UserForm extends PureComponent {
    static propTypes = {
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
    };
    state = {};
    onValuesChange = (values) => {
        this.setState(values);
    };
    addOrUpdateUser = () => {
        //收集数据
        const user = this.state;
        // console.log(user);
        //   2.提交添加的请求
        return user;
        // 3.更新列表显示
    };
    render() {
        const formItemLayout = {
            labelCol: { span: 6 }, //左侧label宽度
            wrapperCol: { span: 12 }, //右侧包裹输入框宽度
        };
        const { roles } = this.props;
        const user = this.props.user
        // console.log(roles)
        return (
            <Form {...formItemLayout} onValuesChange={this.onValuesChange}>
                <Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "must enter a username!" }]}
                    initialValue={user.username}
                >
                    <Input placeholder="please enter a username"></Input>
                </Item>
                {
                    user._id ? null : <Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "must enter the password!" }]}
                        initialValue={user.password}
                    >
                        <Input type="password" placeholder="please enter the password"></Input>
                    </Item>
                }

                <Item
                    label="phone number"
                    name="phone"
                    rules={[{ required: true, message: "must enter the phone number!" }]}
                    initialValue={user.phone}
                >
                    <Input
                        //   type='password'
                        placeholder="please enter the phone number"
                    ></Input>
                </Item>
                <Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "must enter the email!" }]}
                    initialValue={user.email}
                >
                    <Input
                        //   type='password'
                        placeholder="please enter the email"
                    ></Input>
                </Item>
                <Item
                    label="Position"
                    name="role_id"
                    rules={[{ required: true, message: "must select a positon!" }]}
                    initialValue={user.role_id}
                >
                    <Select placeholder="please select a position">
                        {roles.map((role) => (
                            <Select.Option key={role._id} value={role._id}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Item>
            </Form>
        );
    }
}
