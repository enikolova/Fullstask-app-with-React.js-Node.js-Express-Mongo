import React from "react";
import { Empty, Table, Button } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  user: state.userReducer.user
});

const mapDispatchToProps = dispatch => ({});

const data = [];
const columns = [];

class Cart extends React.Component {
  state = {
    cart: {}
  };
  componentDidMount() {
    if (this.props.user) {
      console.log(this.props.user.userId);
      this.getCartInfo(this.props.user.userId);
    }
  }

  getCartInfo(userId) {
    console.log(userId);
    fetch(`http://localhost:4000/carts/${userId}`)
      .then(cart => cart.json())
      .then(cart => {
        this.setState({ cart });
        console.log(cart);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        {data ? (
          <Table columns={columns} dataSource={data} />
        ) : (
          <Empty
            className="notFound"
            imageStyle={{
              height: 200,
              color: "black"
            }}
            image="https://png.pngtree.com/svg/20170913/bacb8f1c9c.svg"
            description={
              <React.Fragment>
                <p>
                  <b>Cart is Empty</b>
                </p>
                <Button>
                  <Link to="/"> Back Home</Link>
                </Button>
              </React.Fragment>
            }
          />
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
