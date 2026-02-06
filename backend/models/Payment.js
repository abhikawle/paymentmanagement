const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['Bank', 'Paytm', 'UPI', 'PayPal', 'USDT'],
      required: true,
    },
    // Bank specific fields
    ifscCode: {
      type: String,
      trim: true,
    },
    branchName: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    accountHolderName: {
      type: String,
      trim: true,
    },
    // Paytm specific fields
    paytmNumber: {
      type: String,
      trim: true,
    },
    // UPI specific fields
    upiId: {
      type: String,
      trim: true,
    },
    // PayPal specific fields
    paypalEmail: {
      type: String,
      trim: true,
    },
    // USDT specific fields
    usdtAddress: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for quick user payments lookup
paymentSchema.index({ user: 1 });
paymentSchema.index({ paymentType: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
