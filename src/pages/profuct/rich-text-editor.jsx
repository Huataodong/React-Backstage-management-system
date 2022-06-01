import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PropTypes from "prop-types";
//用来指定商品详情的副文本编辑器
export default class RichTextEditor extends Component {

    //接受属性from add-updata const { pCategoryId, categoryId, imgs, detail } = product
    static propTypes = {
        detail: PropTypes.string
    }
    state = {
        editorState: EditorState.createEmpty(), //创建了一个没有内容的编辑对象
    }

    static propTypes = {
        detail: PropTypes.string,
    };

    state = {
        editorState: EditorState.createEmpty(), //创建了空的编辑对象
    };

    constructor(props) {
        super(props);
        const { detail } = this.props;
        let contentBlock;
        if (!detail) {
            contentBlock = htmlToDraft("");
        } else {
            contentBlock = htmlToDraft(detail);
        }

        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }
    }

    uploadImageCallBack = (file) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "manage/img/upload");
            const data = new FormData();
            data.append("image", file);
            xhr.send(data);
            xhr.addEventListener("load", () => {
                const response = JSON.parse(xhr.responseText);
                const url = response.data.url; //图片地址
                // url = url.replace("localhost", "120.55.193.14"); //替换本地地址成服务器地址
                resolve({ data: { link: url } });
            });
            xhr.addEventListener("error", () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        });
    }

    //输入过程中实时的回调
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //返回输入数据对应的html格式文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
                onEditorStateChange={this.onEditorStateChange} //绑定监听

                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: {
                        uploadCallback: this.uploadImageCallBack,
                        alt: { present: true, mandatory: true },
                    },
                }}
            />
        );
    }
}