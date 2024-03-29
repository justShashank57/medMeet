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
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function App(){
    return (
        <Provider store={store}>
        <div>
               <Router>
                   <Navbar/>
                   <Routes>
                      <Route exact path="/" element={<FakeRoot/>}/>
                      <Route exact path="/completed" element={<Completed/>}/>
                      <Route path="/login" element={<Login/>}/>
                      <Route path="/signUp" element={<SignUp/>}/>
                      <Route path="/doctors" element={<Doctors/>}/>
                      <Route path="/services" element={<GetService/>}/>
                      <Route path="/profile" element={<Profile/>}/>
                   </Routes>
               </Router>  
        </div>
        </Provider>
    )
}