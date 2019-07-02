import React from "react";
import { connect } from "react-redux";
import { Button, Empty, Tabs } from "antd";
import { Link } from "react-router-dom";
import BookInfo from "./BookInfo";
import { AuthorInfo } from "./AuthorInfo";

import "./BookDetails.css";
import Reviews from "./Reviews";

const { TabPane } = Tabs;

const mapStateToProps = state => ({
  books: state.bookReducer.books,
  opened: state.loginReducer.opened,
  user: state.userReducer.user
});

const mapDispatchToProps = dispatch => ({});

class BookDetails extends React.Component {
  state = {
    book: {},
    status: "404",
    value: 0,
    author: {}
  };
  componentDidMount() {
    console.log(this.props);
    let book = this.props.books.find(
      book => book._id === this.props.match.params.id
    );
    book = book || this.getBookInformation(this.props.match.params.id);
    console.log(book);
    console.log(this.props.match.params.id);
    if (book && book.volumeInfo) {
      this.setState({ book, value: book.volumeInfo.averageRating });
      console.log(book);
      this.getAuthorInformation(book);
    }
  }

  getBookInformation = bookId => {
    let bookInfo = {};
    fetch(`http://localhost:4000/books/${bookId}`)
      .then(book => book.json())
      .then(book => {
        this.setState({ book });
        return book;
      })
      .catch(err => {
        console.log(err);
      });

    return bookInfo;
  };

  getAuthorInformation = book => {
    if (book && book.volumeInfo) {
      const authorName = book.volumeInfo.authors[0].split(" ").join("-");
      fetch(`http://localhost:4000/authors/${authorName}`, {
        method: "GET"
      })
        .then(author => author.json())
        .then(author => {
          console.log(author);
          this.setState({ author });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.books.length !== this.props.books.length) {
      const book = this.props.books.find(
        book => book._id === this.props.match.params.id
      );
      if (book) {
        this.setState({ book, value: book.volumeInfo.averageRating });
      }
    }
  }

  handleChange = value => {
    this.setState({ value });
    //todo update rating to book
  };

  render() {
    const { book, author } = this.state;
    return (
      <div>
        {book && book.volumeInfo ? (
          <div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Book Information" key="1">
                <div>
                  <BookInfo book={book} />
                </div>
              </TabPane>
              <TabPane tab="About Author" key="2">
                <AuthorInfo author={author} />
              </TabPane>
              <TabPane tab="Customer Reviews" key="3">
                <Reviews book={book} />
              </TabPane>
            </Tabs>
          </div>
        ) : (
          <Empty
            className="notFound"
            imageStyle={{
              height: 200,
              color: "black"
            }}
            image="http://www.cacpebiblian.fin.ec/images/404.png"
            description={
              <React.Fragment>
                <p>
                  <b>No book found</b>
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
)(BookDetails);
