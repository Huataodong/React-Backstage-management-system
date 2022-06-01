import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  message,
  Button,
} from 'antd'

import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import allReq from '../../api';
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor';

const { Item } = Form

//product的添加和更新的子路由组件
export default class ProductAddUpdate extends Component {

  state = {
    options: [],
  };

  constructor(props) {
    super(props);
    //创造保存ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }


  //进行表单验证，如果通过了，才发送请求
  onFinish = async (values) => {//调用接口请求函数去添加/更新
    const imgs = this.pw.current.getImgs();
    const detail = this.editor.current.getDetail();
    const { name, desc, price, categoryIds } = values
    const pCategoryId = categoryIds[0]
    const categoryId = categoryIds[1]
    const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
    if (this.isUpdate) {
      product._id = this.product._id
    }
    const result = await allReq.reqAddOrUpdateProduct(product)

    console.log("result.data.status", result)
    if (result.data.status === 0) {
      message.success(`${this.isUpdate ? 'Update' : 'Add'}product successfully`)
      this.props.history.goBack()
    } else {
      message.error(`${this.isUpdate ? 'Update' : 'Add'}product failed`)
    }
  };


  //异步获取一级/二级分类列表，并显示
  //async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
  getCategorys = async (parentId) => {
    const result = await allReq.reqCategorys(parentId);
    // console.log("result ", result)
    if (result.data.status === 0) {
      const categorys = result.data.data;
      //如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys)
      } else {  //二级列表
        return categorys //返回二级列表  ==》 当前的async函数返回的promise就会成功且value为categorys
      }

    }
  }

  initOptions = async (categorys) => {
    //根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))

    //如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      //关联到对应的一级option上
      targetOption.children = childOptions
    }

    //更新options状态
    this.setState({
      options
    })
  }
  componentDidMount() {
    this.getCategorys("0");
  }

  componentWillMount() {
    //取出携带的state
    const product = this.props.location.state //如果是添加没值，否则有值
    this.isUpdate = !!product //!! = true 是否是更新的标识
    //如果没有就是一个空对象
    this.product = product || {}
  }

  /* 用来加载下面数字组 */
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0]
    //显示loading
    targetOption.loading = true;
    //   load options lazily
    //获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    if (subCategorys && subCategorys.length > 0) {
      const cOptions = subCategorys.map((c) => ({
        //注意小括号,生成二级列表
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      //关联到当前的option上
      targetOption.children = cOptions;
    } else {
      //当前分类没有二级分类
      targetOption.isLeaf = true;
    }
    targetOption.loading = false;
    this.setState({ options: [...this.state.options] });
  };

  render() {


    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 3 }, //左侧label的宽度
      wrapperCol: { span: 10 }, //右侧包裹的宽度
    };


    const { TextArea } = Input;
    const { isUpdate } = this


    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <ArrowLeftOutlined style={{ fontSize: 18 }} />
        </LinkButton>
        <span>{isUpdate ? 'Modify product' : 'Add product'}</span>
      </span>
    )

    // const { pCategoryId, categoryId, imgs, detail } = product
    const {
      name,
      desc,
      price,
      detail,
      imgs,
      pCategoryId,
      categoryId,
    } = this.product;

    //用来接受联级分类的数组
    const categoryIds = [];
    if (isUpdate) {
      //商品是一个一级分类的商品
      if (pCategoryId === '0') {
        categoryIds.push(pCategoryId)
      } else { //商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }

    }


    return (
      <Card title={title}>
        <Form {...formItemLayout}
          onFinish={this.onFinish}
        // onFinishFailed={onFinishFailed}
        >

          <Item
            name="name"
            label="Name"
            initialValue={name}
            rules={[{ required: true, message: "must enter product name!" }]}
          >
            <Input placeholder='please enter product name' />
          </Item>

          <Item
            name="desc"
            label="Description"
            initialValue={desc}
            rules={[{ required: true, message: "must enter description!" }]}
          >
            <TextArea placeholder="please enter description " rows={2} minLength={2} maxLength={100} />
          </Item>

          <Item
            name="price"
            label="Price"
            initialValue={price}
            rules={[
              { required: true, message: "must enter production price!" },
              {
                validator: (_, value) =>
                  !value || value * 1 > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("price must be greater than 0")),
              },
            ]}
          >
            <Input type={Number} placeholder="pslease enter product price" addonAfter="$" />
          </Item>

          <Item
            label="Category:"
            name="categoryIds"
            initialValue={categoryIds}
            rules={[
              { required: true, message: 'A product category must be selected' },
            ]}
          >
            <Cascader
              options={this.state.options}  //需要显示的列表数据数组
              loadData={this.loadData} //当选择某个列表项，
              placeholder="please select"
            />
          </Item>

          <Item label="Image">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>

          <Item label="商品详情" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} >
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Button type='primary' htmlType="submit">Submit</Button>
          </Item>
        </Form>
      </Card >
    )
  }
}