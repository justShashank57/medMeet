import { createSlice } from "@reduxjs/toolkit"

const initialState = {
      value:null
}

export const userSlice = createSlice({
       name:'user',
       initialState,
       reducers:{
          changeUser:(state,action)=>{
                    state.value = action.payload;
          },
          deleteUser:(state)=>{
               state.value = null;
          }
       }
})

export const {changeUser,deleteUser} = userSlice.actions;
export default userSlice.reducer;