import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlice";
import identityReducer from "./slices/identitySlice";

export const store = configureStore({
       reducer:{
             user:userReducer,
             auth:authReducer,
             identity:identityReducer
       }
})