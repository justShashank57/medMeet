import { Doctor } from "../Models/Doctor.js"
import { generateHash, generateSalt } from "../utility/passUtility.js";
import { logger } from "../utility/logger.js";

export const findDoctor = async(doctorId,email) =>{
       try{
           if(email){
               return await Doctor.findOne({email});
           }
           else{
              return await Doctor.findById(doctorId);
           }
       }
       catch(err){
           logger.error("findDoctor failed", { error: err.message });
       }
}

// create doctor
export const createDoctor = async(req,res,next) => {
    try{
        const {name,email,password,phone,gender,speciality,pincode,address,hospital} = req.body;
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
            speciality:speciality,
            pincode:pincode,
            address:address,
            hospital:hospital,
            appointments:[],
            photo:"",
            rating:5,
            isAvailable:true,
            salt:salt
        })
        return res.status(201).json(doctor);
    }
    catch(err){
        next(err);
    }
}

// get doctors (paginated, filterable)
export const getDoctors = async(req,res,next)=>{
       try{
           const page = parseInt(req.query.page) || 1;
           const limit = parseInt(req.query.limit) || 20;
           const filter = {};
           if(req.query.speciality){
              filter.speciality = new RegExp(req.query.speciality, "i");
           }
           if(req.query.search){
              filter.name = new RegExp(req.query.search, "i");
           }
           if(req.query.isAvailable !== undefined){
              filter.isAvailable = req.query.isAvailable === "true";
           }

           const [doctors, total] = await Promise.all([
              Doctor.find(filter).skip((page-1)*limit).limit(limit),
              Doctor.countDocuments(filter)
           ]);

           return res.status(200).json({
              doctors,
              pagination:{ page, limit, total, totalPages: Math.ceil(total/limit) }
           });
       }
       catch(err){
           next(err);
       }
}

// Delete Doctor
export const deleteDoctor = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        await Doctor.findByIdAndDelete(doctorId);
        return res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// find doctor by id
export const getDoctor = async(req,res,next)=>{
    const doctorId = req.params.id;
    try{
        const doctor = await findDoctor(doctorId);
        if(doctor){
           return res.status(200).json(doctor);
        }
        return res.status(404).json({message:"Doctor not found."});
    }
    catch(err){
        next(err);
    }
}
