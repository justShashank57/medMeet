import { Appointment } from "../Models/Appointment.js";
import { Doctor } from "../Models/Doctor.js";
import { createToken, generateHash, generateSalt, validatePassword, AUTH_COOKIE_NAME, authCookieOptions } from "../utility/passUtility.js";
import { findDoctor } from "./adminController.js";
import { sendAppointmentStatusEmail } from "../utility/mailer.js";
import { Patient } from "../Models/Patient.js";

// signup
export const doctorSignup = async(req,res,next) => {
    try{
        const {name,email,password,phone,gender} = req.body;
        const existingDoctor = await findDoctor("",email);
        if(existingDoctor){
            return res.status(409).json({message:"User already exists."});
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
            gender:gender,
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
        const token_payload = {
              _id:doctor.id,
              email:doctor.email,
              phone:doctor.phone,
              role:"doctor"
        }
        const token = await createToken(token_payload);
        res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
        return res.status(201).json({token:token,email:doctor.email,name:doctor.name});
    }
    catch(err){
        next(err);
    }
}

// login
export const doctorLogin = async(req,res,next)=>{
       try{
           const{email,password} = req.body;
           const existingDoctor = await findDoctor("",email);
           if(existingDoctor){
              const validate_pass = await validatePassword(password,existingDoctor.password);
              if(validate_pass){
                 const token_payload = {
                    _id:existingDoctor.id,
                    email:existingDoctor.email,
                    phone:existingDoctor.phone,
                    role:"doctor"
                 }
                 const token = await createToken(token_payload);
                 res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
                 return res.status(200).json({token:token,email:existingDoctor.email,name:existingDoctor.name});
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
export const doctorProfile = async(req,res,next)=>{
    try{
           const Profile = await Doctor.findById(req.user._id);
           if(Profile){
              return res.status(200).json(Profile);
           }
           return res.status(404).json({message:"Error fetching Profile."});
       }
       catch(err){
           next(err);
       }
}

// update Profile
export const updateProfile = async(req,res,next) =>{
    try{
           const {speciality,pincode,address,hospital} = req.body;
           const profile = await Doctor.findById(req.user._id);
           if(profile){
              profile.speciality = speciality;
              profile.pincode = pincode;
              profile.address = address;
              profile.hospital = hospital;
              const udpatedUser = await profile.save();
              return res.status(200).json(udpatedUser);
           }
           return res.status(404).json({message:"Error in updating user Profile."})
       }
       catch(err){
           next(err);
       }
}

// view appointments
export const getAppointments = async(req,res,next)=>{
    try{
        const doctor = await Doctor.findById(req.user._id).populate("appointments");
        if(doctor){
            return res.status(200).json(doctor.appointments);
        }
        return res.status(404).json({message:"Error while fetching Appointments."});
    }
    catch(err){
        next(err);
    }
}

// confirm appointment
export const confirmAppointment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const doctor = await Doctor.findById(req.user._id).populate("appointments");
        const isAppointmentExist = doctor.appointments.some(appt => appt._id.toString() === id);
        if (!isAppointmentExist) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        const appointment = await Appointment.findById(id);
        appointment.confirmed = !appointment.confirmed;
        appointment.status = appointment.confirmed ? "Confirmed" : "Pending";
        const result = await appointment.save();

        const patient = await Patient.findById(appointment.patientId);
        if(patient){
            sendAppointmentStatusEmail(patient.email, { doctorName: doctor.name, date: appointment.date, time: appointment.time, status: appointment.status });
        }

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

// update appointment status
export const updateAppointmentStatus = async(req,res,next)=>{
    try {
        const {status,notes,appointmentId} = req.body;
        const doctor = await Doctor.findById(req.user._id).populate("appointments");
        const appointment = await Appointment.findOne({appointmentId:appointmentId});
        const isAppointmentExist = doctor.appointments.some(appt => appt.appointmentId === appointmentId);
        if (!isAppointmentExist || !appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        appointment.status = status;
        appointment.notes = notes;
        const result = await appointment.save();

        const patient = await Patient.findById(appointment.patientId);
        if(patient){
            sendAppointmentStatusEmail(patient.email, { doctorName: doctor.name, date: appointment.date, time: appointment.time, status });
        }

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

// isAvailable
export const updateService = async(req,res,next)=>{
    try{
        const doctor = await Doctor.findById(req.user._id);
        if(doctor){
              doctor.isAvailable = !doctor.isAvailable;
              const result = await doctor.save();
              return res.status(200).json(result);
        }
        return res.status(404).json({message:"Error while updating Profile."})
    }
    catch(err){
        next(err);
    }
}

// logout
export const logout = async(req,res)=>{
       const cookieOptions = authCookieOptions();
       res.clearCookie(AUTH_COOKIE_NAME, { httpOnly: cookieOptions.httpOnly, secure: cookieOptions.secure, sameSite: cookieOptions.sameSite });
       return res.status(200).json({message:"Logged out."});
}
