import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    value:localStorage.getItem('jwt')
}

const tokenSlice = createSlice({
      name:'token',
      initialState,
      reducers:{
          updateToken:(state,action)=>{
               localStorage.setItem('jwt',action.payload);
               state.value = action.payload;
          },
          deleteToken:(state)=>{
               localStorage.setItem('jwt',"");
               state.value = ""
          }
      }
})

export const {updateToken,deleteToken} = tokenSlice.actions;
export default tokenSlice.reducer;