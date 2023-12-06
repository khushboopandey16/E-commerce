const express = require('express');
const app = express()
require("../Database/userData/config");
const userModal = require('../Database/userData/Signup')
const profileModal = require('../Database/userData/profile')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser')
const secretkey=process.env.SECRET_KEY

// user Login Function
exports.userLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        // console.log(email, password, "login")
        let loginEmail = await userModal.findOne({ email });
        // console.log(loginEmail)
        // let loginPassword = await userModal.findOne({ password });
        if (loginEmail) {
            bcrypt.compare(password, loginEmail.password, (error, result) => {
                if (error) {
                    return res.status(500).json({
                        status: "Failed",
                        message: error.message
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        expirytime: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: loginEmail._id
                    }, secretkey)

                    return res.status(200).cookie('token', token, {
                        // expirytime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        // maxAge: 60 * 60 * 1000,
                        // httpOnly: true,
                        httpOnly: true,
                        maxAge: (60 * 60 * 24 * 30) * 1000,
                    }
                    ).json({
                        status: "success",
                        name: loginEmail.name,
                        // email:loginEmail.email,
                        token,
                    })
                }
            })
        }
        else {
            res.status(404).json({
                status: "failed",
                message: "Please Enter valid Email or Password"
            })
        }
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            message: error.message
        })
    }
}
//user signup function
exports.usersignUp = async (req, res) => {
    try {
        let { name, email, phone, password } = req.body;
        // console.log(req.body)
        let authUser = await userModal.findOne({ email });
        if (authUser) {
            return res.status(404).json({
                status: "failed",
                message: "User already Exists"
            });
        }
        else {
            bcrypt.hash(password, 10, async (error, hash) => {
                if (error) {
                    return res.status(500).json({
                        status: "Failed",
                        message: error.message
                    })
                }
                else {
                    let signupUserData = await userModal.create({ name, email, phone, password: hash })
                    let response = await signupUserData.save();
                    const token = jwt.sign({
                        expirytime: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: signupUserData._id
                    }, secretkey)
                    return res.status(200).json({
                        status: "Success",
                        name, email, token,
                        response
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            message: error.message
        })
    }
}
// user profile function
exports.userProfile = async (req, res) => {
    try {
        // console.log(req.body)
        let userProfileData = new profileModal(req.body);
        let userResponse = await userProfileData.save();
        res.status(200).json({
            status: "success",
            userResponse
        });
    }
    catch (error) {
        res.status(401).json({
            status: "failed",
            message: error.message
        });
    }
}

//user logout

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).cookie('token', null, {
            expirytime: new Date(Date.now()),
            httpOnly: true
        }).json({
            status: "Success",
            message: "Loged out"
        })

    }
    catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}
exports.aboutUser = async (req, res) => {
    try {
        const reqUser = await userModal.findById(req.user.id)
        res.status(200).json({
            status: "success",
            // reqUser,
            name: reqUser.name,
            role: reqUser.role,
            email: reqUser.email,
            Phone: reqUser.phone

        })

    }
    catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}

exports.allUsers=async(req,res)=>{
    try{
   const users=await userModal.find()
   res.status(200).json({
    status:'success' ,
    users
  })
    }
    catch(error)
    {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
  
    }
}

//delete the user

exports.deleteUser=async(req,res)=>{
    try{
   const user=await userModal.findById(req.params.id)
   console.log(user)
   if(!user)
   {
    res.status(404).json({
        status:"Failed",
        message:" User Not Find By Requested Id!!"
    })
   }
    await userModal.findByIdAndRemove(req.params.id)
    res.status(200).json({
    status:'success' ,
    message:"User Deleted SuccessFully!!!"
  })
    }
    catch(error)
    {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
  
    }
}

//update the user
exports.updateRole=async(req,res)=>{
    try{
   const user=await userModal.findById(req.params.id)
   if(!user){
    res.status(404).json({
        status:"Failed",
        message:"Requested user Not Found!!!"
    })
   }
   user.role=req.body.role;
   user.name=req.body.name;
   user.email=req.body.email;
   user.phone=req.body.phone;
   await user.save({
    validateBeforeSave:false
   })
   res.status(200).json({
    status:'success',
  })
    }
    catch(error)
    {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
  
    }
}

//user detail for auto load
exports.userDetails=async(req,res)=>{
    try{
   const user=await userModal.findById(req.params.id)
   if(!user)
   {
    res.status(404).json({
     status:"Failed",
     message:"Requested User Not Found!!!"
    })
   }
   res.status(200).json({
    status:'success' ,
    user
  })
    }
    catch(error)
    {
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
  
    }
}


