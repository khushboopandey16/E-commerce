const mongoose = require('mongoose')
const userProfile = mongoose.Schema({
    username: String,
    usercontact: Number,
    useraddress: String,
    userlandmark: String,
    userpincode: Number,
    usercity: String,
    userstate: String
});
module.exports = mongoose.model('profile', userProfile);