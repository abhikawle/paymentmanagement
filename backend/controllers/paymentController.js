const Payment = require('../models/Payment');

// Validate payment fields based on type
const validatePaymentFields = (paymentType, data) => {
  const requiredFields = {
    Bank: ['ifscCode', 'branchName', 'bankName', 'accountNumber', 'accountHolderName'],
    Paytm: ['paytmNumber'],
    UPI: ['upiId'],
    PayPal: ['paypalEmail'],
    USDT: ['usdtAddress'],
  };

  const needed = requiredFields[paymentType] || [];
  const missing = needed.filter(field => !data[field]);

  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
};

// Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { paymentType, ...paymentData } = req.body;

    // Validation
    if (!paymentType) {
      return res.status(400).json({
        success: false,
        message: 'Payment type is required',
      });
    }

    const validation = validatePaymentFields(paymentType, paymentData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${validation.missingFields.join(', ')}`,
      });
    }

    // Create payment with only relevant fields
    const paymentObject = {
      user: req.user.id,
      paymentType,
    };

    // Add only relevant fields
    const allowedFields = {
      Bank: ['ifscCode', 'branchName', 'bankName', 'accountNumber', 'accountHolderName'],
      Paytm: ['paytmNumber'],
      UPI: ['upiId'],
      PayPal: ['paypalEmail'],
      USDT: ['usdtAddress'],
    };

    allowedFields[paymentType].forEach(field => {
      if (paymentData[field]) {
        paymentObject[field] = paymentData[field];
      }
    });

    const payment = new Payment(paymentObject);
    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });

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

// Get Single Payment
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Payment
exports.updatePayment = async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this payment',
      });
    }

    const { paymentType, ...paymentData } = req.body;

    if (paymentType && paymentType !== payment.paymentType) {
      const validation = validatePaymentFields(paymentType, paymentData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${validation.missingFields.join(', ')}`,
        });
      }

      // Clear old fields
      payment.ifscCode = undefined;
      payment.branchName = undefined;
      payment.bankName = undefined;
      payment.accountNumber = undefined;
      payment.accountHolderName = undefined;
      payment.paytmNumber = undefined;
      payment.upiId = undefined;
      payment.paypalEmail = undefined;
      payment.usdtAddress = undefined;

      payment.paymentType = paymentType;
    }

    // Update relevant fields
    const allowedFields = {
      Bank: ['ifscCode', 'branchName', 'bankName', 'accountNumber', 'accountHolderName'],
      Paytm: ['paytmNumber'],
      UPI: ['upiId'],
      PayPal: ['paypalEmail'],
      USDT: ['usdtAddress'],
    };

    const currentType = paymentType || payment.paymentType;
    allowedFields[currentType].forEach(field => {
      if (paymentData[field]) {
        payment[field] = paymentData[field];
      }
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this payment',
      });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
