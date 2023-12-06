const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    role: {
        type: String,
        default: "user"
    },
    createdAt:{
        type:Date,
        default:Date.now
      }
});
module.exports = mongoose.model('users', userSchema);