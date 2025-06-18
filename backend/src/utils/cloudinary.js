import {v2 as cloudinary} from 'cloudinary'
import ApiError from './ApiError.js'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    cloud_secret:process.env.CLOUD_SECRET,
    api_key:process.env.CLOUD_API_KEY
})

const uploadOnCloudinary=async(localPath)=>{
    try{
         if(!localPath){
        return null
    }
    const response=await cloudinary.uploader.upload(localPath,{
        resource_type:auto
    })
    if(!response){
        throw new ApiError(500,'failed to upload on cloudinary')
    }
    fs.unlinkSync(localPath);
    return response

    }
    catch(error){
        fs.unlinkSync(localPath)
        throw new ApiError(500,'failed to upload on cloudinary')

    }
   
}
export {uploadOnCloudinary};

