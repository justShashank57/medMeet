import React from "react";
import { useNavigate } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux"
import Table from "./bookingsTable";
import { changeUser, deleteUser } from "../redux/slices/userSlice";
import { deleteToken } from "../redux/slices/tokenSlice";
export default function Profile(){
    const user = useSelector((state)=>state.user);
    // console.log("User from selector",user);
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.token.value);

    React.useEffect(()=>{
            // console.log("USER UPDATED: ", user.value)
              console.log("User doesnt exists.")
              async function fetchProfile(){
                try{
                    // console.log("USER from profile: ",user);
                    const response = await fetch('https://medmeet-1.onrender.com/patient/profile',{
                           method:"GET",
                           headers:{
                              "Content-Type":"application/json",
                              "Authorization":`Bearer ${token}`
                           }
                    })
                    if(response.ok){
                         const resposeData = await response.json();
                         dispatch(changeUser(resposeData));
                         console.log(resposeData);
                    }
                }
                catch(err){
                    console.log(err);
                }
            }
            if(!user.value) fetchProfile();
        },[user])
    const navigate = useNavigate();

    function logout(){
        dispatch(deleteUser());
        dispatch(deleteToken());
        navigate("/");
        alert("Logged out successfully!")
    }
    return (
        <div id="profileRoot">
            <div id="left">
               <img id="profileImg" src="pic1.png" />
               <h3>{user.value && user.value.name}, {user.value && user.value.age}.</h3>
               <p style={{marginTop:"0"}}>{user.value && user.value.email}</p>
               <p style={{marginTop:"0"}}>{user.value && user.value.phone}</p>
               <div id="logOut" onClick={logout}>Logout</div>
            </div>

            <div id="right">
                {/* <h2 style={{fontFamily:"'Manrope', sans-serif"}}>Welcome, our beloved <span id="welcome">{user.value.name}</span></h2> */}
                <div id="bookingRoot">
                  <h4 style={{textAlign:"center"}}>My Bookings</h4>
                  <div id="bookings">
                    {/* {
                        user.value.name && <Table arr={user.value.name}/>
                    } */}
                  </div>
                </div>
            </div>
        </div>
    )
}