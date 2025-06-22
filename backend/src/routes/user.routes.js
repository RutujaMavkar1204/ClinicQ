import {Router} from 'express'
import {Registration, Login, Logout, RefreshedAccessToken} from '../controller/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router=Router()

router.route('/register').post(upload.fields([{
    name:'photo',
    maxCount:1
}]),Registration)

router.route('/login').post(Login)
router.route('/logout').post(verifyJWT,Logout)
router.route('/refresh-token').post(RefreshedAccessToken)

export default router;