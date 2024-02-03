import mongoose,{Schema} from "mongoose";

const doctorSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    speciality:{type:String,required:true},
    pincode:{type:String,required:true},
    address:{type:String,required:true},
    hospital:{type:String,required:true},
    appointments:[{
      type:Schema.Types.ObjectId,
      ref:'appointment'
    }],
    photo:{type:String},
    rating:{type:Number},
    isAvailable:{type:Boolean},
    salt:{type:String,required:true},
},{
   toJSON:{
      transform(doc,ret){
           delete ret.password,
           delete ret.salt,
           delete ret.createdAt,
           delete ret.updatedAt
      },
      timestamps:true
   }
});

const Doctor = mongoose.model('doctor',doctorSchema);

export {Doctor};