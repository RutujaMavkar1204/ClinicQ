import {verifyJWT} from '../middlewares/auth.middleware.js'
import {ListOfQueue} from '../controller.queue.controller.js'
import {Router} from express

const queueRouter=Router()

queueRouter.route('/queues').post(verifyJWT, ListOfQueue)

export default queueRouter;
