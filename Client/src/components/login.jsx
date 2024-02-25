import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import { updateToken,deleteToken } from "../redux/slices/tokenSlice";

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function handleLogin(event){
          event.preventDefault();
          try{
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const response = await fetch("http://localhost:5500/patient/login",{
              method:"post",
              headers:{
                  "Content-Type":"application/json",
              },
              body:JSON.stringify({email:email,password:password})
            })
            if(response.ok){
               const responseData = await response.json();
            //    console.log("From Login: ",responseData);

               const token = responseData.token;
               dispatch(updateToken(token));
               console.log("User logged in")
               alert("User Logged in.")
               navigate("/");
              }
              else if(!response.ok){
                 const responseData = await response.json();
                 console.log(responseData)
            }
          }
          catch(err){
               console.log("Error while Fetching Data: ",err);
          }
    }
    return(
        <div id="loginRoot">
            <form id="loginForm" action="/loginForm" method="post">
                <h3 id="hello">Hello! <span id="welcome">Welcome</span> back.</h3>
                <input type="text" id="email" name="email" placeholder="Email"/>
                <input type="password" id="password" name="password" placeholder="Password"/>
                <button type="submit" onClick={handleLogin} id="submitLogin">Login</button>
               <p id="createAccount">Don't have any account? <Link to="/signUp" id="register">Register</Link></p>
            </form>
        </div>
    )
}