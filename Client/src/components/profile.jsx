import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "./bookingsTable";
export default function Profile({user,setUser}){
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
               <h3>{user.name}, {user.age}.</h3>
               <p style={{marginTop:"0"}}>{user.gender}</p>
               <p style={{marginTop:"0"}}>{user.email}</p>
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