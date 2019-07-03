import React from "react";
import { Form, Input, Checkbox, Button, Modal, message } from "antd";
import { connect } from "react-redux";

import { closeRegistrationDialog } from "../actions/registrationAction";

const mapStateToProps = state => ({
  opened: state.registrationReducer.opened
});

const mapDispatchToProps = dispatch => ({
  closeRegistrationModal: () => dispatch(closeRegistrationDialog())
});

export class Registration extends React.Component {
  state = {
    visible: false
  };

  componentDidMount() {
    const { opened } = this.props;

    this.setState({ visible: opened });
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible) {
      this.setState({ visible });
    }
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        fetch("http://localhost:4000/users/register", {
          method: "POST",
          body: JSON.stringify(values)
        })
          .then(result => {
            console.log(result);
            this.props.closeRegistrationModal();
            message.success(
              "Successful registration! Please check your email!"
            );
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value.length >= 6 && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal title="Register" visible={this.state.visible} footer={null}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="E-mail">
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="First name">
              {getFieldDecorator("firstName")(<Input />)}
            </Form.Item>
            <Form.Item label="Last name">
              {getFieldDecorator("lastName")(<Input />)}
            </Form.Item>
            <Form.Item label="Password" hasFeedback>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!"
                  },
                  {
                    validator: this.validateToNextPassword
                  }
                ]
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="Confirm Password" hasFeedback>
              {getFieldDecorator("repeatPassword", {
                rules: [
                  {
                    required: true,
                    message: "Please confirm your password!"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(<Input.Password onBlur={this.handleConfirmBlur} />)}
            </Form.Item>
            <Form.Item label={<span>UserName&nbsp;</span>}>
              {getFieldDecorator("userName", {
                rules: [
                  {
                    required: true,
                    message: "Please input your username!",
                    whitespace: false
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              {getFieldDecorator("agreement", {
                valuePropName: "checked"
              })(
                <Checkbox>
                  I have read the <a href="#">agreement</a>
                </Checkbox>
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedRegistration = Form.create({ name: "register" })(Registration);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedRegistration);
