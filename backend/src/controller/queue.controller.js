import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import {Queue} from '../models/queue.model.js'
import {Doctor} from '../models/doctor.model.js'
import {User} from '../models/user.model.js'
import {Patient} from '../models/patient.model.js'
import {Appointment} from '../models/appointment.model.js'
import {PatientQueue} from '../models/patientQueue.model.js'
import mongoose from 'mongoose'

const queueCreatedByDoctor=asyncHandler(async(req,res)=>{
    
    const {clinicName, specialization, degree, experience, workingStart, workingEnd, breakStart, breakEnd , workingDays} =req.body
    const userId=req.user._id
    const timing={
        working:{
            start:workingStart,
            end:workingEnd
        },
        break:{
            start:breakStart,
            end:breakEnd
        }
    }
     let slot = [];
  const slots = () => {

  const toMinutes = (timeStr) => {
    const [hour, min] = timeStr.split(':').map(Number);
    return hour * 60 + min;
  };

  const toHHMM = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const workStart = toMinutes(timing.working.start);
  const workEnd = toMinutes(timing.working.end);
  const breakStart = toMinutes(timing.break.start);
  const breakEnd = toMinutes(timing.break.end);

  for (let i = workStart; i < workEnd; i += 60) {  
    if (i >= breakStart && i < breakEnd) {
      continue;  
    }
    slot.push(toHHMM(i));
 }
 
  return slot;
 
};

slots()

    if([clinicName, specialization, degree].some((fields)=>{
       fields?.trim()==""
    })){
        throw new ApiError(400,'All fields are compulsary')
    }
    if(!experience || !timing){
        throw new ApiError(400,'All fields are compulsary')
    }

    const existedDoctor=await Doctor.findOne(userId)
    if(existedDoctor){
        throw new ApiError(400,'doctor already exists')
    }

    const createDetail=await Doctor.create({
      user:userId, clinicName, specialization, degree, experience, timing:timing , workingDays, slots:slot
    })

    const doctor=await Doctor.findById(createDetail._id)

    if(!doctor){
        throw new ApiError(500,'Something went wrong')
    }

    const userInfo = await Doctor.aggregate([
    {
        $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
        }
    },
    {$addFields:{
        userInfo:{
            $arrayElemAt:['$userInfo',0]
        }
    } },
        {
        $match: { _id: doctor._id }
    },
    ]);

    return res.status(200).json(new ApiResponse(200, userInfo[0], 'a queue is created'))
})

const doctorsList=asyncHandler(async(req,res)=>{
    const list= await Doctor.aggregate([
    {
        $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
        }
    },
    {$addFields:{
        userInfo:{
            $arrayElemAt:['$userInfo',0]
        }
    } },
    ]);
    res.status(200)
    .json(new ApiResponse(200,list,'list of queue fetched successfully'))
})

const doctorDetail=asyncHandler(async(req,res)=>{
 const {_id}=req.body
 const userInfo = await Doctor.aggregate([
    {
        $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
        }
    },
    {$addFields:{
        userInfo:{
            $arrayElemAt:['$userInfo',0]
        }
    } },
        {
        $match: { _id:new mongoose.Types.ObjectId(_id)}
    },
    ]);
    if(!userInfo){
        throw new ApiError(400,'doctor already exists')
    }
 res.status(200).json(new ApiResponse(200,userInfo, 'this is detail about doc'))
})

