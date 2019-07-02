const initialState = {
    opened: false
  }
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "OPEN_LOGIN_DIALOG":
        return {
          ...state,
          opened: true
        };
      case "CLOSE_LOGIN_DIALOG":
        return {
          ...state,
          opened: false
        }
      default:
        return state;
    }
  };
  