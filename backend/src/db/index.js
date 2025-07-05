import {DB_NAME} from '../constants.js'
import mongoose from 'mongoose'

const ConnectDB=async()=>{
    try{
        console.log("Connecting to:", `${process.env.MONGODB_URI}/${DB_NAME}`);
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`mongodb connected successfully!!!!!! DBHOST:${ connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("error in database connection", error)
    }
    
}
export default ConnectDB