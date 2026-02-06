import express from 'express';
import { allUser, changePassword, forgotPassword, getUserById, login, logout, register,reVerify,updateUser,verify, verifyOTP } from "../controller/userController.js";
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/register',register);
router.post('/verify',verify);
router.post('/reverify',reVerify);
router.post('/login',login);
router.post('/logout',isAuthenticated, logout);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp/:email', verifyOTP);
router.post('/changepassword/:email', changePassword);
router.get('/alluser',isAuthenticated,isAdmin,allUser);
router.get('/getuserbyid/:userId',getUserById);
router.put('/updateuser/:id',isAuthenticated,singleUpload,updateUser);






export default router;