const makeAppointmentList= asyncHandler(async(req,res)=>{

  const startDate = parseInt(new Date().toISOString().split('T')[0].split('-')[2], 10);
  const getMaxDate = new Date();
  getMaxDate.setDate(getMaxDate.getDate() + 7);
  const endDate = parseInt(getMaxDate.toISOString().split('T')[0].split('-')[2], 10);

  const { _id } = req.body;
  const doctor = await Doctor.findById(_id);
  const slots = doctor.slots;

  const arr = [];

  for (let i = startDate; i < endDate; i++) {
    for (let j = 0; j < slots.length; j++) {
      arr.push({ key: i, value: slots[j] });
    }
  }

  let app = await Appointment.findOne({ doctor: _id });
  if (app) {
   if(await Appointment.findOne({ 
    doctor: _id,
    arr: { $elemMatch: { key: endDate } }
    })){
   }
   else{
    console.log("iuytdrfxcvbnkihh")
     for (let j = 0; j < slots.length; j++) {
      await app.arr.push({ key: endDate, value: slots[j] })
    }
    await app.save();
   }
  } else {
    app = await Appointment.create({ doctor: _id, arr: arr });
  }

  res.status(200).json(new ApiResponse(200, app, 'Appointment list processed'));

})
const appointment=asyncHandler(async(req,res)=>{
 const{date,appointment, _id}=req.body
 const userName=req.user.fullName
 
const patient=await PatientQueue.create({patientName:userName, date, appointment, doctor:_id } )

    
 let onlyDate=date
             onlyDate=onlyDate.split('-')[2]
             onlyDate = parseInt(onlyDate, 10);
            
const doc=await Appointment.findOne({doctor:_id})

if(!doc){
    throw new ApiError(400,'cant schedule an appointment')
}

const delArr = await Appointment.updateOne(
  { doctor: _id },  
  { $pull: { arr: { key: onlyDate, value: appointment } } }
);

if(!delArr){
    throw new ApiError(400,'cant schedule an appointment')
}

res.status(200).json(new ApiResponse(200, {delArr,patient}, 'slot deleted'))

})

const getAllAppointments=asyncHandler(async(req,res)=>{
const _id=req.body


const doc=await Doctor.findOne({user:_id})

const id=doc._id

const list=await PatientQueue.find({doctor:id})
     return res.status(200).json(new ApiResponse(200,list,'patient queue'))

})

const getTodaysAppointment=asyncHandler(async(req,res)=>{
    const _id=req.user._id
    const date=new Date().toISOString().split('T')
    console.log(date)

const doc=await Doctor.findOne({user:_id})

const id=doc._id

const list=await PatientQueue.find({doctor:id, date:date })
     return res.status(200).json(new ApiResponse(200,list,'patient queue'))


})

const particularDateAppointment=asyncHandler(async(req,res)=>{
    const {date}=req.body
     const _id=req.user._id
    const doc=await Doctor.findOne({user:_id})
    const id=doc._id

const list=await PatientQueue.find({doctor:id, date:date })
     return res.status(200).json(new ApiResponse(200,list,'patient queue'))

})

const existedClinic=asyncHandler(async(req,res)=>{
   
  const {_id}=req.body
  let isClinicPresent=false
    const existedClinic=await Doctor.findOne({user:_id})
    if(!existedClinic){
       
    }
    else{
        isClinicPresent=true
    }
     return res.status(200).json(new ApiResponse(200,isClinicPresent,'patient is added in queue'))

}
)
const patientDetail=asyncHandler(async(req,res)=>{
    const {phoneNumber}=req.body
    const userId=req.user._id
        const existedPatient=await Patient.findOne({
        $or:[{phoneNumber},]
    })
    
    if(existedPatient){
        throw new ApiError(400, 'patient already exists')
    }

    const patient=await Patient.create({
        phoneNumber, userDetail:userId
    })
    
    const createdPatient=await Patient.findById(patient._id)
    if(!createdPatient){
        throw new ApiError(400, 'patient does not exist')
    }
   
    const patientDetail=await Patient.aggregate([
        {
            $match:{_id:createdPatient._id}
        },
        {
            $lookup:{
                from:'users',
                localField:'userDetail',
                foreignField:'_id',
                as:'userDetail'
            }
        },
        {
            $addFields:{
                userDetail:{
                    $arrayElemAt:['$userDetail',0]
                }
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,{patientDetail,appointmentDetail},'patient is added in queue'))


})

const listOfPatient=asyncHandler(async(req, res)=>{
     const patientDetail=await Patient.aggregate([
        {
            $lookup:{
                from:'users',
                localField:'userDetail',
                foreignField:'_id',
                as:'userDetail'
            }
        },
        {
            $addFields:{
                userDetail:{
                    $arrayElemAt:['$userDetail',0]
                }
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,patientDetail,'patient is added in queue'))



})
export {
  doctorDetail,
  queueCreatedByDoctor,
  doctorsList,
  patientDetail,
  listOfPatient,
  makeAppointmentList,
  appointment,
  existedClinic,
  getAllAppointments,
  getTodaysAppointment,
  particularDateAppointment
}