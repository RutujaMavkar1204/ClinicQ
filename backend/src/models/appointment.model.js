import mongoose from 'mongoose'

const appointmentSchema=new mongoose.Schema({
 
doctor: {
     type: mongoose.Schema.ObjectId, 
     ref: 'Doctor'
     },
  arr: [ 
    { key: Number, value: String }
 ]


},{timestamps:true})

export const Appointment=mongoose.model('Appointment',appointmentSchema)