const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const bodyparser=require('body-parser')
const fileupload=require('express-fileupload');
const cloudinary=require('cloudinary')
require('dotenv').config({path:'config/config.env'})
//  app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyparser.urlencoded({
    extended:true
}))
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY, 
    api_secret:process.env.API_SECRET

})
app.use(express.json());
app.use(fileupload());
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const route = require('./Routes/userroutes')
const productRoute = require('./Routes/ProductRoute')
const orderRoute = require('./Routes/orderRoute')
const paymentRoute=require('./Routes/paymentRoute')




app.use('/api/v1', route)
app.use('/api/v1', productRoute);
app.use('/api/v1', orderRoute)
app.use('/api/v1',paymentRoute)
app.listen(8081, () => { console.log("post listening at 8081") });