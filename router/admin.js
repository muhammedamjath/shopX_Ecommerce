const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin')

router.get('/', adminController.loginget)
router.post('/post', adminController.loginpost)

router.get('/dashboard', adminController.dashboardGet)
router.get('/catogory', adminController.catogoryGet)
router.post('/category',adminController.multer1, adminController.categoryPost)


router.get('/subCategory', adminController.getsubcategory)
router.post('/subCategory/:categoryId', adminController.postSubCategory)

router.get('/aadproduct', adminController.getaadProduct)
router.post('/postaddproduct', adminController.multerpost, adminController.postaddproduct)

router.get('/usersList', adminController.userlistget)
router.get('/showproduct', adminController.productlistget)

router.get('/todelete/:id', adminController.deleteitem)

router.get('/toedit/:id', adminController.editproduct)
router.post('/edititem/:editId', adminController.multerpost, adminController.postEdit)

router.get('/changeStatus/:id', adminController.changeStatus)
router.get('/status/:id', adminController.productStatus)

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