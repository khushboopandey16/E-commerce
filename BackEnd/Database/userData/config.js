const mongoose = require('mongoose')
const cloudinary=require('cloudinary').v2
mongoose.connect('mongodb+srv://khushboobansalbist2000:khushboo16@cluster0.tmlf74s.mongodb.net/')
cloudinary.config({ 
      cloud_name:process.env.CLOUD_NAME, 
      api_key:process.env.API_KEY, 
      api_secret:process.env.API_SECRET 
})