import { Doctor } from "../Models/doctor.js";
import { createToken, generateHash, generateSalt, validatePassword } from "../utility/passUtility.js";
import { findDoctor } from "./adminController.js";

const maxAge = 3*24*60*60;
// signup
export const doctorSignup = async(req,res) => {
    try{
        const {name,email,password,phone} = req.body;
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
           return res.status.json({message:"User doesn't exists."});
       }
       catch(err){
            console.log(err);
            res.status.json(err);
       }
}

// view Profile

// update Profile

// view appointments

// view appointment detail

// update appointment status

// isAvailable

// logout