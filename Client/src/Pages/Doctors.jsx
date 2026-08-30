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
    const[searchTerm,setSearchTerm] = React.useState("");
    const[debouncedSearch,setDebouncedSearch] = React.useState("");
    const { fetchDoctors: loadDoctors } = useDoctors();

    React.useEffect(()=>{
        const timer = setTimeout(()=> setDebouncedSearch(searchTerm.trim()), 300);
        return ()=> clearTimeout(timer);
    },[searchTerm])

    React.useEffect(()=>{
         async function loadData(){
                 setIsLoading(true);
                 try {
                     const responseData = await loadDoctors(() => api.patient.getDoctors({ search: debouncedSearch || undefined }));
                     if (responseData) {
                       setDoctors(responseData.doctors ?? responseData);
                     }
                 } catch(error) {
                     console.error("Error loading doctors:", error);
                 }
                 setIsLoading(false);
         }
         loadData();
    },[loadDoctors, debouncedSearch])
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
                       <input
                         type="text"
                         placeholder="Search doctors by name..."
                         value={searchTerm}
                         onChange={(e)=>setSearchTerm(e.target.value)}
                         style={{width:"100%", maxWidth:"400px", padding:"0.6rem 1rem", margin:"0 0 1.5rem", borderRadius:"8px", border:"1px solid #ccc", display:"block"}}
                       />
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
