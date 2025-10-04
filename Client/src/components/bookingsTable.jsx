import React from "react";
import api from "../services/webcalls";

export default function Table({arr, identity}){
    
    function handleDelete(appointmentId){
          console.log("Delete function triggered for appointment:", appointmentId);
          // Implement appointment cancellation logic here
    }

    function handleConfirm(appointmentId) {
        console.log("Confirm function triggered for appointment:", appointmentId);
        // Implement appointment confirmation logic here
    }

    const rows = arr.map((obj)=>{
        return(
             <tr key={obj._id}>
                <td>{obj.doctorId?.name || obj.patientId?.name || "N/A"}</td>
                <td>{obj.date}</td>
                <td>{obj.time}</td>
                <td>{obj.status}</td>
                <td>
                    {identity === "Doctor" ? (
                        <>
                            <button onClick={() => handleConfirm(obj._id)}>Confirm</button>
                            <button onClick={() => handleDelete(obj._id)}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => handleDelete(obj._id)}>Cancel</button>
                    )}
                </td>
            </tr>
        )        
    })
          return(
            <>
            <table>
                <tr>
                    <th>{identity === "Doctor" ? "Patient" : "Doctor"}</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                {arr && rows}
            </table>
            </>
          )
}