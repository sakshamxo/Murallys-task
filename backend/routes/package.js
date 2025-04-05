// travel-booking-app/backend/routes/package.js
import express from 'express';
import { createPackage, getAllPackages, deletePackage } from '../controllers/packageController.js';
import { protect, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 Create a new travel package (Agents only)
router.post('/create',  protect, createPackage);

// 📌 Get all travel packages (Public route)
router.get('/all-packages', getAllPackages);

// 📌 Delete a travel package (Agents only)
router.delete('/delete/:id',  protect, deletePackage);

export default router;
