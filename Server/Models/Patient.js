import mongoose,{Schema} from "mongoose";

const patientSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    gender:{type:String},
    age:{type:String},
    pincode:{type:String},
    address:{type:String},
    photo:{type:String},
    appointments:[{
        type:Schema.Types.ObjectId,
        ref:'appointment'
    }],
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