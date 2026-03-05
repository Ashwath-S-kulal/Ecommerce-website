import express from "express";
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { getSystemStorageStatus } from "../controller/statusController.js";


const router = express.Router();

// Only Admins should access deep system data
router.get("/storage-stats",isAuthenticated, isAdmin, getSystemStorageStatus);

export default router;