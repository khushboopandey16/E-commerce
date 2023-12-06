const userModal = require('../Database/userData/Signup')
const jwt = require('jsonwebtoken')
const secretkey=process.env.SECRET_KEY
exports.isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // console.log(token)
        if (!token) {
            return res.status(401).json({
                status: "Failed",
                message: "Please login to access this page"
            })
        }
        const verfiedData = jwt.verify(token, secretkey);
        // console.log(verfiedData);
        // console.log(verfiedData.data);
        req.user = await userModal.findById(verfiedData.data);
        next();

    }
    catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}

exports.authorizedRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(res.status(404).json({
                status: "Failed",
                message: `Role ${req.user.role} is not allowed to access this page`
            }))
        }
        next();
    }

}
