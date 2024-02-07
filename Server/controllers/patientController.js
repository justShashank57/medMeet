import { Patient } from "../Models/Patient.js";
import validator from "validator";
import { generateHash,generateSalt,createToken,validatePassword } from "../utility/passUtility.js";

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
            console.log(patient)
            const token_payload = {
                  _id:patient.id,
                  email:patient.email,
                  phone:patient.phone
            }
            const token = await createToken(token_payload);
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
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
              res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
              console.log("JWT cookie created.");
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

// update Profile

// view doctors

// book appointment

// view appointments

// view appointment detail

// logout