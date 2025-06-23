import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import {Queue} from '../models/queue.model.js'
import {User} from '../models/user.model.js'
import {Patient} from '../models/patient.model.js'

const ListOfQueue=asyncHandler(async(req,res)=>{
    console.log("BODY:", req.body);
    const {queueName,clinicName, queueLength, nurseName, startTime, endTime, specialization} =req.body
    console.log(req.user?.fullName)
    const doctorname=req.user?.fullName

    if([queueName,clinicName, queueLength, nurseName, startTime, endTime, specialization].some((fields)=>{
        fields?.trim==""
    })){
        throw new ApiError(400,'All fields are compulsary')
    }

    const existedQueue=await Queue.findOne({
        $or:[{clinicName}, {queueName}, {nurseName}]
    })
    if(existedQueue){
         throw new ApiError(400,'Queue already present')
    }

    const createQueue=await Queue.create({
        queueName, doctorName:doctorname,clinicName, queueLength, nurseName, startTime, endTime, specialization
    })

    const queue=await Queue.findById(createQueue._id)

    if(!queue){
        throw new ApiError(500,'Something went wrong')
    }

    return res.status(200).json(new ApiResponse(200, queue, 'a queue is created'))
})

const queueOfPatients=asyncHandler(async(req,res)=>{
    const {age, gender, phoneNumber }=req.body
    const userId=req.user._id

    if([age, gender, phoneNumber].some((fields)=>{fields.trim==""})){
        throw new ApiError(400,'all fields are necessary')
    }

    const existedPatient=await Patient.findOne(userId)
    
    if(existedPatient){
        throw new ApiError(400, 'patient already exists')
    }

    const patient=await Patient.create({
        age, gender, phoneNumber, userDetail:userId
    })
    
    const createdPatient=await Patient.findById(patient._id)
    if(!createdPatient){
        throw new ApiError(400, 'patient does not exist')
    }
    const user=createdPatient.populate('userDetail')
    return res.status(200).json(new ApiResponse(200,{createdPatient, user},'patient is added in queue'))


})
export {
  ListOfQueue,
  queueOfPatients
}