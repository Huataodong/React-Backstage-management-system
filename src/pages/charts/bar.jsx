import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react';
//首页路由

export default class Bar extends Component {

    state = {
        sales: [5, 20, 36, 10, 10, 20], //销量
        stores: [6, 10, 25, 20, 15, 10] // 库存
    }


    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.reduce((pre, store) => {
                pre.push(store - 1)
                return pre
            }, []),
        }))
    }

    //返回柱状图的配置对象
    getOption = (sales, stores) => {
        return {
            title: {
                text: 'ECharts Example'
            },
            tooltip: {},
            legend: {
                data: ['Sales', 'In Stock']
            },
            xAxis: {
                data: ['Laptop', 'Refrigerator', 'Books', 'Chair', 'Sofa', 'TV']
            },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                data: sales
            },
            {
                name: 'In Stock',
                type: 'bar',
                data: stores
            }]
        }
    }
    render() {
        const { sales, stores } = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>Update</Button>
                </Card>
                <Card title='Bar Chart'>
                    <ReactEcharts option={this.getOption(sales, stores)} />
                </Card>
            </div>
        )
    }
}