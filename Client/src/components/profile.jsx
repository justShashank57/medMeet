import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "./bookingsTable";
export default async function Profile({user,setUser}){
    try{
        console.log("USER: ",user);
        const token = localStorage.getItem('jwt');
        const response = await fetch('http://localhost:5500/patient/profile',{
               method:"GET",
               headers:{
                  "Content-Type":"application/json",
                  "Authorization":`Bearer ${token}`
               }
        })
        if(response.ok){
             const resposeData = await response.json();
             console.log(resposeData);
        }
    }
    catch(err){
        console.log(err);
    }
    const navigate = useNavigate();
    function logout(){
        setUser(null);
        navigate("/");
        // alert("Logged out successfully!")
    }
    return (
        <div id="profileRoot">
            <div id="left">
               <img id="profileImg" src="pic1.png" />
               <h3>{user.token}, {user.token}.</h3>
               <p style={{marginTop:"0"}}>{user.token}</p>
               <p style={{marginTop:"0"}}>{user.token}</p>
               <div id="logOut" onClick={logout}>Logout</div>
            </div>

            <div id="right">
                <h2 style={{fontFamily:"'Manrope', sans-serif"}}>Welcome, our beloved <span id="welcome">{user.identity}</span></h2>
                <div id="bookingRoot">
                  <h4 style={{textAlign:"center"}}>My Bookings</h4>
                  <div id="bookings">
                    {
                        user.bookings && <Table arr={user.bookings}/>
                    }
                  </div>
                </div>
            </div>
        </div>
    )
}