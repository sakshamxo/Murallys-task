// travel-booking-app/backend/routes/auth.js
import express from 'express';
import {login, getUserProfile, logout, customerDashboard, agentDashboard, registerCustomer, registerAgent } from '../controllers/authController.js';
import{ protect, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 User registration (Sign Up)
router.post('/register/customer', registerCustomer); // Route for customers
router.post('/register/agent', registerAgent); // Route for agents

// 📌 User login
router.post('/login', login);

// 📌 Get user profile (Protected Route)
router.get('/profile', protect, getUserProfile);

router.get('/dashboard/customer',protect , customerDashboard);

router.get('/dashboard/agent',protect , agentDashboard);

router.get('/logout', logout)


export default router;
