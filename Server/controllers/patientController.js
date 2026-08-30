import { Patient } from "../Models/Patient.js";
import { generateHash,generateSalt,createToken,validatePassword } from "../utility/passUtility.js";
import { findDoctor, getDoctor, getDoctors } from "./adminController.js";
import { Appointment } from "../Models/Appointment.js";
import { sendAppointmentBookedEmail } from "../utility/mailer.js";
import { logger } from "../utility/logger.js";

const CANCELLATION_DEADLINE_HOURS = 2;

// find patient
export const findPatient = async(patientId,email) =>{
    try{
        if(email){
            return await Patient.findOne({email});
        }
        else{
           return await Patient.findById(patientId);
        }
    }
    catch(err){
        logger.error("findPatient failed", { error: err.message });
    }
}

// signup
export const patientSignup = async(req,res,next)=>{
    try{
        const {name,email,password,phone,gender} = req.body;
        const existingPatient = await findPatient("",email);
        if(existingPatient){
            return res.status(409).json({message:"User already exists."});
        }
        //    generate hash
        const salt = await generateSalt();
        // generate hash
        const hashedPass = await generateHash(password,salt);

        const patient = await Patient.create({
            name:name,
            email:email,
            password:hashedPass,
            phone:phone,
            gender:gender,
            age:"",
            pincode:"",
            address:"",
            appointments:[],
            photo:"",
            salt:salt
        })
        if(patient){
            const token_payload = {
                  _id:patient.id,
                  email:patient.email,
                  phone:patient.phone
            }
            const token = await createToken(token_payload);
            return res.status(201).json({token:token,email:patient.email,name:patient.name});
        }
        return res.status(400).json({message:"Error with signup."});
    }
    catch(err){
        next(err);
    }
}

// login
export const patientLogin = async(req,res,next)=>{
    try{
        const{email,password} = req.body;
        const existingPatient = await findPatient("",email);
        if(existingPatient){
           const validate_pass = await validatePassword(password,existingPatient.password);
           if(validate_pass){
              const token_payload = {
                 _id:existingPatient.id,
                 email:existingPatient.email,
                 phone:existingPatient.phone
              }
              const token = await createToken(token_payload);
              return res.status(200).json({token:token,email:existingPatient.email,name:existingPatient.name});
           }
           else return res.status(401).json({message:"Wrong Password."});
        }
        return res.status(404).json({message:"User doesn't exists."});
    }
    catch(err){
         next(err);
    }
}

// view Profile
export const patientProfile = async(req,res,next)=>{
       try{
           const userId = req.user._id;
           const patient = await Patient.findById(userId);
           if(patient){
              return res.status(200).json(patient);
           }
           return res.status(404).json({message:"User doesn't exist."});
       }
       catch(err){
           next(err);
       }
}

// update Profile
export const updatePatientProfile = async(req,res,next)=>{
    try{
        const {gender,age,pincode,address} = req.body;
        const id = req.user._id;
        const profile = await Patient.findById(id);
        if(profile){
           profile.gender = gender;
           profile.age = age;
           profile.pincode = pincode;
           profile.address = address;
           const udpatedUser = await profile.save();
           return res.status(200).json(udpatedUser);
        }
        return res.status(404).json({message:"Error in updating User Profile."})
    }
    catch(err){
        next(err);
    }
}

// view doctors
export const viewDoctors = async(req,res,next)=>{
       return getDoctors(req,res,next);
}
export const getDoctorById = async(req,res,next)=>{
       return getDoctor(req,res,next);
}

// book appointment
export const createAppointment = async(req,res,next)=>{
      try{
             const patientId = req.user._id;
             const {doctorId,date,time} = req.body;

             const appointmentDate = new Date(`${date}T${time}:00`);
             if(Number.isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()){
                return res.status(400).json({message:"Appointment date/time must be in the future."});
             }

             const doctor = await findDoctor(doctorId);
             if(!doctor){
                return res.status(404).json({message:"Doctor not found."});
             }

             // prevent double-booking the same doctor slot
             const conflict = await Appointment.findOne({
                doctorId,
                date,
                time,
                status:{ $ne:"Cancelled" }
             });
             if(conflict){
                return res.status(409).json({message:"This time slot is already booked. Please choose another."});
             }

             const appointment_id = `${Math.floor((Math.random()*9000)+1000)}`;
             const appointment = await Appointment.create({
                   doctorId:doctorId,
                   patientId:patientId,
                   appointmentId:appointment_id,
                   date:date,
                   time:time,
                   duration:"30",
                   confirmed:false,
                   status:"Pending",
                   reason:"",
                   notes:""
             })
             if(appointment){
                const patient = await Patient.findById(patientId);

                doctor.appointments.push(appointment);
                patient.appointments.push(appointment);
                await doctor.save();
                await patient.save();

                sendAppointmentBookedEmail(patient.email, { doctorName: doctor.name, date, time });

                return res.status(201).json(appointment);
             }
          return res.status(400).json({message:"Can not Process Appointment."});
      }
      catch(err){
           next(err);
      }
}

// view appointments
export const viewAppointments = async(req,res,next)=>{
       try{
        const patient = await Patient.findById(req.user._id).populate("appointments");
        if(patient){
            return res.status(200).json(patient.appointments);
        }
        return res.status(404).json({message:"Error while fetching Appointments."});
        }
       catch(err){
           next(err);
       }
}

// view appointment detail by id
export const getAppointmentByID = async(req,res,next)=>{
       const id = req.params.id;
       try{
             const appointment = await Appointment.findById(id);
             if(appointment){
                return res.status(200).json(appointment);
             }
           return res.status(404).json({message:"Appointment not found."})
       }
       catch(err){
           next(err);
       }
}

// cancel appointment (patient-initiated, subject to a cancellation deadline)
export const cancelAppointment = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const patient = await Patient.findById(req.user._id);
        const owns = patient.appointments.some(apptId => apptId.toString() === id);
        if(!owns){
            return res.status(404).json({message:"Appointment not found."});
        }

        const appointment = await Appointment.findById(id);
        if(!appointment){
            return res.status(404).json({message:"Appointment not found."});
        }
        if(appointment.status === "Cancelled"){
            return res.status(400).json({message:"Appointment is already cancelled."});
        }

        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
        const hoursUntilAppointment = (appointmentDateTime.getTime() - Date.now()) / (1000*60*60);
        if(hoursUntilAppointment < CANCELLATION_DEADLINE_HOURS){
            return res.status(400).json({message:`Appointments can only be cancelled at least ${CANCELLATION_DEADLINE_HOURS} hours in advance.`});
        }

        appointment.status = "Cancelled";
        appointment.confirmed = false;
        const result = await appointment.save();
        return res.status(200).json(result);
    }
    catch(err){
        next(err);
    }
}
