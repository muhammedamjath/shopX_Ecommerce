const express=require('express')
const router=express.Router()
const adminController=require('../controller/admin')

router.get('/',adminController.loginget)
router.post('/post',adminController.loginpost)
router.get('/dashboard',adminController.dashboardGet)
router.get('/catogory',adminController.catogoryGet)
router.post('/category',adminController.categoryPost)

module.exports=router