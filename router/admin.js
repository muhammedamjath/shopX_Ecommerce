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

router.get('/usersList',adminController.userlistget)
router.get('/showproduct',adminController.productlistget)

router.get('/todelete/:id',adminController.deleteitem)

router.get('/toedit/:id',adminController.editproduct)
router.post('/edititem/:editId',adminController.multerpost,adminController.postEdit)

router.get('/changeStatus/:id',adminController.changeStatus)


module.exports=router