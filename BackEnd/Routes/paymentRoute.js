const express=require('express')
const router=express.Router()
const {PaymentProcess,stripeApikeySend} =require('../Response/paymentResponse')
const { isAuthenticated, authorizedRole } = require('../middleware/userAuthentication');

router.route('/payment/process').post(isAuthenticated,PaymentProcess)
router.route('/stripeApikey').get(isAuthenticated,stripeApikeySend)
module.exports=router;