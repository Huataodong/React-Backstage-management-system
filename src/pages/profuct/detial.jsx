import React, { Component } from 'react'
import {
    Card,
    List,

} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import { BASE_IMG_URL } from '../../utils/constants';
import allReq from '../../api';

const Item = List.Item


//product的添加和更新的子路由组件

export default class ProductDetail extends Component {

    state = {
        cName1: '', //一级分类名称
        cName2: '', //二级分类名称
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') { //一级分类下的商品
            const result = await allReq.reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {  //二级分类下的商品    

            //通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送
            const result1 = await allReq.reqCategory(pCategoryId) //一级分类
            const result2 = await allReq.reqCategory(categoryId)  //二级分类
            const cName1 = result1.data.data.name
            const cName2 = result2.data.data.name
            // console.log("cName1:", cName1)

            //一次性发送多个请求，只有都成功了才正常处理
            // const results = await Promise.all([allReq.reqCategory(categoryId), allReq.reqCategory(categoryId)])
            // const cName1 = results[0].data.data.name
            // const cName2 = results[1].data.data.name

            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {

        //读取携带过来的state数据
        const { name, desc, price, imgs, detail } = this.props.location.state.product

        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{ color: 'green', marginRight: 10, fontSize: 15 }}
                        onClick={() => this.props.history.goBack()} />
                </LinkButton>

                <span>Product Details</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="left">Name：</span> <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">Description：</span> <span>{desc}</span>
                    </Item>

                    <Item>
                        <span className="left">Price：</span> <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">Category：</span> <span>{cName1}---{cName2}</span>
                    </Item>
                    <Item>
                        <span className="left">Image：</span> <span>
                            {
                                imgs.map(img => (
                                    <img
                                        key={img}
                                        src={BASE_IMG_URL + img}
                                        className="product-img"
                                        alt='img'
                                    />
                                ))
                            }

                        </span>
                    </Item>
                    <Item>
                        <span className="left">Details：</span> <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card >
        )
    }
}