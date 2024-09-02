import { Product } from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

//get All Products
export const getAllPrductsController = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");

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

//get Single product
export const getSingleProductController = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "No product found" });
    }
    return res
      .status(200)
      .send({ success: true, message: "Fetched product", product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({ success: false, message: "Invalid id" });
    }
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Get All Product API" });
  }
});

//create new product
export const createProductController = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    //validation
    // if (!name || !description || !price || !category || !stock){
    //     return res.status(500).json({success:false, message:"Please enter mendatory field"});
    // }
    if (req.user.role != "admin") {
      return res
        .status(500)
        .json({ success: false, message: "Your are not authorized " });
    }

    //upload image
    if (!req.file) {
      return res
        .status(500)
        .json({ success: false, message: "Please upload product images" });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    const _product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
    });
    return res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: _product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Create Product API" });
  }
});

//update product
export const updateProductController = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    console.log(req.body);
    const id = req.params.id;
    if (req.user.role != "admin") {
      return res.status(500).send({
        success: false,
        message: "You are not authorized to perfome this action",
      });
    }
    //find product
    const _product = await Product.findById(id);
    if (_product) {
      if (name) _product.name = name;
      if (description) _product.description = description;
      if (price) _product.price = price;
      if (stock) _product.stock = stock;
      if (category) _product.category = category;
      console.log("Name", name);
      await _product.save();
      return res.status(200).send({
        success: true,
        message: "Update successfully",
        product: _product,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in Update Product API" });
  }
});

//delete product
export const deleteProductController = asyncHandler(async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res
        .status(500)
        .json({ success: false, message: "Your are not authorized " });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    //find and delete cloudinary images

    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Delete Product API" });
  }
});
//update product image
export const updateProductImageController = asyncHandler(async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res
        .status(500)
        .json({ success: false, message: "Your are not authorized " });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (!req.file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    product.images.push(image);
    await product.save();
    res
      .status(200)
      .send({ success: true, message: "Product image updated", product });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in Update Product Image API" });
  }
});

//delete product image
export const deleteProductImageController = asyncHandler(async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res
        .status(500)
        .json({ success: false, message: "Your are not authorized " });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const id = req.query.id;
    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "Product image not found" });
    }
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "Image Not Found",
      });
    }
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    product.save();
    return res.status(200).send({
      success: true,
      message: "Product Image Deleted Successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in Delete Product Image API" });
  }
});
