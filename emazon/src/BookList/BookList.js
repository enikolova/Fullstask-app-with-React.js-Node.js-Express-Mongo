import React from "react";
import { Link } from "react-router-dom";
import { List, Avatar, Icon, Button } from "antd";
import { connect } from "react-redux";
import { addBookList } from "../actions/bookAction";
import { addCommentList } from "../actions/commentAction";

const ascIcon = "sort-ascending";
const descIcon = "sort-descending";

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
const mapStateToProps = state => ({
  books: state.bookReducer.books,
  comments: state.commentReducer.comments
});

const mapDispatchToProps = dispatch => ({
  bookListDispatch: booksList => dispatch(addBookList(booksList)),
  commentListDispatch: commentList => dispatch(addCommentList(commentList))
});

class BookList extends React.Component {
  state = {
    books: [],
    comments: [],
    priceIcon: ascIcon,
    ratingIcon: ascIcon,
    priceSorting: "asc",
    ratingSorting: "asc"
  };

  getComments() {
    fetch("http://localhost:4000/comments")
      .then(comments => {
        return comments.json();
      })
      .then(commentList => {
        this.setState({ comments: commentList });
        this.props.commentListDispatch(commentList);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getBooks() {
    fetch("http://localhost:4000/books")
      .then(books => {
        return books.json();
      })
      .then(bookslist => {
        this.setState({ books: bookslist });
        this.props.bookListDispatch(bookslist);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getNumberOfCommentsForBook = bookId => {
    const findCommentsForBook = this.state.comments.filter(
      comment => comment.bookId === bookId
    );

    return findCommentsForBook.length;
  };

  onSort(type, way) {
    let { books } = this.state;
    if (way === "asc") {
      if (type === "rating") {
        console.log(1);
        books = books.sort((a, b) => {
          if (a.volumeInfo.averageRating > b.volumeInfo.averageRating) {
            return 1;
          }

          if (a.volumeInfo.averageRating < b.volumeInfo.averageRating) {
            return -1;
          }
          return 0;
        });
        this.setState({ ratingIcon: descIcon, ratingSorting: "desc" });
      } else {
        console.log(2);
        books = books.sort((a, b) => {
          if (a.saleInfo.retailPrice.amount > b.saleInfo.retailPrice.amount) {
            return 1;
          }

          if (a.saleInfo.retailPrice.amount < b.saleInfo.retailPrice.amount) {
            return -1;
          }
          return 0;
        });
        this.setState({ priceSorting: "desc", priceIcon: descIcon });
      }

      this.setState({ books });
    } else {
      if (type === "rating") {
        console.log(3);
        books = books.sort((a, b) => {
          if (a.volumeInfo.averageRating < b.volumeInfo.averageRating) {
            return 1;
          }

          if (a.volumeInfo.averageRating > b.volumeInfo.averageRating) {
            return -1;
          }
          return 0;
        });
        this.setState({ ratingSorting: "asc", ratingIcon: ascIcon });
      } else {
        console.log(4);
        books = books.sort((a, b) => {
          if (a.saleInfo.retailPrice.amount < b.saleInfo.retailPrice.amount) {
            return 1;
          }

          if (a.saleInfo.retailPrice.amount > b.saleInfo.retailPrice.amount) {
            return -1;
          }
          return 0;
        });
        this.setState({ priceSorting: "asc", priceIcon: ascIcon });
      }

      this.setState({ books });
    }
    console.log(this.state.priceIcon);
    console.log(this.state.ratingIcon);
  }

  componentDidMount() {
    this.getBooks();
    this.getComments();
  }

  render() {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>
            Books in <b>Emazon</b>
          </h2>
          <div>
            <Button
              type="default"
              shape="round"
              icon={this.state.priceIcon}
              onClick={() => {
                this.onSort("price", this.state.priceSorting);
              }}
            >
              By Price
            </Button>
            <Button
              type="default"
              shape="round"
              icon={this.state.ratingIcon}
              onClick={() => {
                this.onSort("rating", this.state.ratingSorting);
              }}
            >
              By Rating
            </Button>
          </div>
        </div>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
              console.log(this.props.comments);
            },
            pageSize: 5
          }}
          dataSource={this.state.books}
          renderItem={item => (
            <List.Item
              key={item.volumeInfo.title}
              actions={[
                <IconText
                  type="star-o"
                  text={item.volumeInfo.averageRating + "/5"}
                />,
                <IconText
                  type="message"
                  text={this.getNumberOfCommentsForBook(item._id)}
                />,
                <IconText
                  type="dollar"
                  text={item.saleInfo.retailPrice.amount}
                />
              ]}
              extra={
                <img
                  width={150}
                  alt="logo"
                  src={item.volumeInfo.imageLinks.thumbnail}
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.volumeInfo.imageLinks.thumbnail} />}
                title={<a href={item.href}>{item.volumeInfo.title}</a>}
                description={
                  item.searchInfo.textSnippet || item.volumeInfo.description
                }
              />
              <Link to={`/books/${item._id}`}> Read more...</Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookList);
