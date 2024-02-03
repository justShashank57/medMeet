import mongoose,{Schema} from "mongoose";

const patientSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    gender:{type:String,required:true},
    age:{type:String,required:true},
    pincode:{type:String,required:true},
    address:{type:String,required:true},
    photo:{type:String},
    rating:{type:Number},
    appointments:{
        type:Schema.Types.ObjectId,
        ref:'appointment'
    },
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

const Patient = mongoose.model('patient',patientSchema);

export {Patient};