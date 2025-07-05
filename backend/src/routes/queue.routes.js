import {Router} from 'express'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {makeAppointmentList, appointment,doctorsList,getTodaysAppointment,particularDateAppointment, existedClinic, getAllAppointments, doctorDetail,patientDetail, listOfPatient, queueCreatedByDoctor, } from '../controller/queue.controller.js'


const queueRouter=Router()

queueRouter.route('/doctorDetail').post(verifyJWT,doctorDetail)
queueRouter.route('/queueCreatedByDoctor').post(verifyJWT,queueCreatedByDoctor)
queueRouter.route('/doctorsList').post(doctorsList)
queueRouter.route('/appointment').post(verifyJWT,appointment)
queueRouter.route('/getAllAppointments').post(verifyJWT,getAllAppointments)
queueRouter.route('/existedClinic').post(verifyJWT,existedClinic)
queueRouter.route('/makeAppointmentList').post(verifyJWT,makeAppointmentList)
queueRouter.route('/getTodaysAppointment').post(verifyJWT,getTodaysAppointment)
queueRouter.route('/particularDateAppointment').post(verifyJWT,particularDateAppointment)

queueRouter.route('/patientDetail').post(verifyJWT, patientDetail)
queueRouter.route('/listOfPatient').post(verifyJWT, listOfPatient)

export default queueRouter;
