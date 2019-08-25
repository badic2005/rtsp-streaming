import {combineReducers} from "redux";
import urlReducer from './urlReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    url: urlReducer,
    error: errorReducer,
    auth: authReducer
})
