import React from "react";
import Navbar from "./components/Navbar";
import FakeRoot from "./FakeRoot";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import Doctors from "./Pages/Doctors";
import GetService from "./Pages/getService";
import Profile from "./components/profile";
import Completed from "./components/completed"
import { BrowserRouter as Router,Route, Routes } from "react-router-dom";
import { createContext } from "react";

export const UserContext = createContext(null);
export const setUserContext = createContext(null);

export default function App(){
      const[user,setUser] = React.useState(null);
     console.log("App component rendered with User :",user)
    return (
        <div>
               <Router>
                   <UserContext.Provider value={user}>
                   <setUserContext.Provider value={setUser}>

                   <Navbar user={user} setUser={setUser}/>
   
                   <Routes>
                      <Route exact path="/" element={<FakeRoot/>}/>
                      <Route exact path="/completed" element={<Completed/>}/>
                      <Route path="/login" element={<Login setUser={setUser}/>}/>
                      <Route path="/signUp" element={<SignUp/>}/>
                      <Route path="/doctors" element={<Doctors/>}/>
                      <Route path="/services" element={<GetService/>}/>
                      <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
                   </Routes>
                  </setUserContext.Provider>
                 </UserContext.Provider>
               </Router>  
        </div>
    )
}