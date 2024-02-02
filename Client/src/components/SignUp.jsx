import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function SignUp(){

    const navigate = useNavigate();
    async function handleSubmit(event){
        event.preventDefault();
        
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const age = document.getElementById("age").value;
        const password = document.getElementById("password").value;
        const identity = document.getElementById("identity").value;
        const gender = document.getElementById("gender").value;
        
        if (name && email && age && password && identity && gender) {
          
          const formData = {
            name: name,
            email: email,
            age: age,
            password: password,
            identity: identity,
            gender: gender,
          };
          

          try {
            const response = await fetch("http://localhost:5500/submit_form", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            if(response.ok){
              navigate("/completed")
              console.log(response);
            }
            else if(!response.ok) {
              throw new Error("Network response was not ok");
            }
          
  
          } catch (error) {
            console.error("Error fetching data:", error);
          }

        } else {
          alert("Please fill all the required fields.");
        }
      };

    return (
        <div id="signUpRoot">
            <img src="signUp.jpg" alt="signUp" id="signUpImg"/>
            <form action="/submit_form" onSubmit={handleSubmit} id="signUpForm" method="post">
                <h3 id="hello">Create an <span id="welcome">Account</span></h3>
                <input type="text" name="name" id="name" placeholder="Name"/>
                <input type="text" name="email" id="email" placeholder="Email"/>
                <input type="number" name="age" id="age" placeholder="Age"/>
                <input type="password" name="password" id="password" placeholder="Password"/>
                
                <span id="select">
                   
                    <span className="options" style={{display:"flex"}}>Are you a:
                          <select name="identity" className="identity" id="identity">
                              <option value="Patient">Patient</option>
                              <option value="Doctor">Doctor</option>
                          </select>
                    </span> 
                    
                   <span className="options" style={{display:"flex"}}>Gender:
                             <select name="gender" className="gender" id="gender">
                               <option value="Male">Male</option>
                               <option value="Female">Female</option>
                             </select>
                   </span> 
    
                </span> 
                
                <button type="submit" id="submitSignUp">Submit</button>
                <p id="createAccount">Already have an Account? <Link to="/login" id="register">Login</Link></p>
            </form>
        </div>
    )
}