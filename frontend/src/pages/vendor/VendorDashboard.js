import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function VendorDashboard() {
  const [stats, setStats] = useState({
    pendingBookings: 0,
    acceptedBookings: 0,
    inProgressBookings: 0,
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    rating: 0
  });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.role !== 'vendor') {
      navigate('/vendor/login');
      return;
    }
    fetchData();
  }, [auth, navigate]);

  const fetchData = async () => {
    try {
      const [pendingResponse, statsResponse] = await Promise.all([
        api.get('/bookings/vendor/pending'),
        api.get('/bookings/vendor/stats')
      ]);

      const pendingData = pendingResponse.data.bookings || [];
      const statsData = statsResponse.data.stats || {};

      setPendingBookings(pendingData);
      setStats({
        pendingBookings: statsData.pendingBookings ?? pendingData.length,
        acceptedBookings: statsData.acceptedBookings ?? 0,
        inProgressBookings: statsData.inProgressBookings ?? 0,
        totalBookings: statsData.totalBookings ?? 0,
        completedBookings: statsData.completedBookings ?? 0,
        totalRevenue: statsData.totalRevenue ?? 0,
        rating: auth?.user?.rating || 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/accept`);
      toast.success('Booking accepted!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

    <div className="page-content dashboard-bg">
      <div className="container">
        <div className="section-headline mb-20">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back, <strong>{auth?.user?.businessName}</strong>! 👋</p>
          </div>
          <div className="vendor-rating-badge">
            <span className="card" style={{ borderRadius: '99px', padding: '8px 20px', color: '#008cff', fontWeight: '800' }}>
              ⭐ {stats.rating.toFixed(1)} Rating
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" style={{ borderTop: '4px solid #ffc107' }}>
            <div className="icon">🔔</div>
            <h3>{stats.pendingBookings}</h3>
            <p className="label">Pending</p>
          </div>

          <div className="stat-card" style={{ borderTop: '4px solid #008cff' }}>
            <div className="icon">⚙️</div>
            <h3>{stats.inProgressBookings}</h3>
            <p className="label">In Progress</p>
          </div>

          <div className="stat-card" style={{ borderTop: '4px solid #4caf50' }}>
            <div className="icon">✅</div>
            <h3>{stats.completedBookings}</h3>
            <p className="label">Completed</p>
          </div>

          <div className="stat-card" style={{ borderTop: '4px solid #e91e63' }}>
            <div className="icon">💰</div>
            <h3 style={{ color: '#e91e63' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="label">Earnings</p>
          </div>

          <div className="stat-card" style={{ borderTop: '4px solid #673ab7' }}>
            <div className="icon">📋</div>
            <h3>{stats.totalBookings}</h3>
            <p className="label">Total Work</p>
          </div>
        </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900' }}>Available Work Requests</h3>
            <span style={{ fontSize: '13px', color: '#008cff', fontWeight: '700' }}>{pendingBookings.length} New Requests</span>
          </div>

        {pendingBookings.length > 0 ? (
          <div className="grid grid-cols-1">
            {pendingBookings.map(booking => (
              <div key={booking._id} className="work-request-card">
                <div className="work-request-header">
                  <div>
                    <span className="badge-yellow">New Request</span>
                    <h3 style={{ fontSize: '22px', marginTop: '12px', color: '#003580' }}>{booking.service?.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="price-text" style={{ fontSize: '24px', fontWeight: '900' }}>₹{booking.price}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      📅 {new Date(booking.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="work-request-details">
                  <div>
                    <p className="label-text" style={{ fontSize: '11px', fontWeight: '800', color: '#999' }}>CUSTOMER</p>
                    <p style={{ fontWeight: '700' }}>{booking.customer?.name}</p>
                    <p style={{ fontSize: '13px', color: '#008cff' }}>📞 {booking.customer?.phone}</p>
                  </div>
                  <div>
                    <p className="label-text" style={{ fontSize: '11px', fontWeight: '800', color: '#999' }}>LOCATION</p>
                    <p style={{ fontWeight: '700' }}>{booking.address}</p>
                    <p style={{ fontSize: '13px', color: '#555' }}>📍 {booking.city}</p>
                  </div>
                </div>

                {booking.description && (
                  <div style={{ marginTop: '20px', paddingLeft: '15px', borderLeft: '3px solid #eee' }}>
                    <p style={{ fontSize: '12px', color: '#999', fontWeight: '700' }}>REQUIREMENTS:</p>
                    <p style={{ marginTop: '6px', fontSize: '14px', color: '#444', fontStyle: 'italic' }}>"{booking.description}"</p>
                  </div>
                )}

                <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleAcceptBooking(booking._id)}
                    style={{ flex: 1, minWidth: '200px' }}
                  >
                    ACCEPT BOOKING
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1, minWidth: '200px' }}
                  >
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>☕</div>
            <h4>All caught up!</h4>
            <p>No pending bookings available. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  </>
);
}

export default VendorDashboard;
