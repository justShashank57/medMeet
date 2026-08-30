import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

// generate salt for hashing
export const generateSalt = async() => {
       return await bcrypt.genSalt();
}

// convert password to hash
export const generateHash = async(password,salt) => {
       return bcrypt.hash(password,salt);
}

// validate password (constant-time compare via bcrypt, salt is already embedded in savedHash)
export const validatePassword = async(enteredPassword,savedHash) => {
       return await bcrypt.compare(enteredPassword,savedHash);
}

// create JWT token
export const createToken = async(payload)=>{
       return jwt.sign(payload,config.JWT_SECRET,{expiresIn:'3d'});
}