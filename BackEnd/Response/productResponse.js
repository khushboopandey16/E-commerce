const express = require('express');
const app = express();
require("../Database/userData/config");
const userModal = require('../Database/userData/Signup')
const ProductModal = require("../Database/ProductData/ProductDataAdmin");
const cloudinary=require('cloudinary')
const Features=require('../utils/features')




//adding product
exports.addProduct = async (req, res) => {
// console.log(req.body.Image)
    try {
        let images=[];
        let cloudLinks=[]
        if(typeof req.body.Image==='string')
        {
            images.push(req.body.Image)
        }
        else{
            images=req.body.Image;
        }
        // console.log(images,'checking images array')
        console.log(process.env.API_KEY,'checking api key');
        for(let i=0;i<images.length;i++)
        {
        const responseLinks= await cloudinary.v2.uploader.upload(images[i],{
            folder:'ProductsImages'
        })
        // console.log(responseLinks,'checking res')
        cloudLinks.push({
            public_id:responseLinks.public_id,
            url:responseLinks.secure_url
        })
        }
        // console.log(cloudLinks,'checking links ')
        req.body.Image=cloudLinks
   console.log(req.body)
        req.body.user = req.user.id
        const product = new ProductModal(req.body);
        // console.log(product)
        const Response = await product.save();
        res.status(200).json({
            satus: "Success",
            Response
        })

    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
}

//getting  all product
exports.getAllProduct = async (req, res) => {
    try {
        console.log('random ',req.query)
        let itemperpage=8;
        // let totalproduct=await ProductModal.countDocuments()
        let features=new Features(ProductModal.find(),req.query).search();
        // console.log(features,'features log')
        const ProductData = await features.query;
        console.log(ProductData,'finding product')
        res.status(200).json({
            status: "Success",
            ProductData
        });
    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }

}

//Updating the product

exports.UpdateProduct = async (req, res) => {
    try {
        let ProductId = req.params.id;
        let Product = await ProductModal.findById(ProductId);
        if (!Product) {
            return res.status(400).json({
                status: "Failed",
                message: "Requested Product not Found !!"
            })
        }
        Product = await ProductModal.findByIdAndUpdate(ProductId, req.body, { new: true, runValidators: true, useFindAndModify: false })
        res.status(200).json({
            status: "Success",
            Product
        })

    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
}


// product details

exports.productDetails = async (req, res) => {
    try {
        let ProductId = req.params.id;
        let Product = await ProductModal.findById(ProductId);
        if (!Product) {
            return res.status(400).json({
                status: "Failed",
                message: "Requested Product not Found !!"
            })
        }
        res.status(200).json({
            status: "Success",
            Product
        })
    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
}

// deleting the product
exports.removeProduct = async (req, res) => {
    try {
        // let ProductId = req.params.id;
        let Product = await ProductModal.findById(req.params.id)
        if (!Product) {
            return res.status(500).json({
                status: "Failed",
                message: "Requested Product not found !!",
            });
        }
        for (let i = 0; i <Product.Image.length; i++) {
            await cloudinary.v2.uploader.destroy(Product.Image[i].public_id);
          }
        Product = await ProductModal.findByIdAndRemove(Product);
        res.status(200).json({
            status: "Success",
            message: "Product deleted Successfully !",
        });
    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
};


//customer review for product
exports.productReview = async (req, res) => {
    try {
        let { rating, feedback, ProductId } = req.body;
        let review = {
            user: req.user._id,
            name: req.user.name,
            rating: rating,
            feedback: feedback
        }
        const Product = await ProductModal.findById(ProductId);
        const isReviewed = Product.customerReview.find((reviw) =>
        reviw.user.toString() == req.user._id.toString()
        )
        //checking if user exists
        if (isReviewed) {
            Product.customerReview.find((reviw) => {
                if (reviw.user.toString() == req.user._id.toString()) {
                    reviw.rating = rating,
                        reviw.feedback = feedback
                }
            });
        }
        else {
            //pushing review into array of objects
            Product.customerReview.push(review);
        }
        Product.reviewCount = Product.customerReview.length;
        //counting average of rating
        let average = 0;
        let totalRatings = 0;
        let reviewCount = Product.customerReview.length;
        Product.customerReview.forEach((ele => {
            totalRatings += ele.rating;
        }));
        average = parseFloat(totalRatings / reviewCount).toFixed(2);
        Product.rating = average
        await Product.save();
        res.status(200).json({
            status: "Success",
            Product
        })

    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message,
        })
    }
}

// to get all reviews

exports.getAllReviews = async (req, res) => {
    try {
        const ProductId = req.query.id;
        const Product = await ProductModal.findById(ProductId);
        if (!Product) {
            return res.status(400).json({
                status: "Failed",
                message: "Product Not Found !!"
            });
        }
        return res.status(200).json({
            status: "Success",
            customerReview: Product.customerReview,
        });
    }
    catch (e) {
        res.satus(400).json({
            status: "Failed",
            message: e.message,
        });
    }
}

// delete review

exports.deleteReview = async (req, res) => {
    try {
        const ProductId = req.query.productId;
        const Product = await ProductModal.findById(ProductId);
        if (!Product) {
            return res.status(400).json({
                status: "Failed",
                message: "Product Not Found !!"
            });
        }
        const customerReview = Product.customerReview.filter((rev) =>
            rev_id.toString() !== req.query.id.toString()
        )
        let average = 0;
        let totalRatings = 0;
        let reviewCount = Product.customerReview.length;
        Product.customerReview.forEach((ele => {
            totalRatings += parseInt(ele.rating);
        }));
        average = parseFloat(totalRatings / reviewCount).toFixed(2);
        Product.rating = average
        await ProductModal.findByIdAndUpdate(ProductId, {
            customerReview,
            reviewCount,
            average
        }, {
            new: true,
            runValidators: false,
            useFindAndModify: false
        });
        res.status(200).json({
            status: "Success",
            message: "Review Deleted",
            Product
        })

    } catch (e) {
        res.satus(400).json({
            status: "Failed",
            message: e.message,
        });
    }
} 

//admin product view
exports.getAllProductList = async (req, res) => {
    try {
        const ProductData = await ProductModal.find();
        res.status(200).json({
            status: "Success",
            ProductData
        });
    }
    catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }

}

