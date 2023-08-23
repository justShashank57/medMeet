import express from "express";
import userDetails from "../MongoDB/postDB.js";

const router = express.Router();

//login post request 
router.route("/").post(async (req,res)=>{
    const{email,password} = req.body;
    const user =  await userDetails.findOne({email:email})
      if(user){
       console.log("Reached inside login database")
       if(password == user.password){
         res.send({message:"Login successfull.",user:user});
       }else{
         res.send({message:"Password didn't match!"});
       }
      }
      else{
        res.send({message:"User doesn't exist!"});
      }
})

export default router;