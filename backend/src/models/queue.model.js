import mongoose,{Schema} from 'mongoose'

const queueSchema=new mongoose.Schema({
    queueName:{
        type:String,
    },
    doctorName:{
        type:String,
    },
    clinicName:{
        type:String,
    },
    patientName:{
       type:Schema.Types.ObjectId,
        ref:'User',
    },
    queueType:{
        type:String,
        enum:['Emergency','Normal'],
    },
    queueLength:{
        type:Number,
    },
    tokenNumber:{
        type:Number,
    },
    nurseName:{
        type:String,
    },
    queuestatus:{
        type:String,
        enum:['Ongoing','Pause','Exit'],
        default:'Ongoing'
    },
    queueAction:{
        type:String,
        enum:['Waiting','Remove','Mark as served'],
        default:'Waiting'
    },
    startTime:{
       type:String,
    },
    endTime:{
       type:String,
    },
    specialization:{
        type:String,
    }

        
},{timeStamps:true})

export const Queue=mongoose.model('Queue',queueSchema)