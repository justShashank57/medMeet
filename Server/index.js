import express from "express";
import ConnectDB from "./services/connectDB.js";
import App from './services/expressApp.js';
import { config } from "./config.js";

// Start the server
const startServer = async()=>{
  const app = express();
  const PORT = config.PORT;
   try{
        await ConnectDB(config.MONGODB_URL);
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