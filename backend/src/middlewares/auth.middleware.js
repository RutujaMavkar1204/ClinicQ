import asyncHandler  from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'

const verifyJWT=asyncHandler(async(req, res, next)=>{
    try{
    const token =await  req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', "")

    if(!token){
        throw new ApiError(400,"unauthorized error 1")
    }

    const verifyToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if(!verifyToken){
        throw new ApiError(400,"unauthorized error 2")
    }

    const user =await User.findById(verifyToken._id).select('-refreshToken -password')
    if(!user){
            throw new ApiError(400, "Invalid access token")
        }
     req.user=user
     next()
    }
    catch(error){
        console.log('error in authentication', error)
        throw new ApiError(400,"error in authentication")
    }
    

})

export {verifyJWT}