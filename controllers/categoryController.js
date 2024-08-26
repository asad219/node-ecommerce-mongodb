import { Category } from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  try {
    res.status(200).json({message: "Get All Categories API"})
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Get All Categories API" });
  }
});

export const createCategoryController = asyncHandler(async(req,res)=>{
    try {
        const { category } = req.body;
        if (!category) return res.status(400).json({success:false, message: "Please provide category"});
        if (req.user.role=="admin"){
            console.log(req.user.role);
            const _category = await Category.findOne({ category: category });
            if(_category){
                return res.status(201).json({success: false, message: "Sorry, category already exist"});
            }
            else{
                const cat = await Category.create({
                    category: category
                });
                return res.status(201).send({sucess: true, message: "Category successfully created", cat});
            }
        }
        else{
            res.status(201).json({success: false, message: "Sorry, you are not authorized to perform this action"})
        }
    } catch (error) {
        console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Create Category API" });
    }
})
