import React from "react";
import { Comment, Tooltip, Avatar } from "antd";
import moment from "moment";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  user: state.userReducer.user
});

const mapDispatchToProps = dispatch => ({});

class Reviews extends React.Component {
  state = {
    reviews: []
  };

  componentDidMount() {
    if (this.props.book) {
      console.log(this.props.book);
      this.getReviewsForBook(this.props.book._id);
    }
  }

  getReviewsForBook(bookId) {
    fetch(`http://localhost:4000/comments/${bookId}`)
      .then(reviews => reviews.json())
      .then(reviews => {
        console.log(reviews);
        this.setState({ reviews });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { reviews } = this.state;

    return reviews.map(review => (
      <Comment
        key={review._id}
        author={<a>{review.user.userName}</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="user"
          />
        }
        content={<p>{review.comment}</p>}
        datetime={
          <Tooltip title={moment(review.date).format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment("review.date").fromNow()}</span>
          </Tooltip>
        }
      />
    ));
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reviews);
