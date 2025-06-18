import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js' 
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const Registration=asyncHandler(async(req,res)=>{
/*
gather info
validation if everything came
check if user exist 
take phto url 
upload photo
write code for cloudinary
create user
check
remove password refreshtoken
send res
export
write routes and multer

 */

const {username, fullName, email, password, role }=req.body

if([username, fullName, email, password, role].some((field)=>{
    field?.trim==""
}))
{throw new ApiError(401,'All fields are compulsary')}

const existedUser=await User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    throw new ApiError(401,'user already exists')
}

const photoLocalPath=req.files?.photo[0]?.path

if(!photoLocalPath){
    throw new ApiError(403,'please upload photo')
}

const photo=await uploadOnCloudinary(photoLocalPath)

if(!photo){
    throw new ApiError(401,'error in photo uploading')
}

const user=await User.create({
    username,
    fullName,
    email,
    password,
    role,
    photo:photo.url,  
})

const createdUser=await User.findById(user._id).select("-refreshToken -password")

if(!createdUser){
    throw new ApiError(400,'Something went wrong')
}
 console.log(200, createdUser, "user register succesfully" )
return res.status(201).json(new ApiResponse(200,createdUser,'User created Successfully'))

})

export {
    Registration,

}
