import React, { Component } from 'react'
import {
    Card,
    Table,
    Select,
    Input,
    Button,
    message,
} from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import allReq from '../../api';
import { PAGE_SIZE } from '../../utils/constants';


const Option = Select.Option

//product的默认子路由组件
export default class ProductHome extends Component {

    state = {
        total: 0, //商品总数量
        products: [], //商品数组
        loading: false,
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索

    }

    //初始化table的列的数组
    initColumns = () => {

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '¥' + price //当前制定了对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: 'Status',
                //dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? 'Not Available' : 'Available'}
                            </Button>
                            <span> {status === 1 ? 'In stock' : 'Sold out'}</span>
                        </span>
                    )
                }
            },
            {
                title: 'Opeartion',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>Detail</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>Modify</LinkButton>
                        </span>
                    )
                }
            }
        ];
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum，让其他方法可以看到
        this.setState({ loading: true }) //显示loading

        const { searchName, searchType } = this.state
        //如果搜索关键字有值，说明我们要做搜索分页  

        let result
        if (searchName) {
            result = await allReq.reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else { //一般请求分页
            result = await allReq.reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false }) //隐藏loading
        if (result.status === 200) {
            //取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data.data
            this.setState({
                total,
                products: list
            })
        }
    }

    //更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await allReq.reqUpdateStatus(productId, status)
        console.log("result:", result)
        if (result.data.status === 0) {
            message.success('Update successfully')
            this.getProducts(this.pageNum)
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {

        const { products, total, loading, searchType, searchName } = this.state



        const title = (
            <span>
                <Select value={searchType}
                    style={{ width: 180 }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>Search by name</Option>
                    <Option value='productDesc'>Search by description</Option>
                </Select>

                <Input placeholder="keywords"
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>

            </span>
        )

        const extra = (
            <Button type='primary'
                onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                Add product
            </Button>
        )

        return (
            < Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />

            </Card>
        )
    }
}