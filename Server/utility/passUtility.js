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

// The JWT is set as an httpOnly cookie so browser clients never need to keep
// it in localStorage (XSS-exposed). The Authorization header is still
// accepted by requireAuth for non-browser clients and existing tests.
export const AUTH_COOKIE_NAME = "jwt";

const AUTH_COOKIE_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000; // keep in sync with createToken's 3d expiry

export const authCookieOptions = () => ({
       httpOnly: true,
       secure: config.NODE_ENV === "production",
       sameSite: config.NODE_ENV === "production" ? "none" : "lax",
       maxAge: AUTH_COOKIE_MAX_AGE_MS,
});