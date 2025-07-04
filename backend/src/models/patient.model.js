import mongoose from 'mongoose'

const patientSchema= new mongoose.Schema({
   userDetail:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
   },
   phoneNumber:{
    type:Number,
   },
   queueAction:{
        type:String,
        enum:['Waiting','Remove','Mark as served'],
        default:'Waiting'
    },
   IdentityVerification:{
      govtDoc:{
         type:String,
      },
      address:{
         type:String,
      },
      emergencyContact:{
        name:String,
        contactNumber:Number,
      },
   },
   medicalHistory:{
      chronicConditions:{
         type:[String],
         default:[]
      },
      pastSurgeries:{
         type:[String],
         default:[]
      },
      allergies:{
         type:[String],
         default:[]
      },
   },
   reportsSubmission:{
   type:String,
},
   insurance:{
   type:String
}

},{timestamps:true})


export const Patient= mongoose.model('Patient',patientSchema)