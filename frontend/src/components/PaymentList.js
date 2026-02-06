import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePayment } from '../utils/api';
import '../styles/payment-list.css';

const PaymentList = ({ payments, onPaymentDeleted }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  // Mask sensitive data - show only last 4 characters
  const maskSensitiveData = (value, showChars = 4) => {
    if (!value) return '';
    const strValue = String(value);
    if (strValue.length <= showChars) return strValue;
    const masked = '*'.repeat(strValue.length - showChars);
    return masked + strValue.slice(-showChars);
  };

  // Mask UPI ID - show partially (e.g., 9011****492@upi)
  const maskUpiId = (upiId) => {
    if (!upiId) return '';
    const [userPart, domain] = upiId.split('@');
    if (!userPart || !domain) return upiId;
    
    const visibleStart = Math.ceil(userPart.length / 3);
    const visibleEnd = Math.max(visibleStart, 3);
    const masked = userPart.slice(0, visibleStart) + '*'.repeat(Math.max(0, userPart.length - visibleEnd)) + userPart.slice(-Math.min(2, visibleEnd));
    return masked + '@' + domain;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        setDeletingId(id);
        const response = await deletePayment(id);
        if (response.data.success) {
          onPaymentDeleted();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete payment');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const renderPaymentDetails = (payment) => {
    switch (payment.paymentType) {
      case 'Bank':
        return (
          <div className="payment-details">
            <div className="detail-row">
              <span className="detail-label">Bank</span>
              <span className="detail-value">{payment.bankName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">IFSC</span>
              <span className="detail-value">{payment.ifscCode}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Branch</span>
              <span className="detail-value">{payment.branchName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Holder</span>
              <span className="detail-value">{payment.accountHolderName}</span>
            </div>
            <div className="detail-row highlight">
              <span className="detail-label">Account No.</span>
              <span className="detail-value">{maskSensitiveData(payment.accountNumber, 4)}</span>
            </div>
          </div>
        );
      case 'Paytm':
        return (
          <div className="payment-details">
            <div className="detail-row highlight">
              <span className="detail-label">Paytm Number</span>
              <span className="detail-value">{maskSensitiveData(payment.paytmNumber, 4)}</span>
            </div>
          </div>
        );
      case 'UPI':
        return (
          <div className="payment-details">
            <div className="detail-row highlight">
              <span className="detail-label">UPI ID</span>
              <span className="detail-value">{maskUpiId(payment.upiId)}</span>
            </div>
          </div>
        );
      case 'PayPal':
        return (
          <div className="payment-details">
            <div className="detail-row highlight">
              <span className="detail-label">PayPal Email</span>
              <span className="detail-value">{maskSensitiveData(payment.paypalEmail, 5)}</span>
            </div>
          </div>
        );
      case 'USDT':
        return (
          <div className="payment-details">
            <div className="detail-row highlight">
              <span className="detail-label">USDT Address</span>
              <span className="detail-value detail-value-mono">{maskSensitiveData(payment.usdtAddress, 6)}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="payment-list">
      {error && <div className="error-message">{error}</div>}
      <div className="payment-cards">
        {payments.map((payment) => (
          <div key={payment._id} className={`payment-card payment-card-${payment.paymentType.toLowerCase()}`}>
            <div className="card-header">
              <span className={`payment-type-badge badge-${payment.paymentType.toLowerCase()}`}>
                {payment.paymentType}
              </span>
              <div className="card-date">
                <small>Added on</small>
                <span className="payment-date">{new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="card-content">
              {renderPaymentDetails(payment)}
            </div>
            <div className="card-actions">
              <button
                onClick={() => navigate(`/edit-payment/${payment._id}`)}
                className="btn-edit"
                title="Edit this payment method"
              >
                ✎ Edit
              </button>
              <button
                onClick={() => handleDelete(payment._id)}
                disabled={deletingId === payment._id}
                className="btn-delete"
                title="Delete this payment method"
              >
                {deletingId === payment._id ? 'Deleting...' : '🗑 Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentList;
