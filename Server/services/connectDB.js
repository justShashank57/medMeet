import mongoose from "mongoose";

export default async function ConnectDB(url){
     mongoose.set('strictQuery',true);
     try{
       await mongoose.connect(url)
      .then(console.log("MongoDB connected!"))
     }
     catch(error){
      console.log("failed to Connect to DB.");
      console.log(error);
     }

}