import { ContactMessage } from "../Models/ContactMessage.js";
import { sendContactMessageEmail } from "../utility/mailer.js";

export const submitContactMessage = async(req,res,next) => {
    try{
        const {name,email,subject,message} = req.body;
        await ContactMessage.create({name,email,subject,message});
        await sendContactMessageEmail({name,email,subject,message});
        return res.status(201).json({message:"Message sent successfully."});
    }
    catch(err){
        next(err);
    }
}
