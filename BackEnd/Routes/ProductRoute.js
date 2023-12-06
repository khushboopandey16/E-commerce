const express = require('express');
const { addProduct, getAllProduct, UpdateProduct, removeProduct, productDetails, productReview, getAllReviews, deleteReview,getAllProductList } = require('../Response/productResponse');
const { isAuthenticated, authorizedRole } = require('../middleware/userAuthentication');
const router = express.Router();
const {fileUploads}=require ('../middleware/multer')


//creating routes for product
router.route('/addProduct').post(isAuthenticated, authorizedRole("admin"), addProduct);
router.route('/getallProduct').get(getAllProduct);
router.route('/getallProduct/admin').get(isAuthenticated,authorizedRole("admin"),getAllProductList);
router.route('/updateProduct/:id').put(isAuthenticated, authorizedRole("admin"), UpdateProduct)
router.route('/productDetail/:id').get(productDetails)
router.route('/deleteProduct/:id').delete(isAuthenticated, authorizedRole("admin"), removeProduct)
router.route('/ProductReview').post(isAuthenticated, productReview)
router.route('/getAllReviews').get(isAuthenticated, getAllReviews);
router.route('/deleteReview').delete(isAuthenticated, deleteReview)
module.exports = router;