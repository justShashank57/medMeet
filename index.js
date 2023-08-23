import express from "express"
import cors from "cors";
import ConnectDB from "./MongoDB/connectDB.js";
import login from "./Routes/login.js";
import signUp from "./Routes/signUp.js";
import book from "./Routes/book.js";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();

//CORS
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });


//Middlewares
app.use(express.json());
app.use('/loginForm',login)
app.use('/submit_form',signUp)
app.use('/book',book)



// Start the server

app.get("/",(req,res)=>{
  res.status(200).send("Hello from Server.");
})

const startServer = async()=>{
   try{
        await ConnectDB(process.env.MONGODB_URL);
        app.listen(5500,()=>{
          console.log("Server Started!")
        })
   }
   catch(error){
       console.log(error)
   }
}

startServer();