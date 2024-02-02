import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Login(props){
    const navigate = useNavigate();
    function handleLogin(event){
          event.preventDefault();
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          fetch("http://localhost:5500/loginForm",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({email:email,password:password})
          })
          .then((res)=>{
            console.log("RESPONSE: ",res);
            return res.json()
          })
          .then(result=>{
            props.setUser(result.user);
            console.log("user logged in")
            alert(result.message)
            navigate("/");
          })
          .catch((error)=>{
            console.log("Error: ",error)
          });
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