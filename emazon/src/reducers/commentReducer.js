const initialState = {
    comments: []
  }
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "ADD_COMMENTS_LIST":
        return {
          ...state,
          comments: action.payload.slice()
        }
      default:
        return state;
    }
  };
  