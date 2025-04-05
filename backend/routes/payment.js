import express from 'express';
import {
  createPayment,
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order', protect, roleBasedAccess(['customer']), createPaymentOrder);
router.post('/verify', protect, roleBasedAccess(['customer']), verifyPayment);
router.post('/pay', protect, roleBasedAccess(['customer']), createPayment);

export default router;

