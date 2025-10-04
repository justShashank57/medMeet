import api from "../services/webcalls";

export default async function book(doctorId, date, time){
      try{
              const appointmentData = {
                   doctorId: doctorId,
                   date: date,
                   time: time,
              };
              
              const result = await api.patient.bookAppointment(appointmentData);
              console.log("Booking result:", result);
              return result;
      }
      catch(error){
        console.error("Error fetching Booking response:", error);
        throw error;
      }
}