import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import tokenReducer from "./slices/tokenSlice";

export const store = configureStore({
       reducer:{
             user:userReducer,
             token:tokenReducer
       }
})