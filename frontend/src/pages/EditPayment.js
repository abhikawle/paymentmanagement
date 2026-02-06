import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayment, updatePayment } from '../utils/api';
import Header from '../components/Header';
import PaymentForm from '../components/PaymentForm';
import '../styles/payment-form.css';

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchPayment = useCallback(async () => {
    try {
      const response = await getPayment(id);
      if (response.data.success) {
        setInitialData(response.data.payment);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment');
    } finally {
      setFetchLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  const handleSubmit = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const response = await updatePayment(id, formData);
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-payment-page">
      <Header />
      <div className="payment-form-container">
        <h1>Edit Payment Method</h1>
        {error && <div className="error-message">{error}</div>}
        {initialData && <PaymentForm onSubmit={handleSubmit} loading={loading} initialData={initialData} />}
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EditPayment;
