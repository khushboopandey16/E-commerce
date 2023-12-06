const express = require('express');
const { createOrder, getSingleOrder, myOrderDetails, getAllorders, productStatus, deleteOrder } = require('../Response/orderResponse');
const { isAuthenticated, authorizedRole } = require('../middleware/userAuthentication');
const router = express.Router();


router.route('/createOrder').post(isAuthenticated, createOrder)
router.route('/getSingleorder/:id').get(isAuthenticated, getSingleOrder)
router.route('/myOrderdetails').get(isAuthenticated, myOrderDetails)
router.route('/getAllOrders').get(isAuthenticated, authorizedRole("admin"), getAllorders)
router.route('/product/status/admin/:id').put(isAuthenticated, authorizedRole("admin"), productStatus);
router.route('/deleteorder/:id').delete(isAuthenticated, authorizedRole("admin"), deleteOrder)
// router.route('/myorders').get(isAuthenticated,usermyOrders);
module.exports = router;