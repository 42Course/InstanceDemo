import React, { Component } from 'react'
import { Button, Modal, Form, Input, Radio, Upload, Icon, message} from 'antd';
import moment from 'moment';
import FileReaderInput from 'react-file-reader-input';
import ipfsUpload from '../utils/ipfsFile';


const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
          fileList: [],
          uploading: false,
          photo: ""
        };

      this.handleCreate = this.handleCreate.bind(this);
    }

    getCurTime(){

      return moment().format('YYYY年MM月DD日, HH:mm分 ');
    }

    handleChange = (e, results) => {
      results.forEach(result => {
        const [e, file] = result;
        this.uploadFile(e.target.result);
        console.log(`Successfully uploaded ${file.name}!`);
      });
    }

    uploadFile(buf) {

      ipfsUpload.add(buf).then(hash => {
          console.log(JSON.stringify(hash));

          this.setState({ hash });
      });

    }

    hideModal() {
      this.setState({
        visible: false,
      });
    }

    handleCreate(e) {
      e.preventDefault();
      const {form, here, account} = this.props;
      const {photo} = this.state;
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          here._createPlace(values.content, values.to, photo, values.location, account,{from:account})
            .then(res => {
              console.log(res);
              this.hideModal();
            })
            .catch(err => {
              console.log(err);
            })
        }
      });

    }

    render() {
      const { visible, onCancel, form } = this.props;
      const { hash } = this.state;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };

      var that = this;

      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={this.handleCreate}
        >
          <Form layout="vertical">
            <FormItem label={this.getCurTime()}>
              {getFieldDecorator('content', {
                rules: [{ required: true, message: '记录点什么吧' }],
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="给某人">
              {getFieldDecorator('to', {
                rules: [{ required: true, message: '给谁呢 ？' }],
              })(
                <Input />
              )}
            </FormItem>

            <FormItem label="定位">
              {getFieldDecorator('location', {
                rules: [{ required: true, message: '在哪呢 ？' }],
              })(
                <Input />
              )}
            </FormItem>

            <FormItem className="collection-create-form_last-form-item">
              {getFieldDecorator('modifier', {
                initialValue: 'public',
              })(
                <Radio.Group>
                  <Radio value="public">Public</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Form>

          <FormItem>

            <FileReaderInput as="buffer" id="my-file-input"
                             onChange={this.handleChange}>
              <button>上传一个照片吧 !</button>
              <br />
              <text name="url" >{hash}</text>
            </FileReaderInput>
          </FormItem>

        </Modal>
      );
    }


  }
);

class NewPlaceDialog extends React.Component {
  componentWillReceiveProps(nextProps){

      if (nextProps.show) {
        this.showModal();
      }else{
        this.handleCancel();
      }
      
  }
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  render() {
    return (
      <div>

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          here = {this.props.here}
          account = {this.props.account}
        />
      </div>
    );
  }
}

export default NewPlaceDialog