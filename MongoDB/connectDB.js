import mongoose from "mongoose";

export default function ConnectDB(url){
     mongoose.set('strictQuery',true);
     try{
       mongoose.connect(url)
      .then(console.log("MongoDB connected!"))
     }
     catch(error){
      console.log("failed to Connect to DB");
      console.log(error);
     }

}