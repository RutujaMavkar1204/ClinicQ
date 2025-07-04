import mongoose,{Schema} from 'mongoose'

const queueSchema=new mongoose.Schema({
    email:{
        type:String
    },
    
    tokenNumber:{
        type:Number,
    },
   
    

        
},{timestamps:true})

export const Queue=mongoose.model('Queue',queueSchema)