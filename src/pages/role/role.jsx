import React, { Component, } from "react";
// import { connect } from 'react-redux'
import { Card, Button, Table, Modal, message } from "antd";

// import { PAGE_SIZE } from "../../utils/constant";
import allReq from "../../api";
import AddForm from "./add-form.jsx";
import AuthForm from "./auth-form";
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';

/* 角色路由 */
class Role extends Component {
    state = {
        loading: false,
        roles: [],
        role: {},
        showStatus: 0,
    };
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    getRoles = async () => {
        const result = await allReq.reqRoles();
        if (result.data.status === 0) {
            const roles = result.data.data;
            this.setState({
                roles,
            });
        }
    };
    initColumn = () => {
        this.columns = [
            {
                title: "Position name",
                dataIndex: "name",
            },
            {
                title: "Creation time",
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time)
            },
            {
                title: "Authorization time",
                dataIndex: "auth_time",
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: "Authorizer",
                dataIndex: "auth_name",
            },
        ];
    };
    handleCancel = () => {
        this.setState({ showStatus: 0 });
    };
    addRole = async () => {
        const result = await allReq.reqAddRole(this.input.props.value);
        if (result.data.status === 0) {
            message.success("Added position successfully");
            // this.getRoles()
            // 可以不请求直接添加到roles列表
            const role = result.data.data;
            // const roles =[...this.state.roles]
            // roles.push(role)
            // this.setState({roles:roles})
            this.setState((state) => ({
                roles: [...state.roles, role],
            }));
        } else {
            message.error("Failed to add position");
        }
        this.setState({ showStatus: 0 });
    };

    setRole = async () => {
        //   console.log('select',select)
        const menus = this.auth.current.getMenus()
        const role = this.state.role
        role.menus = menus
        role.auth_time = Date.now()
        // role.auth_name = this.props.user.username

        role.auth_name = memoryUtils.user.username
        //  console.log(role)
        const result = await allReq.reqUpdateRole(role)
        if (result.data.status === 0) {

            //如果更新的是自己角色权限,强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('The current user position has been modified successfully, please log in again')
            } else {
                message.success('Set permissions successfully')
                this.setState({ showStatus: 0 });
            }
        } else {
            message.error('Failed to set permissions')
        }

    };




    componentDidMount() {
        this.getRoles();
    }
    UNSAFE_componentWillMount() {
        this.initColumn();
    }
    render() {
        const { roles, role, showStatus } = this.state;
        const title = (
            <span>
                <Button
                    type="primary"
                    onClick={() => this.setState({ showStatus: 1 })}
                    style={{ marginRight: "20px" }}>
                    Create
                </Button>
                <Button
                    type="primary"
                    onClick={() => this.setState({ showStatus: 2 })}
                    disabled={!role._id}
                >
                    Set permissions
                </Button>
            </span >
        );

        // console.log(roles)
        // console.log(this.columns)
        return (
            <Card title={title}>
                <Table
                    rowKey="_id"
                    pagination={{
                        pageSize: 5,
                        // , total: 50
                    }}
                    dataSource={roles}
                    columns={this.columns}
                    loading={this.state.loading}
                    rowSelection={{
                        type: "radio", selectedRowKeys: [role._id], onSelect: (role) => {
                            this.setState({ role: role })
                        }
                    }} //设置单选
                    onRow={(role) => {
                        return {
                            onSelect: (event) => {
                                this.setState({ role });
                            },
                            onClick: (event) => {
                                this.setState({ role });
                            }, // 点击行
                            onDoubleClick: (event) => { },
                            onContextMenu: (event) => { },
                            onMouseEnter: (event) => { }, // 鼠标移入行
                            onMouseLeave: (event) => { },
                        };
                    }}
                    bordered
                />
                <Modal
                    title="Create"
                    visible={showStatus === 1}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}

                >
                    <AddForm
                        categoryName
                        setInput={(input) => {
                            this.input = input;
                        }}
                    />
                </Modal>
                <Modal
                    title="Set permissions"
                    visible={showStatus === 2}
                    onOk={this.setRole}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card >
        );
    }
}
export default Role