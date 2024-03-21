const express=require('express')
const router=express.Router()
const usercontroller=require('../controller/user')
const wishlistcontroller=require('../controller/wishlist')
const cartcontroller=require('../controller/cart')
const userProfile=require('../controller/userProfile')
const checkoutController=require('../controller/checkout')


router.get('/home',usercontroller.homeget)

router.get('/showallproduct',usercontroller.getallproduct)

router.get('/singleproduct/:id',usercontroller.getsingleproduct)

router.get('/categoryproduct/:name',usercontroller.getcatProduct)

router.get('/wishlist',wishlistcontroller.getwishlist)
router.post('/passIdtoAxios/:id',wishlistcontroller.postToWishlist)
router.delete('/deletecardwish/:id',wishlistcontroller.removeFromWishlist)

router.get('/cart',cartcontroller.cartget)
router.post('/addToCart/:id',cartcontroller.createcart)
router.post('/quantity/:id/:quantity',cartcontroller.updateCount)
router.delete('/delcartItem/:id',cartcontroller.delcartItem)

router.get('/getprofile',userProfile.getprofile)
router.get('/Editprofile',userProfile.completeprofile)
router.post('/postProfile',userProfile.multer1,userProfile.postprofile)

router.get('/checkout/:id',checkoutController.checkoutget)
router.post('/coupon/:id',checkoutController.applycoupon)
router.post('/checkout',checkoutController.checkoutPost)

router.get('/peyment',usercontroller.peymentget)
router.post('/peymentpost',usercontroller.peymentppost)
router.get('/ordercomplete/:data',usercontroller.completeOrderGet)

router.get('/orderhistory',usercontroller.orderHistoryGet)
router.get('/historySingleGet/:id',usercontroller.singleHistoryGet)

router.put('/cancellOrder/:id',usercontroller.cancellorder)

router.post('/review',usercontroller.review)

router.get('/logout',usercontroller.logout)

 

module.exports=router 