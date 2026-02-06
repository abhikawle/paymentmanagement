const Payment = require('../models/Payment');
const User = require('../models/User');

// Get all payments (Admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search and filter payments (Admin only)
exports.searchPayments = async (req, res) => {
  try {
    const {
      username,
      paymentType,
      bankName,
      ifscCode,
      paytmNumber,
      upiId,
      paypalEmail,
      usdtAddress,
    } = req.query;

    // Build filter object
    let filter = {};

    // Add filters based on provided query params
    if (paymentType) {
      filter.paymentType = paymentType;
    }

    if (bankName) {
      filter.bankName = { $regex: bankName, $options: 'i' };
    }

    if (ifscCode) {
      filter.ifscCode = { $regex: ifscCode, $options: 'i' };
    }

    if (paytmNumber) {
      filter.paytmNumber = { $regex: paytmNumber, $options: 'i' };
    }

    if (upiId) {
      filter.upiId = { $regex: upiId, $options: 'i' };
    }

    if (paypalEmail) {
      filter.paypalEmail = { $regex: paypalEmail, $options: 'i' };
    }

    if (usdtAddress) {
      filter.usdtAddress = { $regex: usdtAddress, $options: 'i' };
    }

    // Handle username filter
    let userIds = null;
    if (username) {
      const users = await User.find({
        username: { $regex: username, $options: 'i' },
      }).select('_id');
      userIds = users.map(user => user._id);
    }

    if (userIds) {
      filter.user = { $in: userIds };
    }

    // Fetch payments with filters
    const payments = await Payment.find(filter)
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
