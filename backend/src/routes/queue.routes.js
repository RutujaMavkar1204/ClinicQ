import {Router} from 'express'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {ListOfQueue,queueOfPatients} from '../controller/queue.controller.js'


const queueRouter=Router()

queueRouter.route('/queuesList').post(verifyJWT,ListOfQueue)
queueRouter.route('/patientList').post(verifyJWT, queueOfPatients)

export default queueRouter;
