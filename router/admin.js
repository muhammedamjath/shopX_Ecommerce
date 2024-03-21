const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin')
const productcontroller=require('../controller/addproduct')

router.get('/', adminController.loginget)
router.post('/post', adminController.loginpost)

router.get('/dashboard', adminController.dashboardGet)
router.get('/getgraph',adminController.graphget)
router.get('/catogory', adminController.catogoryGet)
router.post('/category',adminController.multer1, adminController.categoryPost)


router.get('/subCategory', adminController.getsubcategory)
router.post('/subCategory/:categoryId', adminController.postSubCategory)

router.get('/aadproduct', productcontroller.getaadProduct)
router.post('/postaddproduct', productcontroller.multerpost, productcontroller.postaddproduct)

router.get('/usersList', adminController.userlistget)
router.get('/showproduct', productcontroller.productlistget)

router.get('/todelete/:id', productcontroller.deleteitem)

router.get('/toedit/:id', productcontroller.editproduct)
router.post('/edititem/:editId', productcontroller.multerpost, productcontroller.postEdit)

router.get('/changeStatus/:id', adminController.changeStatus)
router.get('/status/:id', productcontroller.productStatus)

router.get('/banner',adminController.bannerget)
router.post('/banner',adminController.multer1,adminController.bannerpost)
router.get('/deletebanner/:id',adminController.deletebanner)
router.get('/bannerstatus/:id',adminController.bannerstatus)

router.delete('/deletecategory/:id',adminController.deletecategory)
router.delete('/delcategory/:id',adminController.delcategory)
router.delete('/deletesubcat/:id',adminController.subdelete)

router.get('/coupon',adminController.couponget)
router.post('/coupon',adminController.couponpost)

router.get('/orders',adminController.orderslist)
router.get('/changeOrderStatus/:userId/:orderId',adminController.getsingleorder)

router.put('/statusupdate',adminController.statusupdate)

module.exports = router