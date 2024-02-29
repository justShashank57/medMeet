import React from "react";
import DoctorCard from "../components/doctorCard";
import Appointment from "./Appointment";
export default function Doctors(){
    const[selected,setSelected] = React.useState(null);
    const[doctors,setDoctors] = React.useState([]);
    React.useEffect(()=>{
         async function fetchDoctors(){
                 const token = localStorage.getItem('jwt');
                 const response = await fetch("https://medmeet-1.onrender.com/patient/getDoctors",{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                 })
                 if(response.ok){
                    let responseData = await response.json();
                    setDoctors(responseData);
                 }
         }
         if(doctors.length<1) fetchDoctors();
    },[])
    const elements = doctors.map((obj)=>{
        return(
            <DoctorCard obj={obj} setSelected={setSelected}/>
        )
    })

    return(
        <div id="doctorsRoot">
            {
                selected ?
                  <Appointment doctor={selected}  setSelected={setSelected}/>
                  :
                  <div id="docBox">
                       {elements}
                  </div>
            } 
        </div>
    )
}