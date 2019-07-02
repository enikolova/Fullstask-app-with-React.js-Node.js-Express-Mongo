import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Rate, Button, message } from "antd";

import "./BookInfo.css";

const { Meta } = Card;

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const mapStateToProps = state => ({
  user: state.userReducer.user
});

const mapDispatchToProps = dispatch => ({});

class BookInfo extends React.Component {
  state = {
    rating: 0,
    book: {}
  };

  componentDidMount() {
    this.setState({
      rating: this.props.book.volumeInfo.averageRating,
      book: this.props.book
    });
  }

  handleChange = value => {
    console.log(value);
  };

  componentDidUpdate(prevProps) {
    if (this.props.book && prevProps.book) {
      if (
        this.props.book.volumeInfo.averageRating !==
        prevProps.book.volumeInfo.averageRating
      ) {
        this.setState({ rating: this.props.book.volumeInfo.averageRating });
      }
      // this.setState({ book: this.props.book });
    }
  }

  addBookToCart = () => {
    const book = this.state.book || this.props.book;
    fetch(`http://localhost:4000/carts/${this.props.user.userId}`, {
      method: "POST",
      body: JSON.stringify({ book })
    })
      .then(result => result.json())
      .then(res => {
        console.log(res);
        message.success("You successfully added this book to your cart!");
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { rating } = this.state;
    const book = this.state.book || this.props.book;

    console.log(book);
    return (
      <div className="book-information">
        <div>
          <Card
            hoverable
            style={{ width: 300 }}
            cover={
              book &&
              book.volumeInfo &&
              book.volumeInfo.imageLinks &&
              book.volumeInfo.imageLinks.thumbnail ? (
                <img alt="example" src={book.volumeInfo.imageLinks.thumbnail} />
              ) : (
                <img alt="example" src="../image/notFoundBookImage.png" />
              )
            }
          >
            <Meta
              title={book.volumeInfo ? book.volumeInfo.title : ""}
              description={
                <div>
                  {book.volumeInfo && book.volumeInfo.subtitle
                    ? book.volumeInfo.subtitle
                    : ""}
                  <span>
                    <Rate
                      tooltips={desc}
                      onChange={value => this.handleChange(value)}
                      value={rating}
                    />
                    {rating ? (
                      <span className="ant-rate-text">{desc[rating - 1]}</span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              }
            />
          </Card>
        </div>
        <div className="book-description">
          by{" "}
          <Link to="/">
            {book && book.volumeInfo ? book.volumeInfo.authors.join("") : ""}
          </Link>
          <br />
          <br />
          <br />
          <Button
            type="default"
            shape="round"
            icon="plus"
            size="default"
            disabled={
              !this.props.user ||
              (this.props && this.props.user.type === "admin")
            }
            onClick={() => {
              this.addBookToCart();
            }}
          >
            Buy now -
            {book && book.saleInfo && book.saleInfo.retailPrice
              ? book.saleInfo.retailPrice.amount + "$"
              : ""}
          </Button>{" "}
          <Button
            type="default"
            shape="round"
            icon="heart"
            size="default"
            disabled={
              !this.props.user ||
              (this.props.user && this.props.user.type === "admin")
            }
          >
            Add to wishlist
          </Button>
          <br />
          <br />
          <br />
          <b>Overview</b>
          <hr />
          <div>
            {book && book.volumeInfo ? book.volumeInfo.description : ""}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookInfo);
