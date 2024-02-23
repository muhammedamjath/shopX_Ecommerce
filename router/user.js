const express=require('express')
const router=express.Router()
const usercontroller=require('../controller/user')

router.get('/home',usercontroller.homeget)
router.get('/showallproduct',usercontroller.getallproduct)
router.get('/singleproduct/:id',usercontroller.getsingleproduct)
router.get('/categoryproduct/:name',usercontroller.getcatProduct)
router.get('/wishlist',usercontroller.getwishlist)
router.post('/passIdtoAxios/:id',usercontroller.postToWishlist)
router.delete('/deletecardwish/:id',usercontroller.removeFromWishlist)



module.exports=router 