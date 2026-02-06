import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { getAllPayments, searchPayments } from '../utils/api';
import '../styles/admin.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    username: '',
    paymentType: '',
    bankName: '',
    ifscCode: '',
    paytmNumber: '',
    upiId: '',
    paypalEmail: '',
    usdtAddress: '',
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchAllPayments();
  }, [user]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const response = await getAllPayments();
      if (response.data.success) {
        setPayments(response.data.payments);
        setFilteredPayments(response.data.payments);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );

      if (Object.keys(activeFilters).length === 0) {
        setFilteredPayments(payments);
      } else {
        const response = await searchPayments(activeFilters);
        if (response.data.success) {
          setFilteredPayments(response.data.payments);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search payments');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      username: '',
      paymentType: '',
      bankName: '',
      ifscCode: '',
      paytmNumber: '',
      upiId: '',
      paypalEmail: '',
      usdtAddress: '',
    });
    setFilteredPayments(payments);
  };

  if (user?.role !== 'admin') {
    return (
      <div>
        <Header />
        <div className="admin-container">
          <p className="error-message">Access Denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <h1>Admin Panel - Payment Management</h1>

        <div className="filter-section">
          <h2>Search & Filter Payments</h2>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                placeholder="Search by username"
              />
            </div>
            <div className="filter-group">
              <label>Payment Type</label>
              <select name="paymentType" value={filters.paymentType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="Bank">Bank</option>
                <option value="Paytm">Paytm</option>
                <option value="UPI">UPI</option>
                <option value="PayPal">PayPal</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={filters.bankName}
                onChange={handleFilterChange}
                placeholder="Search by bank name"
              />
            </div>
            <div className="filter-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={filters.ifscCode}
                onChange={handleFilterChange}
                placeholder="Search by IFSC code"
              />
            </div>
            <div className="filter-group">
              <label>Paytm Number</label>
              <input
                type="text"
                name="paytmNumber"
                value={filters.paytmNumber}
                onChange={handleFilterChange}
                placeholder="Search by Paytm number"
              />
            </div>
            <div className="filter-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={filters.upiId}
                onChange={handleFilterChange}
                placeholder="Search by UPI ID"
              />
            </div>
            <div className="filter-group">
              <label>PayPal Email</label>
              <input
                type="text"
                name="paypalEmail"
                value={filters.paypalEmail}
                onChange={handleFilterChange}
                placeholder="Search by PayPal email"
              />
            </div>
            <div className="filter-group">
              <label>USDT Address</label>
              <input
                type="text"
                name="usdtAddress"
                value={filters.usdtAddress}
                onChange={handleFilterChange}
                placeholder="Search by USDT address"
              />
            </div>
          </div>
          <div className="filter-actions">
            <button onClick={handleSearch} className="btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payments-table-section">
          <h2>Results: {filteredPayments.length} payment(s) found</h2>
          {loading ? (
            <p>Loading...</p>
          ) : filteredPayments.length === 0 ? (
            <p className="no-data">No payments found matching your criteria.</p>
          ) : (
            <div className="table-responsive">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Payment Type</th>
                    <th>Details</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.user?.username}</td>
                      <td>{payment.user?.email}</td>
                      <td><span className={`badge badge-${payment.paymentType.toLowerCase()}`}>{payment.paymentType}</span></td>
                      <td>
                        {payment.paymentType === 'Bank' && (
                          <div>
                            {payment.bankName}, IFSC: {payment.ifscCode}
                          </div>
                        )}
                        {payment.paymentType === 'Paytm' && <div>{payment.paytmNumber}</div>}
                        {payment.paymentType === 'UPI' && <div>{payment.upiId}</div>}
                        {payment.paymentType === 'PayPal' && <div>{payment.paypalEmail}</div>}
                        {payment.paymentType === 'USDT' && <div>{payment.usdtAddress}</div>}
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
