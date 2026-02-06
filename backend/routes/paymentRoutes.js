const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.use(authMiddleware);

// Payment endpoints
router.post('/', paymentController.addPayment);
router.get('/', paymentController.getUserPayments);
router.get('/:id', paymentController.getPayment);
router.patch('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
