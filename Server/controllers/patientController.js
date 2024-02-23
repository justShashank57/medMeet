import { Patient } from "../Models/Patient.js";
import validator from "validator";
import { generateHash,generateSalt,createToken,validatePassword } from "../utility/passUtility.js";
import { findDoctor, getDoctor, getDoctors } from "./adminController.js";
import { Appointment } from "../Models/Appointment.js";

const maxAge = 3*24*60*60;

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
        console.log(err);
    }
}

//email validator
export const validateEmail = async(email)=>{
     return await validator.isEmail(email);
}
// signup
export const patientSignup = async(req,res)=>{
    try{
        const {name,email,password,phone} = req.body;
        const email_validation = await validateEmail(email);
        if(!email_validation){
            return res.status(400).json({message:"Enter a valid mail address."});
        }
        const existingPatient = await findPatient("",email);
        if(existingPatient){
            return res.status(400).json({message:"User already exists."});
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
            gender:"",
            age:"",
            pincode:"",
            address:"",
            appointments:[],
            photo:"",
            salt:salt
        })
        if(patient){
            // console.log(patient)
            const token_payload = {
                  _id:patient.id,
                  email:patient.email,
                  phone:patient.phone
            }
            const token = await createToken(token_payload);
            // res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
            console.log("JWT cookie created.");
            return res.status(200).json({token:token,email:patient.email,name:patient.name});
        }
        return res.status(400).json({message:"Error with signup."});
    }
    catch(err){
        return res.status(400).json(err);
    }
}

// login
export const patientLogin = async(req,res)=>{
    try{
        const{email,password} = req.body;
        const email_validation = await validateEmail(email);
        if(!email_validation){
            return res.status(400).json({message:"Enter a valid mail address."});
        }
        const existingPatient = await findPatient("",email);
        if(existingPatient){
           const validate_pass = await validatePassword(password,existingPatient.password,existingPatient.salt);
           if(validate_pass){
              console.log("User logged in.");
              const token_payload = {
                 _id:existingPatient.id,
                 email:existingPatient.email,
                 phone:existingPatient.phone
              }
              const token = await createToken(token_payload);
            //   res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
              console.log("JWT Token created.");
              return res.status(200).json({token:token,email:existingPatient.email,name:existingPatient.name});
           } 
           else return res.status(200).json({message:"Wrong Password."});
        }
        return res.status(400).json({message:"User doesn't exists."});
    }
    catch(err){
         console.log(err);
         res.status(400).json(err);
    }
}

// view Profile
export const patientProfile = async(req,res)=>{
       try{
           const user_payload = req.user;
           if(user_payload){
              const userId = user_payload._id;
              const patient = await Patient.findById(userId);
              if(patient){
                 return res.status(200).json(patient);
              }
              return res.status(400).json({message:"User doesn't exist."});
           }
           return res.status(400).json({message:"Error fetching user Profile."});
       }
       catch(err){
           return res.status(400).json(err);
       }
}

// update Profile
export const updatePatientProfile = async(req,res)=>{
    try{
        const user_payload = req.user;
        if(user_payload){
           const {gender,age,pincode,address} = req.body;
           const id = user_payload._id;
           const profile = await Patient.findById(id);
           if(profile){
              profile.gender = gender;
              profile.age = age;
              profile.pincode = pincode;
              profile.address = address;
              const udpatedUser = await profile.save();
              return res.status(200).json(udpatedUser);
           }
           return res.status(400).json({message:"Error in updating User Profile."})
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
}

// view doctors
export const viewDoctors = async(req,res)=>{
       return getDoctors(req,res);
}
export const getDoctorById = async(req,res)=>{
       return getDoctor(req,res);
}

// book appointment
export const createAppointment = async(req,res)=>{
      try{
          const patient_payload = req.user;
          if(patient_payload){
             const patientId = patient_payload._id;
             const appointment_id = `${Math.floor((Math.random()*9000)+1000)}`;
             const {doctorId,date,time} = req.body;
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
                const doctor = await findDoctor(doctorId);
                const patient = await Patient.findById(patientId);
                
                doctor.appointments.push(appointment);
                patient.appointments.push(appointment);
                await doctor.save();
                await patient.save();
                return res.status(200).json(appointment);
             }
          }
          return res.status(400).json({message:"Can not Process Appointment."});
      }
      catch(err){
           return res.status(400).json(err);
      }
}

// view appointments
export const viewAppointments = async(req,res)=>{
       try{
        const user_payload = req.user;
        if(user_payload){
           const patient = await Patient.findById(user_payload._id).populate("appointments");
           if(patient){
               const appointments = patient.appointments;
               console.log(appointments);
               if(appointments){
                  return res.status(200).json(appointments);
               }
           }
        }
        return res.status(400).json({message:"Error while fetching Appointments."});
        }
       catch(err){
           return res.status(400).json(err);
       }
}

// view appointment detail by id
export const getAppointmentByID = async(req,res)=>{
       const id = req.params.id;
       try{
           if(id){
                 const appointment = await Appointment.findById(id);
                 if(appointment){
                    return res.status(200).json(appointment);
                 }
           }
           return res.status(400).json({message:"Error while fetching Appointment details."})
       }
       catch(err){
           return res.status(err);
       }
}
