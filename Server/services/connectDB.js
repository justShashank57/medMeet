import mongoose from "mongoose";
import { logger } from "../utility/logger.js";

export default async function ConnectDB(url){
     mongoose.set('strictQuery',true);
     await mongoose.connect(url);
     logger.info("MongoDB connected!");
}
