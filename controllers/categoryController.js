import { Category } from "../models/categoryModel.js";
import { Product } from "../models/productModel.js";
import asyncHandler from "express-async-handler";

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({}).select({ category: 1 });
    if (!categories) {
      return res.status(404).json({ message: "No category found" });
    }

    res.status(200).json({ categories, totalRecord: categories.length });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Get All Categories API" });
  }
});

export const getCategoryByIdController = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select({
      category: 1,
    });
    if (!category) {
      return res.status(404).json({ message: "No category found" });
    }
    res.status(200).json({ category });
  } catch (error) {}
});

//create
export const createCategoryController = asyncHandler(async (req, res) => {
  try {
    //Admin Check
    if (req.user.role != "admin") {
      return res.status(500).send({
        success: false,
        message: "You are not authorized to perfome this action",
      });
    }
    const { category } = req.body;
    if (!category)
      return res
        .status(400)
        .json({ success: false, message: "Please provide category" });
    if (req.user.role == "admin") {
      console.log(req.user.role);
      const _category = await Category.findOne({ category: category });
      if (_category) {
        return res
          .status(201)
          .json({ success: false, message: "Sorry, category already exist" });
      } else {
        const cat = await Category.create({
          category: category,
        });
        return res.status(201).send({
          sucess: true,
          message: "Category successfully created",
          cat,
        });
      }
    } else {
      res.status(201).json({
        success: false,
        message: "Sorry, you are not authorized to perform this action",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Create Category API" });
  }
});

//delete
export const deleteCategoryController = asyncHandler(async (req, res) => {
  try {
    //Admin Check
    if (req.user.role != "admin") {
      return res.status(500).send({
        success: false,
        message: "You are not authorized to perfome this action",
      });
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "No category found" });
    }
    const products = await Product.find({ category: category._id });
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        product.category = undefined;
        product.save();
      }
    }
    await category.deleteOne();
    res.status(200).json({ message: "Category delete successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({ success: false, message: "Invalid id" });
    }

    res
      .status(500)
      .json({ success: false, message: "Error in Create Category API" });
  }
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const { category } = req.body;
  if (!category) {
    return res
      .status(500)
      .json({ success: false, message: "Please enter category" });
  }
  try {
    //Admin Check
    if (req.user.role != "admin") {
      return res.status(500).send({
        success: false,
        message: "You are not authorized to perfome this action",
      });
    }
    const _category = await Category.findById(req.params.id);
    if (!_category) {
      return res.status(200).json({ message: "No data found" });
    }
    console.log(category);
    if (_category) {
      if (category) _category.category = category;
      await _category.save();
      res.status(200).json({
        success: true,
        message: "Update successfully",
        category: _category,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Update Category API" });
  }
});
