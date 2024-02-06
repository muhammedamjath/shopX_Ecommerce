const express=require('express')
const router=express.Router()
const usercontroller=require('../controller/user')

router.get('/home',usercontroller.homeget)



module.exports=router 