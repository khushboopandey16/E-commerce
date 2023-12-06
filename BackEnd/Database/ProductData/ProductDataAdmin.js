const mongoose = require('mongoose')
const productAdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"]
    },
    brand: {
        type: String,
        required: [true, "Please Enter Brand Name"]
    },
    category: {
        type: String,
        required: [true, "Please Add Product Category"]
    },
    price: {
        type: String,
        required: [true]
    },
    offerPrice: {
        type: Number,
        required: [true]
    },
    Image: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    ratings: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, "Please Add Product Description"]
    },
    stock: {
        type: Number,
        required: true,
        maxLength: [3],
        default: 1
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    customerReview: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                required: true
            },
            name: {
                type: String,
            },
            rating: {
                type: Number,
            },
            feedback: {
                type: String,
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model("productData", productAdminSchema);
