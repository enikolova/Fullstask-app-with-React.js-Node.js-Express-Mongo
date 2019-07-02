import { combineReducers } from "redux";
import bookReducer from "./bookReducer";
import commentReducer from "./commentReducer";
import loginReducer from "./loginReducer";
import userReducer from "./userReducer";
import registrationReducer from "./registrationReducer";

export default combineReducers({
  bookReducer,
  commentReducer,
  loginReducer,
  userReducer,
  registrationReducer
});
