import { Appointment } from "../Models/Appointment.js";
import { Doctor } from "../Models/doctor.js";
import { createToken, generateHash, generateSalt, validatePassword } from "../utility/passUtility.js";
import { findDoctor } from "./adminController.js";
import validator from "validator";

const maxAge = 3*24*60*60;
//email validator
export const validateEmail = async(email)=>{
     return await validator.isEmail(email);
}

// signup
export const doctorSignup = async(req,res) => {
    try{
        const {name,email,password,phone} = req.body;
        const email_validation = await validateEmail(email);
        if(!email_validation){
            return res.status(400).json({message:"Enter a valid mail address."});
        }
        const existingDoctor = await findDoctor("",email);
        if(existingDoctor){
            return res.status(400).json({message:"User already exists."});
        }
        //    generate hash
        const salt = await generateSalt();
        // generate hash
        const hashedPass = await generateHash(password,salt);
    
        const doctor = await Doctor.create({
            name:name,
            email:email,
            password:hashedPass,
            phone:phone,
            speciality:"",
            pincode:"",
            address:"",
            hospital:"",
            appointments:[],
            photo:"",
            rating:5,
            isAvailable:true,
            salt:salt
        })
        if(doctor){
            console.log(doctor)
            const token_payload = {
                  _id:doctor.id,
                  email:doctor.email,
                  phone:doctor.phone
            }
            const token = await createToken(token_payload);
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
            console.log("JWT cookie created.");
            return res.status(200).json({token:token,email:doctor.email,name:doctor.name});
        }
        return res.status(400).json({message:"Error with signup."});
    }
    catch(err){
        return res.status(400).json(err);
    }
}

// login
export const doctorLogin = async(req,res)=>{
       try{
           const{email,password} = req.body;
           const email_validation = await validateEmail(email);
           console.log(email_validation);
           if(!email_validation){
               return res.status(400).json({message:"Enter a valid mail address."});
           }
           const existingDoctor = await findDoctor("",email);
           if(existingDoctor){
              const validate_pass = await validatePassword(password,existingDoctor.password,existingDoctor.salt);
              if(validate_pass){
                 console.log("User logged in.");
                 const token_payload = {
                    _id:existingDoctor.id,
                    email:existingDoctor.email,
                    phone:existingDoctor.phone
                 }
                 const token = await createToken(token_payload);
                 res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                 console.log("JWT cookie created.");
                 return res.status(200).json({token:token,email:existingDoctor.email,name:existingDoctor.name});
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
export const doctorProfile = async(req,res)=>{
    try{
           const user_payload = req.user;
           if(user_payload){
              const id = user_payload._id;
              const Profile = await Doctor.findById(id);
              if(Profile){
                 return res.status(200).json(Profile);
              }
              return res.status(400).json({message:"Error fetching Profile."});
           }
       }
       catch(err){
           console.log(err);
           return res.status(400).json(err);
       }
}

// update Profile
export const updateProfile = async(req,res) =>{
    try{
           const user_payload = req.user;
           if(user_payload){
              const {speciality,pincode,address,hospital} = req.body;
              const id = user_payload._id;
              const profile = await Doctor.findById(id);
              if(profile){
                 profile.speciality = speciality;
                 profile.pincode = pincode;
                 profile.address = address;
                 profile.hospital = hospital;
                 const udpatedUser = await profile.save();
                 return res.status(200).json(udpatedUser);
              }
              return res.status(400).json({message:"Error in updating user Profile."})
           }
       }
       catch(err){
           console.log(err);
           return res.status(400).json(err);
       }
}

// view appointments
export const getAppointments = async(req,res)=>{
    try{
        const user_payload = req.user;
        if(user_payload){
           const patient = await Doctor.findById(user_payload._id).populate("appointments");
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

// confirm appointment
export const confirmAppointment = async (req, res) => {
    try {
        const user_payload = req.user;
        const id = req.params.id;
        const appointments = (await Doctor.findById(user_payload._id).populate("appointments")).appointments;
        if (id) {
            const appointment = await Appointment.findById(id);
            // now check whether appointment is in appointments array
            const isAppointmentExist = appointments.some(appt => appt._id.toString() === id);
            if (isAppointmentExist) {
                appointment.confirmed = !appointment.confirmed;
                const result = await appointment.save();
                if (result) {
                    return res.status(200).json(result);
                }
            } else {
                return res.status(404).json({ message: "Appointment not found." });
            }
        }
        return res.status(400).json({ message: "Error while changing status." });
    } catch (err) {
        return res.status(400).json(err);
    }
}

// update appointment status
export const updateAppointmentStatus = async(req,res)=>{
    try {
        const user_payload = req.user;
        const {status,notes,appointmentId} = req.body;
        if (user_payload) {
            const appointments = (await Doctor.findById(user_payload._id).populate("appointments")).appointments;
            const appointment = await Appointment.findOne({appointmentId:appointmentId});
            // now check whether appointment is in appointments array
            const isAppointmentExist = appointments.some(appt => appt.appointmentId === appointmentId);
            if (isAppointmentExist) {
                appointment.status = status;
                appointment.notes = notes;
                const result = await appointment.save();
                if (result) {
                    return res.status(200).json(result);
                }
            } else {
                return res.status(404).json({ message: "Appointment not found." });
            }
        }
        return res.status(400).json({ message: "Error while changing status." });
    } catch (err) {
        return res.status(400).json(err);
    }
}

// isAvailable
export const updateService = async(req,res)=>{
    try{
        const user_payload = req.user;
        if(user_payload){
              const doctor = await Doctor.findById(user_payload._id);
              if(doctor){
                 doctor.isAvailable = !doctor.isAvailable;
                 const result = await doctor.save();
                 return res.status(200).json(result);
              }
               return res.status(400).json({message:"Error while updating Profile."})
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json(err);
    }

}

// logout
export const logout = async(req,res)=>{
       res.cookie('jwt','',{maxAge:1});
       res.redirect('/')
}