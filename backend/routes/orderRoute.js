import express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { createOrder, getAllOrders, getOrderById, getUserOrders, updateOrderStatus } from '../controller/orderController.js';

const router = express.Router();

router.post('/create',isAuthenticated, createOrder);
router.get('/getallorders', isAuthenticated,isAdmin, getAllOrders)
router.get('/getuserorder' , isAuthenticated, getUserOrders)
router.get('/getorder/:orderId' , isAuthenticated,isAdmin, getOrderById)
router.post('/updateorderstatus/:orderId' , isAuthenticated,isAdmin, updateOrderStatus)






export default router;