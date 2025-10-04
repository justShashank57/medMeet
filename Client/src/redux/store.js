import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import tokenReducer from "./slices/tokenSlice";
import identityReducer from "./slices/identitySlice";

export const store = configureStore({
       reducer:{
             user:userReducer,
             token:tokenReducer,
             identity:identityReducer
       }
})