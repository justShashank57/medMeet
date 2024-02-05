import express from "express";
import ConnectDB from "./services/connectDB.js";
import App from './services/expressApp.js';
import * as dotenv from "dotenv";

dotenv.config();
// Start the server
const startServer = async()=>{
  const app = express();
  const PORT  = process.env.PORT;
   try{
        await ConnectDB(process.env.MONGODB_URL);
        await App(app);
        app.get('/',(req,res)=>{
           res.send("Hello from server.")
        })
        app.listen(PORT,()=>{
          console.log(`Listening to Port : ${PORT}`);
        })
   }
   catch(error){
       console.log(error)
   }
}

startServer();