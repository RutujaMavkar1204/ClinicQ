import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_SECRET,
    api_key:process.env.CLOUD_API_KEY
})

const uploadOnCloudinary=async(localPath)=>{
    try{
         if(!localPath){
        return null
    }
    const response=await cloudinary.uploader.upload(localPath,{
        resource_type:"auto"
    })
    if(!response){
        console.log('error in cloudinary uplodation')
    }
    console.log('file uploaded on cloudinary', response)
    fs.unlinkSync(localPath);
    return response

    }
    catch(error){
        fs.unlinkSync(localPath)
        console.log('error in cloudinary', error)

    }
   
}
export {uploadOnCloudinary};

