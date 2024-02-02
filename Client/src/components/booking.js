import React from "react";

export default async function book(patient_id,patientName,docName,docMail,Date,Time){
      
      
      try{
              const response = await fetch("http://localhost:5500/book",{
              method:"POST",
              headers:{
                  "Content-Type":"application/json"
              },
              body:JSON.stringify({
                   patient_id:patient_id,
                   patientName:patientName,
                   docName:docName,
                   docMail:docMail,
                   Date:Date,
                   Time:Time,
              })
            })
            const result = await response.json();
            console.log("API RESPONSE :", result.user)
            return result.user;
      }
      catch(error){
        console.error("Error fetching Booking response:", error);
      }

}