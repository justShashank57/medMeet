import 'dotenv/config';
import express from "express";
import ConnectDB from "./services/connectDB.js";
import App from './services/expressApp.js';
import { config } from "./config.js";
import { logger } from "./utility/logger.js";
import { initErrorTracking } from "./utility/errorTracking.js";

// Start the server
const startServer = async()=>{
  initErrorTracking();
  const app = express();
  const PORT = config.PORT;
   try{
        await ConnectDB(config.MONGODB_URL);
        await App(app);
        app.listen(PORT,()=>{
          logger.info(`Listening on port ${PORT}`);
        })
   }
   catch(error){
       logger.error("Failed to start server", { error: error.message, stack: error.stack });
       process.exit(1);
   }
}

startServer();