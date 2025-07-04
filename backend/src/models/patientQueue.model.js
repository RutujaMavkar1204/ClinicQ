import mongoose from 'mongoose'

const patientQueueSchema=new mongoose.Schema({
    doctor:{
        type:String
    },
    patientName:{
        type:String
    },
    date:{
        type:String
    },
    appointment:{
        type:String
    }

},{timestamps:true})

export const PatientQueue=mongoose.model('PatientQueue', patientQueueSchema )