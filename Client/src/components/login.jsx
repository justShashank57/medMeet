import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { updateToken,deleteToken } from "../redux/slices/tokenSlice";
import { updateUserIdentity } from "../redux/slices/identitySlice";
import { useAuth } from "../hooks/useAPI";
import { InlineSpinner } from "./LoadingSpinner";
import api from "../services/webcalls";

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const identity = useSelector((state)=>state.identity.value);
    const { login, loading } = useAuth();
    
    async function handleLogin(event){
          event.preventDefault();
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const loginIdentity = document.getElementById("loginIdentity").value;
          
          const credentials = {email: email, password: password};
          
          const apiCall = loginIdentity === "Doctor" 
            ? () => api.auth.doctorLogin(credentials)
            : () => api.auth.patientLogin(credentials);
          
          const responseData = await login(apiCall);
          
          if (responseData) {
            const token = responseData.token;
            dispatch(updateToken(token));
            dispatch(updateUserIdentity(loginIdentity));
            console.log("User logged in");
            navigate("/");
          }
    }
    return(
        <div id="loginRoot">
            <form id="loginForm" action="/loginForm" method="post">
                <h3 id="hello">Hello! <span id="welcome">Welcome</span> back.</h3>
                <input type="text" id="email" name="email" placeholder="Email"/>
                <input type="password" id="password" name="password" placeholder="Password"/>
                
                <select name="loginIdentity" id="loginIdentity" style={{margin: "10px 0", padding: "10px", borderRadius: "5px"}}>
                    <option value="Patient">Login as Patient</option>
                    <option value="Doctor">Login as Doctor</option>
                </select>
                
                <button type="submit" onClick={handleLogin} id="submitLogin" disabled={loading}>
                  {loading ? (
                    <>
                      <InlineSpinner size="small" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
               <p id="createAccount">Don't have any account? <Link to="/signUp" id="register">Register</Link></p>
            </form>
        </div>
    )
}