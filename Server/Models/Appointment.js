import mongoose,{Schema} from "mongoose";

const appointmentSchema = new Schema({
      doctorId:{type:String,required:true},
      patientId:{type:String,required:true},
      appointmentId:{type:String,required:true},
      date:{type:String,required:true},
      status:{type:String,required:true}, //(e.g., confirmed, pending, cancelled).
      duration:{type:String,required:true},
      confirmed:{type:Boolean,required:true},
      reason:{type:String}, //(e.g., consultation, follow-up, procedure).
      notes:{type:String} //any remarks by doctor
},{
    toJSON:{
       transform(doc,ret){
            delete ret.createdAt,
            delete ret.updatedAt
       },
       timestamps:true
    }
})

const Appointment = mongoose.model('appointment',appointmentSchema);

export {Appointment};