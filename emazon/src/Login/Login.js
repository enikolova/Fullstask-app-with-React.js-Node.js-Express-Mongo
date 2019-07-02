import React from "react";
import { Input, Icon, Modal, Button, Form, message } from "antd";
import { connect } from "react-redux";
import { closeLoginDialog } from "../actions/loginAction";
import { addUser } from "../actions/userAction";

const mapStateToProps = state => ({
  opened: state.loginReducer.opened,
  user: state.userReducer.user
});

const mapDispatchToProps = dispatch => ({
  closeLoginModal: () => dispatch(closeLoginDialog()),
  addUser: user => dispatch(addUser(user))
});

class Login extends React.Component {
  state = {
    visible: false,
    loading: false
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

  handleOk = () => {
    this.setState({ loading: true });

    // const { email, password } = this.state;
  };

  handleCancel = () => {
    this.setState({ visible: false });
    this.props.closeLoginModal();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        console.log(values.password);
        console.log(values.email);
        fetch("http://localhost:4000/users", {
          method: "POST",
          body: JSON.stringify(values)
        })
          .then(user => user.json())
          .then(user => {
            console.log(user);
            this.setState({ loading: false });
            this.props.addUser(user);
            sessionStorage.setItem("user", JSON.stringify(user));
            this.props.closeLoginModal();
            message.success("Successful login!");
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, loading } = this.state;
    return (
      <Modal
        visible={visible}
        title="Login"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={this.handleSubmit}
          >
            Login
          </Button>
        ]}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("email", {
              rules: [{ required: true, message: "Please input your email!" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            You don't have account yet.
            <div>register now!</div>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const WrappedLoginForm = Form.create({ name: "login" })(Login);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedLoginForm);
