import React from "react";
import { useNavigate } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux"
import Table from "./bookingsTable";
import { changeUser, deleteUser } from "../redux/slices/userSlice";
import { setLoggedOut } from "../redux/slices/authSlice";
import { clearUserIdentity } from "../redux/slices/identitySlice";
import { useProfile, useAppointments } from "../hooks/useAPI";
import { LoadingSpinner } from "./LoadingSpinner";
import { useToast } from "./Toast";
import api from "../services/webcalls";
export default function Profile(){
    const user = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state)=>state.auth.value);
    const identity = useSelector((state)=>state.identity.value);
    const [appointments, setAppointments] = React.useState([]);
    const { fetchProfile: getProfile, loading: profileLoading } = useProfile();
    const { fetchAppointments: getAppointments, loading: appointmentsLoading } = useAppointments();
    const { addToast } = useToast();

    React.useEffect(()=>{
            async function loadProfile(){
                const responseData = await getProfile(() => 
                  identity === "Doctor" 
                    ? api.doctor.getProfile()
                    : api.patient.getProfile()
                );
                if (responseData) {
                  dispatch(changeUser(responseData));
                  console.log("Profile data:", responseData);
                }
            }
            
            async function loadAppointments(){
                const responseData = await getAppointments(() => 
                  identity === "Doctor" 
                    ? api.doctor.getAppointments()
                    : api.patient.getAppointments()
                );
                if (responseData) {
                  setAppointments(responseData);
                  console.log("Appointments:", responseData);
                }
            }
            
            if(isLoggedIn && identity) {
              loadProfile();
              loadAppointments();
            }
        },[isLoggedIn, identity, getProfile, getAppointments])

    const navigate = useNavigate();

    async function logout(){
        // The JWT lives in an httpOnly cookie the browser controls, so it can
        // only be cleared by asking the server to do it. Clear local state
        // regardless of whether that call succeeds (e.g. session already expired).
        try {
            await api.auth.logout(identity);
        } catch (err) {
            // ignore - local state is cleared below either way
        }
        dispatch(deleteUser());
        dispatch(setLoggedOut());
        dispatch(clearUserIdentity());
        navigate("/");
        addToast({ message: "Logged out successfully!", type: 'success' });
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
                <div id="bookingRoot">
                  <h4 style={{textAlign:"center"}}>
                    {identity === "Doctor" ? "Patient Appointments" : "My Bookings"}
                  </h4>
                  <div id="bookings">
                    {appointmentsLoading ? (
                      <LoadingSpinner size="medium" text="Loading appointments..." />
                    ) : appointments && appointments.length > 0 ? (
                      <Table arr={appointments} identity />
                    ) : (
                      <p style={{textAlign:"center"}}>No appointments found</p>
                    )}
                  </div>
                </div>
            </div>
        </div>
    )
}