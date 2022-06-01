import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import allReq from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';


export default class PicturesWall extends Component {

    static propTypes = {
        imgs: PropTypes.array
    }
    state = {
        previewVisible: false, //标识是否显示大图预览
        previewImage: '', //大图的url
        previewTitle: '',
        fileList: [],
    };


    constructor(props) {
        super(props)

        let fileList = []
        //如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList //所有已上传图片的数组
        }
    }

    //获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        //显示指定file对应的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    //file 当前操作的图片文件（上传/删除）
    //fileList 所有已上传图片文件对象的数组

    handleChange = async ({ file, fileList }) => {
        // console.log('handlechange()', file, fileList)

        //一旦上传成功，将当前上传的file的信息修正（name，url）
        if (file.status === 'done') {
            const result = file.response //{status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            console.log(result.status)
            if (result.status === 0) {
                message.success('Image upload successfully！')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('Failed to upload image')
            }
        } else if (file.status === 'removed') {
            //删除图片
            const result = await allReq.reqDeleteImg(file.name)
            console.log(result.status)
            if (result.status === 200) {
                message.success('Successfully deleted！')
            } else {
                message.error('Failed to delete image')
            }
        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload" //上传图片的接口地址
                    accept='image/*' //只接受图片格式
                    name='image' //请求参数名字
                    listType="picture-card"//卡片样式
                    fileList={fileList} //所有已上传图片文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}

/* 子组件调用父组件的方法:将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用
父组件调用子组件的方法 :在父组件忠通过ref得到子组件标签对象(组件对象),调用其方法*/



