import { Order } from "../models/orderModel.js";
import asyncHandler from 'express-async-handler';

//Get All Orders by User
export const getAllOrderController = asyncHandler(async(req, res)=>{
    try {
        const order = await Order.find({user:req.user.userId});
        if (!order){
            return res.status(404).json({success:false, message: "No order found"});
        }
        res.status(200).json({success:true, message:"Get All Orders API"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:"Error in Get Order API"});
        
    }
})

//Create Order
export const createOrderController = asyncHandler(async(req,res)=>{
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
          } = req.body;
        
    } catch (error) {
        res.status(500).json({success:false, message: "Error in Create Order API"});
        
    }
})