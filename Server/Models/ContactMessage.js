import mongoose,{Schema} from "mongoose";

const contactMessageSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    subject:{type:String,required:true},
    message:{type:String,required:true},
},{
   timestamps:true
});

const ContactMessage = mongoose.model('contactMessage',contactMessageSchema);

export {ContactMessage};
