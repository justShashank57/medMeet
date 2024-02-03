import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// generate salt for hashing
export const generateSalt = async() => {
       return await bcrypt.genSalt();
}

// convert password to hash
export const generateHash = async(password,salt) => {
       return bcrypt.hash(password,salt);
}

// validate password
export const validatePassword = async(enteredPassword,savedHash,salt) => {
       return await generateHash(enteredPassword,salt) === savedHash;
}

// create JWT token
export const createToken = async(payload)=>{
       return await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'3D'});
}