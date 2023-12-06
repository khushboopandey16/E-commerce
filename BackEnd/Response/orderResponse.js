const express = require('express');
const app = express();
require('../Database/userData/config')
const userModal = require('../Database/userData/Signup');
const orderModal = require('../Database/ProductData/order')
const ProductModal = require('../Database/ProductData/ProductDataAdmin')



// creating order


exports.createOrder = async (req, res) => {
    try {
        const { 
            shippingAddress,
            orderProduct,
            productPrice,
            vatPrice,
            shippingPrice,
            totalPrice,
            orderStatus,
            deliveryDate,
            paymentInformation
        } = req.body;
        const order = await orderModal.create({
            shippingAddress,
            orderProduct,
            user: req.user._id,
            paymentInformation,
            paidAtDate: Date.now(),
            productPrice,
            vatPrice,
            shippingPrice,
            totalPrice,
            orderStatus,
            deliveryDate
        });
        res.status(200).json({
            status: "Success",
            order
        })


    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
}


// get signle order info

exports.getSingleOrder = async (req, res) => {
    try {
        const order = await orderModal.findById(req.params.id).populate("user", "name email phone");
        if (!order) {
            res.status(404).json({
                status: "Failed",
                message: "Requested order Not Found !!"
            });
        }
        res.status(200).json({
            status: "Success",
            order
        })

    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })

    }
}


// my orders

exports.myOrderDetails = async (req, res) => {
    try {
        const orders = await orderModal.find({ user: req.user._id })
        if (!orders) {
            return res.status(404).json({
                status: "Failed",
                message: "No orders !!"
            });
        }
        res.status(200).json({
            status: "Success",
            orders
        })
    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
}



// get all orders for admin

exports.getAllorders = async (req, res) => {
    try {
        const orders = await orderModal.find();
        let totalOrderPrice = 0;
        orders.forEach((ele) => {
            totalOrderPrice += ele.totalPrice;
        });
        res.status(200).json({
            status: "Success",
            totalOrderPrice,
            orders
        });

    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        });
    }
}


//update order status

exports.productStatus = async (req, res) => {
    try {
        const Order = await orderModal.findById(req.params.id)
        if (!Order) {
            return res.status(404).json({
                status: "Failed",
                message: "Product Not Found !!"
            });
        }
        if (Order.orderStatus === "delivered") {
            return res.status(500).json({
                status: "Failed",
                message: "Product already delievred"
            })
        }
        if (Order.orderStatus === "shipped") {
            Order.orderProduct.forEach(async (ele) =>
                await updateStock(ele.qunatity, ele.product)//helper function to update stock
            )
        }
        Order.orderStatus = req.body.status;
        if (req.body.status === "delivered") {
            Order.deliveryDate = Date.now();
        }
        await Order.save();
        res.status(200).json({
            status: "Success"
        });
    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        });
    }
}

//helper function
async function updateStock(qunatity, productId) {
    const product = await ProductModal.findById(productId);
    if (product.stock > qunatity) {
        product.stock -= qunatity;
        await product.save();
    }
}




// deleting the order

exports.deleteOrder = async (req, res) => {
    try {
        let order = await orderModal.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                status: "Failed",
                message: "No orders !!"
            });
        }
        order = await orderModal.findByIdAndRemove(req.params.id)
        res.status(200).json({
            status:'success',
            message: "order deleted susscessfully !!"
        })

    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        });
    }
}