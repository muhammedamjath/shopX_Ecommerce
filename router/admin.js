const express=require('express')
const router=express.Router()
const adminController=require('../controller/admin')

router.get('/',adminController.loginget)
router.post('/post',adminController.loginpost)
router.get('/dashboard',adminController.dashboardGet)
router.get('/catogory',adminController.catogoryGet)
router.post('/category',adminController.categoryPost)
router.get('/subCategory',adminController.getsubcategory)
router.post('/subCategory/:categoryId',adminController.postSubCategory)
router.get('/aadproduct',adminController.getaadProduct)
router.post('/postaddproduct',adminController.multerpost,adminController.postaddproduct)




module.exports=router