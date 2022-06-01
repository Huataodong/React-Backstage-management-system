import React, { PureComponent } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;

export default class AddForm extends PureComponent {

    static propTypes = {
        setInput: PropTypes.func.isRequired,
    };

    render() {
        const formItemLayout = {
            labelCol: { span: 6 }, //左侧label宽度
            wrapperCol: { span: 12 }, //右侧包裹输入框宽度
        };
        return (
            <Form >
                <Item
                    {...formItemLayout}
                    label="Position name"
                    name="username"
                    rules={[{ required: true, message: "must enter the position name!" }]}
                >
                    <Input
                        placeholder="please enter the position name"
                        ref={(input) => {
                            this.props.setInput(input)
                        }}
                    ></Input>
                </Item>
            </Form>
        );
    }
}
