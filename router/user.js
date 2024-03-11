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

router.get('/cart',usercontroller.cartget)
router.post('/addToCart/:id',usercontroller.createcart)
router.post('/quantity/:id/:quantity',usercontroller.updateCount)
router.delete('/delcartItem/:id',usercontroller.delcartItem)

router.get('/getprofile',usercontroller.getprofile)
router.get('/Editprofile',usercontroller.completeprofile)
router.post('/postProfile',usercontroller.multer1,usercontroller.postprofile)

router.get('/checkout/:id',usercontroller.checkoutget)

router.post('/coupon/:id',usercontroller.applycoupon)
router.post('/checkout',usercontroller.checkoutPost)




module.exports=router 