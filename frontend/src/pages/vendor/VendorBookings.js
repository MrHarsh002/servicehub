import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.role !== 'vendor') {
      navigate('/vendor/login');
      return;
    }
    fetchBookings();
  }, [auth, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/vendor/my-bookings');
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleStartBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/start`);
      toast.success('Booking status updated to In Progress');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/complete`);
      toast.success('Booking marked as completed!');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete booking');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Accepted': return 'status-accepted';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      default: return '';
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
      <div className="bookings-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#1a1a1a' }}>Work List</h2>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: '700' }}>
            {bookings.length} TOTAL ASSIGNMENTS
          </div>
        </div>
        
        {bookings.length > 0 ? (
          <div style={{ display: 'grid', gap: '24px' }}>
            {bookings.map(booking => {
              const statusColors = {
                'Pending': { bg: '#fff8e1', text: '#ffa000', border: '#ffa000' },
                'Accepted': { bg: '#e3f2fd', text: '#008cff', border: '#008cff' },
                'In Progress': { bg: '#f3e5f5', text: '#9c27b0', border: '#9c27b0' },
                'Completed': { bg: '#e8f5e9', text: '#4caf50', border: '#4caf50' }
              };
              const currentStatus = statusColors[booking.status] || statusColors['Pending'];

              return (
                <div key={booking._id} className="booking-card" style={{ 
                  border: 'none', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  padding: '0',
                  overflow: 'hidden',
                  borderRadius: '16px'
                }}>
                  {/* Card Header */}
                  <div style={{ 
                    padding: '20px 30px', 
                    borderBottom: '1px solid #f0f0f0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: '#ffffff'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '20px', color: '#003580', margin: '0' }}>{booking.service?.name}</h3>
                      <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>ID: {booking.bookingId}</p>
                    </div>
                    <span style={{ 
                      backgroundColor: currentStatus.bg, 
                      color: currentStatus.text, 
                      padding: '6px 16px', 
                      borderRadius: '99px', 
                      fontSize: '12px', 
                      fontWeight: '900',
                      textTransform: 'uppercase'
                    }}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '30px' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '30px',
                      marginBottom: '25px'
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#999', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Info</p>
                        <p style={{ fontWeight: '700', fontSize: '16px', marginTop: '6px' }}>{booking.customer?.name}</p>
                        <p style={{ color: '#008cff', fontSize: '14px', marginTop: '4px' }}>📞 {booking.customer?.phone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#999', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Schedule & Payment</p>
                        <p style={{ fontWeight: '700', fontSize: '16px', marginTop: '6px' }}>📅 {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        <p style={{ color: '#2ecc71', fontSize: '16px', fontWeight: '900', marginTop: '4px' }}>₹{booking.price}</p>
                      </div>
                    </div>

                    <div style={{ 
                      backgroundColor: '#f8fbff', 
                      padding: '20px', 
                      borderRadius: '12px',
                      marginBottom: '20px',
                      border: '1px solid #e8f1ff'
                    }}>
                      <p style={{ fontSize: '11px', color: '#777', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Service Location</p>
                      <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                        📍 {booking.address}, {booking.city}
                      </p>
                    </div>

                    {booking.description && (
                      <div style={{ 
                        backgroundColor: '#fff9e6', 
                        padding: '15px 20px', 
                        borderRadius: '12px',
                        borderLeft: '4px solid #ffc107'
                      }}>
                        <p style={{ fontSize: '11px', color: '#856404', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px' }}>Customer Requirements</p>
                        <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>"{booking.description}"</p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div style={{ padding: '0 30px 30px' }}>
                    {booking.status === 'Accepted' && (
                      <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '900', letterSpacing: '1px' }}
                        onClick={() => handleStartBooking(booking._id)}
                      >
                        START SERVICE NOW
                      </button>
                    )}
                    {booking.status === 'In Progress' && (
                      <button
                        className="btn-primary"
                        style={{ 
                          width: '100%', 
                          padding: '16px', 
                          borderRadius: '12px', 
                          fontWeight: '900', 
                          letterSpacing: '1px',
                          background: 'linear-gradient(93deg, #4caf50, #2e7d32)' 
                        }}
                        onClick={() => handleCompleteBooking(booking._id)}
                      >
                        MARK AS COMPLETED
                      </button>
                    )}
                    {booking.status === 'Completed' && booking.customerRating && (
                      <div style={{ 
                        backgroundColor: '#e8f5e9', 
                        padding: '20px', 
                        borderRadius: '12px', 
                        textAlign: 'center',
                        border: '1px dashed #4caf50'
                      }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>⭐ {booking.customerRating}/5</div>
                        <p style={{ fontSize: '14px', color: '#2e7d32', fontStyle: 'italic' }}>"{booking.customerReview}"</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px', 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📁</div>
            <h3 style={{ color: '#1a1a1a' }}>Your Work List is Empty</h3>
            <p style={{ color: '#666', marginTop: '10px' }}>All assignments have been completed. Check the dashboard for new requests!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default VendorBookings;
