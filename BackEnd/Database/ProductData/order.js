const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    shippingAddress: {
        name:{type:String,required:true},
        address: { type: String, require: true },
        city: { type: String, required: true },
        landmark: { type: String, required: true },
        pincode: { type: Number, required: true },
        phone: { type: Number, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true, default: "India" }
    },
    orderProduct: [{
        name: { type: String, required: true },
        price: { type:Number, required: true },
        qunatity: { type: Number, required: true },
        image: { type: String, required: true },
        product: { type: mongoose.Schema.ObjectId, ref: "productData"}

    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    paymentInformation: {
        id: { type: String, required: true },
        status: { type: String, required: true },
    },
    paidAtDate: { type: Date, required: true },
    productPrice: { type: Number, required: true },
    vatPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: { type: String, required: true, default: "In Process" },
    deliveryDate: { type: Date, required: true, default: Date.now() }
});
module.exports = mongoose.model('order', orderSchema)