import express from 'express';
const router = express.Router();

import { validateToken } from "../middlewares/validateTokenHandler.js";
import { getAllPrductsController, createProductController, getSingleProductController, updateProductController } from '../controllers/productController.js';
import { singleUpload } from '../middlewares/multer.js';

router.get('/get-all', getAllPrductsController);
router.get('/:id', getSingleProductController);
router.post('/create-product',validateToken, singleUpload, createProductController);
router.put('/:id', validateToken, updateProductController);

export default router;