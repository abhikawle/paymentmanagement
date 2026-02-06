import React, { useState } from 'react';
import '../styles/payment-form.css';

const PaymentForm = ({ onSubmit, loading, initialData = null }) => {
  const [paymentType, setPaymentType] = useState(initialData?.paymentType || 'Bank');
  const [formData, setFormData] = useState({
    ifscCode: initialData?.ifscCode || '',
    branchName: initialData?.branchName || '',
    bankName: initialData?.bankName || '',
    accountNumber: initialData?.accountNumber || '',
    accountHolderName: initialData?.accountHolderName || '',
    paytmNumber: initialData?.paytmNumber || '',
    upiId: initialData?.upiId || '',
    paypalEmail: initialData?.paypalEmail || '',
    usdtAddress: initialData?.usdtAddress || '',
  });

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentType,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label htmlFor="paymentType">Payment Type *</label>
        <select
          id="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          required
        >
          <option value="Bank">Bank Account</option>
          <option value="Paytm">Paytm</option>
          <option value="UPI">UPI</option>
          <option value="PayPal">PayPal</option>
          <option value="USDT">USDT Crypto</option>
        </select>
      </div>

      {paymentType === 'Bank' && (
        <>
          <div className="form-group">
            <label htmlFor="bankName">Bank Name *</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              required
              placeholder="e.g., State Bank of India"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ifscCode">IFSC Code *</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              required
              placeholder="e.g., SBIN0123456"
            />
          </div>
          <div className="form-group">
            <label htmlFor="branchName">Branch Name *</label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleInputChange}
              required
              placeholder="e.g., Main Branch"
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number *</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g., 12345678901234"
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountHolderName">Account Holder Name *</label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleInputChange}
              required
              placeholder="e.g., John Doe"
            />
          </div>
        </>
      )}

      {paymentType === 'Paytm' && (
        <div className="form-group">
          <label htmlFor="paytmNumber">Paytm Mobile Number *</label>
          <input
            type="text"
            id="paytmNumber"
            name="paytmNumber"
            value={formData.paytmNumber}
            onChange={handleInputChange}
            required
            placeholder="e.g., 9876543210"
          />
        </div>
      )}

      {paymentType === 'UPI' && (
        <div className="form-group">
          <label htmlFor="upiId">UPI ID *</label>
          <input
            type="text"
            id="upiId"
            name="upiId"
            value={formData.upiId}
            onChange={handleInputChange}
            required
            placeholder="e.g., user@upi"
          />
        </div>
      )}

      {paymentType === 'PayPal' && (
        <div className="form-group">
          <label htmlFor="paypalEmail">PayPal Email *</label>
          <input
            type="email"
            id="paypalEmail"
            name="paypalEmail"
            value={formData.paypalEmail}
            onChange={handleInputChange}
            required
            placeholder="e.g., user@example.com"
          />
        </div>
      )}

      {paymentType === 'USDT' && (
        <div className="form-group">
          <label htmlFor="usdtAddress">USDT Wallet Address *</label>
          <input
            type="text"
            id="usdtAddress"
            name="usdtAddress"
            value={formData.usdtAddress}
            onChange={handleInputChange}
            required
            placeholder="e.g., 0x742d35Cc6634C0532925a3b844Bc8e7595f..."
          />
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Saving...' : 'Save Payment Method'}
      </button>
    </form>
  );
};

export default PaymentForm;
