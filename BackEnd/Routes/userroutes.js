const express = require('express');
const { userLogin, usersignUp, userProfile, logoutUser, aboutUser,allUsers,deleteUser,updateRole,userDetails } = require('../Response/UserResponse');
const { isAuthenticated,authorizedRole} = require('../middleware/userAuthentication');
const router = express.Router();


//route creation

router.route('/login').post(userLogin);
router.route('/signup').post(usersignUp);
router.route('/profile').post(isAuthenticated, userProfile);
router.route('/about/user').get(isAuthenticated, aboutUser)
router.route('/logout').get(logoutUser);
router.route('/admin/allusers').get(isAuthenticated,authorizedRole('admin'), allUsers)
router.route('/admin/user/delete/:id').delete(isAuthenticated,authorizedRole('admin'), deleteUser)
 router.route('/admin/user/details/:id').get(isAuthenticated,authorizedRole ('admin'), userDetails)
 router.route('/admin/user/update/:id').put(isAuthenticated,authorizedRole('admin'),updateRole)

module.exports = router;
