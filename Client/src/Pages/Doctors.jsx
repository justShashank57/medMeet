import React from "react";
import doctorsData from "../data/doctors";
import DoctorCard from "../components/doctorCard";
import Appointment from "./Appointment";
export default function Doctors(){
    const[selected,setSelected] = React.useState(null);
    const elements = doctorsData.map((obj)=>{
        return(
            <DoctorCard obj={obj} setSelected={setSelected}/>
        )
    })

    return(
        <div id="doctorsRoot">
            {
                selected ?
                  <Appointment setSelected={setSelected} email={selected.email} img={selected.photo} name={selected.name} speciality={selected.specialty} hospital={selected.hospital}/>
                  :
                  <div id="docBox">
                       {elements}
                  </div>
            } 
        </div>
    )
}