import { createSlice } from "@reduxjs/toolkit"

// Holds only a boolean "is a session likely active" UI flag. The actual JWT
// lives in an httpOnly cookie set by the server and is never readable by
// client JS, so it is never persisted here.
const initialState = {
    value: localStorage.getItem('isLoggedIn') === 'true'
}

const authSlice = createSlice({
      name:'auth',
      initialState,
      reducers:{
          setLoggedIn:(state)=>{
               localStorage.setItem('isLoggedIn','true');
               state.value = true;
          },
          setLoggedOut:(state)=>{
               localStorage.removeItem('isLoggedIn');
               state.value = false;
          }
      }
})

export const {setLoggedIn,setLoggedOut} = authSlice.actions;
export default authSlice.reducer;
