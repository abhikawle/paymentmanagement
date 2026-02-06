import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPayments } from '../utils/api';
import Header from '../components/Header';
import PaymentList from '../components/PaymentList';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getUserPayments();
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDeleted = () => {
    fetchPayments();
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.username}!</h1>
          <button onClick={() => navigate('/add-payment')} className="btn-primary">
            + Add Payment Method
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payments-section">
          <h2>Your Payment Methods</h2>
          {loading ? (
            <p>Loading...</p>
          ) : payments.length === 0 ? (
            <p className="no-data">No payment methods added yet. Click "Add Payment Method" to get started!</p>
          ) : (
            <PaymentList payments={payments} onPaymentDeleted={handlePaymentDeleted} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
