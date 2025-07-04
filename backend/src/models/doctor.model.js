import mongoose from 'mongoose'



const doctorSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    clinicName:{
        type:String,
    }, 
    specialization:{
        type:String,
    },
    degree:{
        type:String,
    },
    experience:{
        type:Number
    },
   timing: {
      working: {
        start: { type:String },
        end: { type: String }
      },
      break: {
        start: { type: String },
        end: { type:   String }
      }
    },
    workingDays:{
        type:[String],
    },
    slots:{
        type:[String]
    }




},{timestamps:true})

export const Doctor=mongoose.model('Doctor', doctorSchema)