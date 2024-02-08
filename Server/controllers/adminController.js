import { Doctor } from "../Models/doctor.js"
import { generateHash, generateSalt } from "../utility/passUtility.js";

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
           console.log(err);
       }
}

// create doctor

export const createDoctor = async(req,res) => {
    try{
        const {name,email,password,phone,speciality,pincode,address,hospital} = req.body;
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
        if(doctor){
            return res.status(200).json(doctor);
        }
    }
    catch(err){
        return res.status(400).json(err);
    }
}

// get doctors
export const getDoctors = async(req,res)=>{
       const doctors = await Doctor.find();
       try{
           if(doctors){
              return res.status(200).json(doctors);
           }
           else{
               return res.status(400).json({message:"No Doctors Found."})
           }
       }
       catch(err){
           console.log(err);
       }
}

// Delete Doctor
export const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        await Doctor.findByIdAndDelete(doctorId);
        return res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// find doctors by id
export const getDoctor = async(req,res)=>{
    const doctorId = req.params.id;
    try{
        if(doctorId){
           const doctor = await findDoctor(doctorId);
           if(doctor){
              return res.status(200).json(doctor);
           }
        }
        return res.status(400).json({message:"No Doctor Found."});
    }
    catch(err){
        console.log(err);
    }
}