const stripe=require('stripe')(`${process.env.STRIPE_SECRETKEY}`)



exports.PaymentProcess=async(req,res)=>{
try{
const payment=await stripe.paymentIntents.create({
    amount:req.body.amount,
    currency:'inr',
    metadata:{
        company:"khushBeauty"  
    }
})
res.status(200).json({
    status:"success",
    client_secret:payment.client_secret
})
}
catch(error){
    res.status(401).json({
        status: "failed",
        message: error.message
    })
}
}

exports.stripeApikeySend=async(req,res)=>{
    try{

        res.status(200).json({
            status:"success",
            stripeapikey:`${process.env.STRIPE_APIKEY}`
        })
    }
    catch(error){
        res.status(401).json({
            status: "failed",
            message: error.message
        })
    }   
}
