const initialState = {
    registrationOpened: false
  }
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "OPEN_REGISTRATION_DIALOG":
        return {
          ...state,
          registrationOpened: true
        };
      case "CLOSE_REGISTRATION_DIALOG":
        return {
          ...state,
          registrationOpened: false
        }
      default:
        return state;
    }
  };
  