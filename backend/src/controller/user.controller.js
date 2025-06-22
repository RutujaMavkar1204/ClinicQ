import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js' 
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken= async (userId)=>{
 try{
 const user=await User.findById(userId)
    const accessToken= await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()

    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken, refreshToken}
 }
 catch(error){
    console.log("error:", error)
    throw new ApiError(500, 'error in generating refresh and access token')
 }
   
}

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
const Login =asyncHandler(async (req, res)=>{
    /*
    take username, email, password
    check validation
    check if user a;ready present
    compare the password
    check
    generate acess and refreshtoken
    send cookies

    */

    const {email, username, password}=req.body

    if(!(email || username)){
        throw new ApiError(400,'username or password is required')
    }

    const user=await User.findOne({
        $or:[{email}, {username}]
    })
    if(!user){
        throw new ApiError(400, 'user does not exist')
    }

    const validPassword= await user.isPasswordCorrect(password)

    if(!validPassword){
        throw new ApiError(400, 'password incorrect')
    }

    const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser= await User.findOne(user._id).select('-refreshToken  -password')
    const options={
        httpOnly:true,
        secure:true
        
    }
    res.status(200)
    .cookie('accessToken',accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser, refreshToken, accessToken
            },
            'user logged in successfully'
        )
    )


})

const Logout=asyncHandler(async (req, res)=>{
    /*
    remove tokens
     */


    User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:null}},{new:true})
    const options={
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(new ApiResponse(200,{},'user loggedOut successfully'))



})
const RefreshedAccessToken= asyncHandler(async(req,res)=>{
    try{
const token= req.cookies?.refreshToken || req.body.refreshToken

    if(!token){
        throw new ApiError(400,'unauthorized error while generating refresh token')
    }

    const verifyToken=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

    if(!verifyToken){
         throw new ApiError(400,'unauthorized error while generating refresh token 2')
    }
    const user=await User.findById(verifyToken._id).select('-password -refreshToken')

    if(token !== user.refreshToken){
        throw new ApiError(400, 'token is expired or used')
    }

    const {accessToken, newRefreshToken}= generateAccessAndRefreshToken(user._id)
    const options={
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .cookie('accessToken' ,accessToken, options)
    .cookie('refreshToken' ,newRefreshToken, options)
    .json(new ApiResponse(200, {
        accessToken,
        refreshToken:newRefreshToken
    },'access token refreshed succesfullly'))

    }
    catch(error){
        console.log("error in refreshing access token " ,error)
        throw new ApiError(400, "error in refreshing access token ")
    }
    
})

const getCurrentUser=asyncHandler(async (req, res)=>{
    res.status(200)
    .json(new ApiResponse(200, req.user, 'current user fetched'))
})


export {
    Registration,
    Login,
    Logout,
    RefreshedAccessToken,
    getCurrentUser
    


}
