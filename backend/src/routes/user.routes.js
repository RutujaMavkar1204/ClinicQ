import {Router} from 'express'
import {Registration} from '../controller/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'

const router=Router()

router.route('/register').post(upload.fields([{
    name:'photo',
    maxSize:1
}]),Registration)

export default router;