const express=require('express')
const router=express.Router()
const usercontroller=require('../controller/user')

router.get('/home',usercontroller.homeget)
// router.get('/showallproduct',usercontroller.getallproduct)



module.exports=router 