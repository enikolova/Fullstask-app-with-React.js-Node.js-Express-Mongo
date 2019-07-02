import React, { Component } from "react";
import { Route, withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import "./App.css";
import { Layout, Menu, Icon, Input } from "antd";
import BookList from "./BookList/BookList";
import BookDetails from "./BookDetails/BookDetails";
import WrappedLoginForm from "./Login/Login";
import  WrappedRegistration  from "./Registration/Registration";
import { UserProfile } from "./UserProfile/UserProfile";
import Cart from "./Cart/Cart";
import { Settings } from "./Settings/Settings";
import { openLoginDialog } from "./actions/loginAction";
import { removeUser, addUser } from "./actions/userAction";
import { openRegistrationDialog } from "./actions/registrationAction";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const mapStateToProps = state => ({
  books: state.bookReducer.books,
  opened: state.loginReducer.opened,
  user: state.userReducer.user,
  registrationOpened: state.registrationReducer.registrationOpened
});

const mapDispatchToProps = dispatch => ({
  openLoginModal: () => dispatch(openLoginDialog()),
  openRegistrationModal: () => dispatch(openRegistrationDialog()),
  removeUser: () => dispatch(removeUser()),
  addUser: user => dispatch(addUser(user))
});

class App extends Component {
  state = {
    collapsed: false,
    isLoginModalVisible: false
  };

  componentDidMount() {
    this.getUserSession();
  }

  getUserSession() {
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
      console.log(userSession);
      this.setState(JSON.parse(userSession));
      this.props.addUser(JSON.parse(userSession));
    }
  }

  openLoginModal = isLoginModalVisible => {
    this.props.openLoginModal();
    this.setState({ isLoginModalVisible: this.props.opened });
  };

  openRegisterModal = isLoginModalVisible => {
    this.props.openRegistrationModal();
    this.setState({ isLoginModalVisible: this.props.registrationOpened });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleLogout = () => {
    console.log(this.props.user);
    fetch("http://localhost:4000/users/profile/logout", {
      method: "POST"
    })
      .then(() => {
        this.props.removeUser();
        sessionStorage.setItem("user", "");
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          className="page-sider"
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          {!this.state.collapsed ? (
            <img
              alt="logo"
              src="https://raw.githubusercontent.com/enikolova/finalProject/master/public/img/logo3.png"
              width="170"
              style={{ padding: "5px 0 0 30px" }}
            />
          ) : (
            ""
          )}
          <div className="search-box">
            {!this.state.collapsed ? (
              <Search
                placeholder="Search for books..."
                enterButton
                onSearch={value => console.log(value)}
              />
            ) : (
              ""
            )}
          </div>
          <Menu
            className="page-sider"
            defaultSelectedKeys={["1"]}
            mode="inline"
          >
            <Menu.Item key="1" className="page-sider">
              <Icon type="read" />
              <span>Books</span>
              <Link to="/" />
            </Menu.Item>
            {this.props.user && this.props.user.type === "admin" ? (
              <Menu.Item key="2" className="page-sider">
                <Icon type="inbox" />
                <span>Admin Console</span>
                <Link to="/adminConsole" />
              </Menu.Item>
            ) : (
              ""
            )}
            {this.props.user && this.props.user.type === "user" ? (
              <SubMenu
                className="page-sider"
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    <span>User Profile</span>
                  </span>
                }
              >
                <Menu.Item key="3" className="page-sider">
                  Profile
                  <Link to="/userProfile" />
                </Menu.Item>
                <Menu.Item key="4" className="page-sider">
                  Cart
                  <Link to="/cart" />
                </Menu.Item>
                <Menu.Item key="5" className="page-sider">
                  Settings
                  <Link to="/settings" />
                </Menu.Item>
              </SubMenu>
            ) : (
              ""
            )}
            {!this.props.user ? (
              <Menu.Item key="6" onClick={() => this.openLoginModal(true)}>
                <Icon type="login" />
                <span>Log in</span>
              </Menu.Item>
            ) : (
              ""
            )}
            {!this.props.user ? (
              <Menu.Item key="7" onClick={() => this.openRegisterModal(true)}>
                <Icon type="user-add" />
                <span>Registration</span>
              </Menu.Item>
            ) : (
              ""
            )}
            {this.props.user ? (
              <Menu.Item key="8" onClick={() => this.handleLogout()}>
                <Icon type="logout" />
                <span>Log out</span>
              </Menu.Item>
            ) : (
              ""
            )}
          </Menu>
        </Sider>

        <Layout className="page-layout">
          <Content style={{ margin: "30px 16px" }}>
            <div className="page-content">
              <div>
                <Route path="/" component={BookList} exact={true} />
                <Route path="/books/:id" component={BookDetails} exact={true} />
                <Route
                  path="/userProfile"
                  component={UserProfile}
                  exact={true}
                />
                <Route path="/settings" component={Settings} exact={true} />
                <Route path="/cart" component={Cart} exact={true} />
              </div>
              <WrappedLoginForm visible={this.props.opened} />
              <WrappedRegistration visible={this.props.registrationOpened} />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
