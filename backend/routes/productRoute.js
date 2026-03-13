import express from 'express';
import { addProduct, deleteProduct, getAllProduct, getAllProductOnce, getProductById, searchProducts, updateProduct } from '../controller/productController.js';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { multipleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/add',isAuthenticated,isAdmin,multipleUpload,addProduct);
router.get('/getallproducts',getAllProduct);
router.get('/getallproductsonce',getAllProductOnce);
router.delete('/delete/:productId',isAuthenticated,isAdmin,deleteProduct)
router.put('/update/:productId',isAuthenticated,isAdmin,multipleUpload,updateProduct)
router.get("/search", searchProducts);
router.get("/getproduct/:id", getProductById);


export default router;