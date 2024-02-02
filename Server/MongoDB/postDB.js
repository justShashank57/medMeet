import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: String,
    date: String,
    time: String,
  });
const FormSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    age: {type:Number,required:true},
    password: {type:String,required:true},
    identity:{type:String,required:true},
    gender:{type:String,required:true},
    bookings:[itemSchema],
})

const userDetails = mongoose.model('userInfo',FormSchema);

export default userDetails;