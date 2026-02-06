const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin endpoints
router.get('/payments/all', adminController.getAllPayments);
router.get('/payments/search', adminController.searchPayments);

module.exports = router;
