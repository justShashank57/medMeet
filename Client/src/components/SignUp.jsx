import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "../redux/slices/authSlice";
import { updateUserIdentity } from "../redux/slices/identitySlice";
import { useAuth } from "../hooks/useAPI";
import { InlineSpinner } from "./LoadingSpinner";
import { useToast } from "./Toast";
import api from "../services/webcalls";

export default function SignUp(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { signup, loading } = useAuth();
    const { addToast } = useToast();
    
    async function handleSubmit(event){
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const identity = document.getElementById("identity").value;
        const gender = document.getElementById("gender").value;
        
        if (!name || !email || !phone || !password || !identity || !gender) {
          addToast({
            message: "Please fill all the required fields.",
            type: "warning"
          });
          return;
        }

        const formData = {
          name: name,
          email: email,
          password: password,
          phone: phone,
          gender: gender
        };
        
        const apiCall = identity === "Doctor" 
          ? () => api.auth.doctorSignup(formData)
          : () => api.auth.patientSignup(formData);
        
        const responseData = await signup(apiCall, identity);
        
        if (responseData) {
          dispatch(setLoggedIn());
          dispatch(updateUserIdentity(identity));
          navigate("/completed");
        }
      };

    return (
        <div id="signUpRoot">
            <img src="signUp.jpg" alt="signUp" id="signUpImg"/>
            <form action="/submit_form" onSubmit={handleSubmit} id="signUpForm" method="post" aria-label="Sign up form">
                <h3 id="hello">Create an <span id="welcome">Account</span></h3>
                <label htmlFor="name" className="sr-only">Name</label>
                <input type="text" name="name" id="name" placeholder="Name" aria-label="Name"/>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" aria-label="Email"/>
                <label htmlFor="phone" className="sr-only">Phone number</label>
                <input type="text" name="phone" id="phone" placeholder="Phone No." aria-label="Phone number"/>
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" name="password" id="password" placeholder="Password" aria-label="Password"/>

                <span id="select">

                    <span className="options" style={{display:"flex"}}>
                          <label htmlFor="identity">Are you a:</label>
                          <select name="identity" className="identity" id="identity">
                              <option value="Patient">Patient</option>
                              <option value="Doctor">Doctor</option>
                          </select>
                    </span>

                   <span className="options" style={{display:"flex"}}>
                             <label htmlFor="gender">Gender:</label>
                             <select name="gender" className="gender" id="gender">
                               <option value="Male">Male</option>
                               <option value="Female">Female</option>
                             </select>
                   </span>

                </span>

                <button type="submit" id="submitSignUp" disabled={loading} aria-busy={loading}>
                  {loading ? (
                    <>
                      <InlineSpinner size="small" />
                      Registering...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <p id="createAccount">Already have an Account? <Link to="/login" id="register">Login</Link></p>
            </form>
        </div>
    )
}