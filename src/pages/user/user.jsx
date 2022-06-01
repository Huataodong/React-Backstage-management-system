import React, { Component } from "react";
import { Button, Card, Table, Modal, message } from "antd";

import { formateDate } from "../../utils/dateUtils";
import LinkButton from '../../components/link-button';
import allReq from '../../api'
import UserForm from "./user-form";
export default class Users extends Component {
    state = {
        users: [], //所有用户列表
        showStatus: 0,
        roles: [],
        user: {},
    };
    constructor(props) {
        super(props);
        this.us = React.createRef();
    }
    initColumns = () => {
        this.columns = [
            {
                title: "Username",
                dataIndex: "username",
            },
            {
                title: "Email",
                dataIndex: "email",
            },
            {
                title: "Phone number",
                dataIndex: "phone",
            },
            {
                title: "Register time",
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time),
            },
            {
                title: "Position",
                dataIndex: "role_id",
                render: (role_id) =>
                    // {
                    //     const role=this.state.roles.find(role=>role._id===role_id)
                    //     return role?role.name:''}
                    //防止反复生成
                    this.roleNames[role_id],
            },
            {
                title: "Operation",
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>Modify</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                ),
            },
        ];
    };
    /* 根据role数据,生成包含所有角色名的对象 */
    initRoles = (roles) => {
        this.roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name ? role.name : "";
            return pre;
        }, []);
    };
    /* 删除指定用户 */
    deleteUser = (user) => {
        Modal.confirm({
            title: `Comfirm delete ${user.username}?`,

            onOk: async () => {
                const result = await allReq.reqDelUser(user._id);
                if (result.data.status === 0) {
                    message.success("Delete user successfully!");
                    this.getUsers();
                } else {
                    message.error("Failed to delete user!");
                }
            },
        });
    };
    /* 获取用户列表 */
    getUsers = async () => {
        const result = await allReq.reqUsers();
        if (result.data.status === 0) {
            const { users, roles } = result.data.data;
            this.initRoles(roles);
            this.setState({ users, roles });
        } else {
            message.error("Failed to get position list");
        }
    };
    addOrUpdateuser = async () => {
        //收集数据
        let user = this.us.current.addOrUpdateUser();
        user.create_time = Date.now();
        if (this.state.user._id) {
            user._id = this.state.user._id;
        }
        //   2.提交添加的请求
        const result = await allReq.reqAddOrUpdateUser(user);
        // 3.更新列表显示
        if (result.data.status === 0) {
            message.success(`${this.state.user._id ? 'Modify' : 'Add'}user successfully`);
            this.getUsers();
            this.setState({ showStatus: 0 });
        } else {
            message.error(`${this.state.user._id ? 'Modify' : 'Add'}user successfully`);
        }
        // //console.log(user);
    };
    showUpdate = (user) => {
        this.setState({ showStatus: 1, user: user });
    };
    UNSAFE_componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getUsers();
    }
    handleCancel = () => {
        this.setState({ showStatus: 0 });
    };
    render() {
        const { users, showStatus, roles } = this.state;
        ////console.log(users);
        const title = (
            <Button
                type="primary"
                onClick={() => {
                    this.setState({ showStatus: 1, user: {} });
                }}
            >
                Create user
            </Button>
        );
        return (
            <Card title={title}>
                <Table
                    rowKey="_id"
                    pagination={

                        3
                    }
                    dataSource={users}
                    columns={this.columns}
                    bordered
                />
                <Modal
                    title={this.state.user._id ? "Modify user" : "Add user"}
                    visible={showStatus === 1}
                    onOk={this.addOrUpdateuser}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <UserForm roles={roles} ref={this.us} user={this.state.user} />
                </Modal>
            </Card>
        );
    }
}
