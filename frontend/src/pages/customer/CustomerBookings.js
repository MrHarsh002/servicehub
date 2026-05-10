import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.role !== 'customer') {
      navigate('/customer/login');
      return;
    }
    fetchBookings();
  }, [auth, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/customer/my-bookings');
      setBookings(response.data.bookings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleRateBooking = async (bookingId) => {
    if (!rating || !review.trim()) {
      toast.error('Please provide rating and review');
      return;
    }

    try {
      await api.put(`/bookings/${bookingId}/rate`, {
        rating: parseInt(rating),
        review
      });
      toast.success('Review submitted successfully!');
      setSelectedBooking(null);
      setRating('');
      setReview('');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
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
      
    <div className="page-content">
      <div className="bookings-container">
        <h2>My Bookings</h2>
        
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.service?.name}</h3>
                <span className={`booking-status ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <strong>Booking ID:</strong> {booking.bookingId}
                </div>
                <div className="detail-item">
                  <strong>Amount:</strong> ₹{booking.price}
                </div>
                <div className="detail-item">
                  <strong>Scheduled Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Category:</strong> {booking.service?.category}
                </div>
              </div>

              {booking.vendor && (
                <div style={{ 
                  backgroundColor: '#f0f4f8', 
                  padding: '15px', 
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}>
                  <strong>Vendor Details:</strong>
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>{booking.vendor.businessName}</strong></p>
                    <p>Phone: {booking.vendor.phone}</p>
                    <p>Email: {booking.vendor.email}</p>
                  </div>
                </div>
              )}

              {booking.status === 'Completed' && !booking.customerRating && (
                <div style={{ marginTop: '20px' }}>
                  {selectedBooking === booking._id ? (
                    <div style={{ 
                      backgroundColor: '#ffffff', 
                      padding: '25px', 
                      borderRadius: '16px',
                      border: '1px solid #e0e7ff',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#1a1a1a' }}>Rate Your Experience</h4>
                      
                      <div style={{ marginBottom: '25px' }}>
                        <p style={{ fontSize: '12px', color: '#666', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' }}>Your Rating</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star.toString())}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                fontSize: '32px', 
                                cursor: 'pointer',
                                color: parseInt(rating) >= star ? '#ffc107' : '#e0e0e0',
                                transition: 'transform 0.1s ease',
                                padding: '0'
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '25px' }}>
                        <p style={{ fontSize: '12px', color: '#666', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase' }}>Your Review</p>
                        <textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="What did you like about the service?"
                          rows="3"
                          style={{ 
                            width: '100%', 
                            padding: '15px', 
                            borderRadius: '12px', 
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            resize: 'none',
                            backgroundColor: '#fcfcfc'
                          }}
                        ></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                          className="btn-primary"
                          style={{ flex: 2, padding: '12px', borderRadius: '8px', fontWeight: '700' }}
                          onClick={() => handleRateBooking(booking._id)}
                        >
                          Submit Review
                        </button>
                        <button 
                          className="btn-secondary"
                          style={{ flex: 1, padding: '12px', borderRadius: '8px', fontWeight: '700' }}
                          onClick={() => setSelectedBooking(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="btn-primary"
                      style={{ 
                        width: '100%', 
                        padding: '14px', 
                        borderRadius: '8px', 
                        fontWeight: '700',
                        background: 'linear-gradient(93deg, #2ecc71, #27ae60)',
                        border: 'none'
                      }}
                      onClick={() => setSelectedBooking(booking._id)}
                    >
                      RATE THIS SERVICE
                    </button>
                  )}
                </div>
              )}

              {booking.customerRating && (
                <div style={{ 
                  backgroundColor: '#d1fae5', 
                  padding: '15px', 
                  borderRadius: '5px',
                  marginTop: '15px'
                }}>
                  <strong>Your Rating: ⭐ {booking.customerRating}/5</strong>
                  <p style={{ marginTop: '10px' }}>{booking.customerReview}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No bookings found. Start booking a service!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CustomerBookings;
