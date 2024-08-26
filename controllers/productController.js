import { Product } from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

//get All Products

export const getAllPrductsController = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate('category');

    res
      .status(200)
      .send({ success: true, message: "Fetched all products", products });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Get All Product API" });
  }
});

export const getSingleProductController = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate('category');

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "No product found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Fetched product", product });
  } catch (error) {
    
    if (error.name==='CastError'){
        return res.status(500).send({success:false, message: "Invalid id"});
    }
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Get All Product API" });
  }
});

export const createProductController = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    //validation
    // if (!name || !description || !price || !category || !stock){
    //     return res.status(500).json({success:false, message:"Please enter mendatory field"});
    // }
    if (req.user.role!="admin"){
        return res.status(500).json({success:false, message: "Your are not authorized "});
    }

    //upload image
    if (!req.file){
        return res.status(500).json({success:false, message: "Please upload product images"});
    }
    const file =getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url
    }

    const _product = await Product.create({
        name, description, price, category, stock, images:[image] 

    });
    return res.status(201).send({success: true, message: "Product created successfully", product: _product});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Create Product API" });
  }
});

export const updateProductController = asyncHandler(async(req,res)=>{
    try {
        const { name, description, price, category, stock } = req.body;
        console.log(req.body);
        const id = req.params.id;
        if (req.user.role!="admin")
        {
            return res.status(500).send({success: false, message: "You are not authorized to perfome this action"});
        }
        //find product
        const _product = await Product.findById(id);
        if (_product){
            if (name) _product.name = name;
            if (description) _product.description = description;
            if (price) _product.price = price;
            if (stock) _product.stock = stock;
            if (category) _product.category = category;
            console.log("Name", name);
            await _product.save();
            return res.status(200).send({success: true, message: "Update successfully", product: _product})

        }else{
            return res.status(404).json({success:false, message:"Product not found"});
        }

        
        
    } catch (error) {
        res
      .status(500)
      .json({ success: false, message: "Error in Update Product API" });
    }
})