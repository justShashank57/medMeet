import express from "express";
import userDetails from "../MongoDB/postDB.js";

const router = express.Router();

router.route("/").post(async(req,res)=>{
    const{patient_id,patientName,docName,docMail,Date,Time} = req.body;
    console.log("Booking request recieved!")

    //update patient data
    try{
        const patientData = {
            name:docName,
            date:Date,
            time:Time,
        };

        await userDetails.findOneAndUpdate({name:patientName,_id:patient_id,identity:"Patient"},{$push:{bookings:patientData}});
        
        const newPatient = await userDetails.findOne({name:patientName,_id:patient_id,identity:"Patient"});
        console.log(newPatient)

        //update doctor data
        const docData = {
            name:patientName,
            date:Date,
            time:Time,
        }
        const newDoc = await userDetails.findOneAndUpdate({name:docName,email:docMail},{$push:{bookings:docData}});
        res.status(200).send({message:"Booking Successful",user:newPatient});
    }
    catch(error){
        console.log("Error occured while Booking :", error)
        res.send("Error occured while Booking !")
    }
})

export default router;