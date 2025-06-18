import mongoose,{Schema} from 'mongoose'

const queueSchema=new mongoose.Schema({
    queueName:{
        type:String,
        required:true,
    },
    doctorName:{
        type:Schema.type.objectId,
        ref:'User',
        required:true,
    },
    patientName:{
        type:Schema.type.objectId,
        ref:'User',
        required:true,
    },
    queueType:{
        type:String,
        enum:['Emergency','Normal'],
        required:true,
    },
    queueLength:{
        type:Number,
        required:true,
    },
    tokenNumber:{
        type:Number,
        required:true,
    },
    nurseName:{
        type:String,
        required:true,
    },
    queuestatus:{
        type:String,
        enum:['Ongoing','Pause','Exit'],
        required:true,
        default:'Ongoing'
    },
    queueAction:{
        type:String,
        enum:['Waiting','Remove','Mark as served'],
        required:true,
        default:'Waiting'
    },
    startTime:{
        type:Number,
        required:true
    },
    endTime:{
        type:Number,
        required:true
    }
        
},{timeStamps:true})

export const Queue=mongoose.model('Queue',queueSchema)