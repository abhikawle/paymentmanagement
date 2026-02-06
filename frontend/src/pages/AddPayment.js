import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPayment } from '../utils/api';
import Header from '../components/Header';
import PaymentForm from '../components/PaymentForm';
import '../styles/payment-form.css';

const AddPayment = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const response = await addPayment(formData);
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-payment-page">
      <Header />
      <div className="payment-form-container">
        <h1>Add New Payment Method</h1>
        {error && <div className="error-message">{error}</div>}
        <PaymentForm onSubmit={handleSubmit} loading={loading} />
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddPayment;
