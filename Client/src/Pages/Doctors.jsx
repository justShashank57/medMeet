import React from "react";
import DoctorCard from "../components/doctorCard";
import Appointment from "./Appointment";
import { useDoctors } from "../hooks/useAPI";
import { LoadingSpinner } from "../components/LoadingSpinner";
import api from "../services/webcalls";

export default function Doctors(){
    const[selected,setSelected] = React.useState(null);
    const[doctors,setDoctors] = React.useState([]);
    const[isLoading, setIsLoading] = React.useState(true);
    const { fetchDoctors: loadDoctors } = useDoctors();
    
    React.useEffect(()=>{
         async function loadData(){
                 setIsLoading(true);
                 try {
                     const responseData = await loadDoctors(() => api.patient.getDoctors());
                     if (responseData) {
                       setDoctors(responseData);
                     }
                 } catch(error) {
                     console.error("Error loading doctors:", error);
                 }
                 setIsLoading(false);
         }
         loadData();
    },[loadDoctors])
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
                       {isLoading ? (
                         <LoadingSpinner size="large" text="Loading doctors..." />
                       ) : elements.length > 0 ? (
                         elements
                       ) : (
                         <p style={{textAlign:"center", fontSize:"1.2rem", margin:"2rem"}}>
                           No doctors available at the moment
                         </p>
                       )}
                  </div>
            } 
        </div>
    )
}