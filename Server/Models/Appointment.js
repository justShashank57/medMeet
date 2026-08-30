import mongoose,{Schema} from "mongoose";

const appointmentSchema = new Schema({
      doctorId:{type:String,required:true,index:true},
      patientId:{type:String,required:true,index:true},
      appointmentId:{type:String,required:true},
      date:{type:String,required:true},
      time:{type:String,required:true},
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

// Speeds up the double-booking check (same doctor, date, time) done on every new booking.
appointmentSchema.index({ doctorId:1, date:1, time:1 });

const Appointment = mongoose.model('appointment',appointmentSchema);

export {Appointment};