const express=require('express')
const router=express.Router()
const controller=require('../controller/common')

router.get('/',controller.commonHome)
router.get('/common/login',controller.loginget)
router.get('/common/signup',controller.signupget)
router.post('/signup',controller.signupPost)
router.get('/otp',controller.getOtp)
router.post('/otp',controller.otpPost)
router.get('/otpInvalid',controller.otpInvalid)
router.post('/login',controller.loginpost)




module.exports=router