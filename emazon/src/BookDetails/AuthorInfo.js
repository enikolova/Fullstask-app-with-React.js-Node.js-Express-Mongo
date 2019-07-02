import React from "react";

import "./AuthorInfo.css";

export function AuthorInfo({ author }) {
  return (
    <div className="author-information">
      <div>
        {author.imageUrl ? (
          <img src={author.imageUrl} alt="author" />
        ) : (
          <img src="../image/notFoundBook.png" alt="author" />
        )}
      </div>
      <div className='author-infomation'>
        <h2>{author.name}</h2>
        <hr />
        <div>{author.description}</div>
      </div>
    </div>
  );
}
