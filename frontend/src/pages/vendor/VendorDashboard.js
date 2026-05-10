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
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-content" style={{ backgroundColor: '#f5f7fa' }}>
        <div className="container">
          <div className="section-headline" style={{ marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: '#1a1a1a' }}>Dashboard</h2>
              <p style={{ color: '#666', marginTop: '4px' }}>Welcome back, <strong>{auth?.user?.businessName}</strong>! 👋</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                backgroundColor: '#ffffff',
                padding: '8px 16px',
                borderRadius: '99px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                fontSize: '14px',
                fontWeight: '700',
                color: '#008cff'
              }}>
                ⭐ {stats.rating.toFixed(1)} Vendor Rating
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '50px'
          }}>
            <div className="mmt-offer-card" style={{ textAlign: 'center', borderTop: '4px solid #ffc107' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔔</div>
              <h3 style={{ fontSize: '28px', margin: '0' }}>{stats.pendingBookings}</h3>
              <p style={{ color: '#666', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Pending</p>
            </div>

            <div className="mmt-offer-card" style={{ textAlign: 'center', borderTop: '4px solid #008cff' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚙️</div>
              <h3 style={{ fontSize: '28px', margin: '0' }}>{stats.inProgressBookings}</h3>
              <p style={{ color: '#666', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>In Progress</p>
            </div>

            <div className="mmt-offer-card" style={{ textAlign: 'center', borderTop: '4px solid #4caf50' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
              <h3 style={{ fontSize: '28px', margin: '0' }}>{stats.completedBookings}</h3>
              <p style={{ color: '#666', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Completed</p>
            </div>

            <div className="mmt-offer-card" style={{ textAlign: 'center', borderTop: '4px solid #e91e63', background: 'linear-gradient(135deg, #ffffff 0%, #fff5f8 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
              <h3 style={{ fontSize: '28px', margin: '0', color: '#e91e63' }}>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p style={{ color: '#666', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Earnings</p>
            </div>

            <div className="mmt-offer-card" style={{ textAlign: 'center', borderTop: '4px solid #673ab7' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
              <h3 style={{ fontSize: '28px', margin: '0' }}>{stats.totalBookings}</h3>
              <p style={{ color: '#666', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>Total Work</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900' }}>Available Work Requests</h3>
            <span style={{ fontSize: '13px', color: '#008cff', fontWeight: '700' }}>{pendingBookings.length} New Requests</span>
          </div>

          {pendingBookings.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {pendingBookings.map(booking => (
                <div key={booking._id} className="booking-card" style={{
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  padding: '25px',
                  borderLeft: '5px solid #ffc107'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{
                        backgroundColor: '#fff8e1',
                        color: '#ffa000',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '900',
                        textTransform: 'uppercase'
                      }}>
                        New Request
                      </span>
                      <h3 style={{ fontSize: '22px', marginTop: '12px', color: '#003580' }}>{booking.service?.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>₹{booking.price}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        📅 {new Date(booking.scheduledDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '25px',
                    padding: '20px',
                    backgroundColor: '#f8fbff',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Customer</p>
                      <p style={{ fontWeight: '700', marginTop: '4px' }}>{booking.customer?.name}</p>
                      <p style={{ fontSize: '13px', color: '#008cff', marginTop: '2px' }}>📞 {booking.customer?.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>Location</p>
                      <p style={{ fontWeight: '700', marginTop: '4px' }}>{booking.address}</p>
                      <p style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>📍 {booking.city}</p>
                    </div>
                  </div>

                  {booking.description && (
                    <div style={{ marginTop: '20px', paddingLeft: '15px', borderLeft: '3px solid #e0e0e0' }}>
                      <p style={{ fontSize: '12px', color: '#666', fontWeight: '700' }}>REQUIREMENTS:</p>
                      <p style={{ marginTop: '6px', fontSize: '14px', color: '#444', fontStyle: 'italic' }}>"{booking.description}"</p>
                    </div>
                  )}

                  <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                    <button
                      className="btn-primary"
                      style={{ padding: '12px 30px', borderRadius: '8px' }}
                      onClick={() => handleAcceptBooking(booking._id)}
                    >
                      ACCEPT BOOKING
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '12px 30px', borderRadius: '8px', border: '1px solid #ddd', color: '#666' }}
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              padding: '60px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>☕</div>
              <h4 style={{ fontSize: '20px', color: '#1a1a1a' }}>All caught up!</h4>
              <p style={{ color: '#666', marginTop: '8px' }}>No pending bookings available. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;
