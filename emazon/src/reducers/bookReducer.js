const initialState = {
  books: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_BOOK_LIST":
      return {
        ...state,
        books: action.payload.slice()
      }
    default:
      return state;
  }
};
