import express from "express"
import userDetails from "../MongoDB/postDB.js"

const router = express.Router();

//sign-up post request
router.route('/').post(async (req, res) => {
    console.log("SignUp request recieved!")
    const {name,email,age,password,identity,gender} = req.body;
    try {
        const newSubmission = new userDetails({
        name:name,
        email:email,
        age:age,
        password:password,
        identity:identity,
        gender:gender,
        });
      await newSubmission.save();
      res.status(200).json({success:true,message:"SignUp Successfull"});
    } catch (error) {
      res.status(500).send("Error while submitting the form");
      console.log(error)
    }
});

export default router;