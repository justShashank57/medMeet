import React from "react";

export default async function book(_id,date,time){
      try{
              const token = localStorage.getItem('jwt');
              const response = await fetch("http://localhost:5500/patient/create-appointment",{
              method:"POST",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":`Bearer ${token}`
              },
              body:JSON.stringify({
                   doctorId:_id,
                   date:date,
                   time:time,
              })
            })
            if(response.ok){
              const result = await response.json();
              if(result){
                 console.log(result);
                 alert("Appointment Booked!");
              }
            }
            else alert("Please Enter all Details.")
            return;
      }
      catch(error){
        console.error("Error fetching Booking response:", error);
      }

}