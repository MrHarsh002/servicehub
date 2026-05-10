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
        <div className="spinner-wrapper">
          <div className="spinner"></div>
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
                <div className="vendor-info-box">
                  <strong>Vendor Details:</strong>
                  <div className="vendor-contact-info">
                    <p><strong>{booking.vendor.businessName}</strong></p>
                    <p>Phone: {booking.vendor.phone}</p>
                    <p>Email: {booking.vendor.email}</p>
                  </div>
                </div>
              )}

              {booking.status === 'Completed' && !booking.customerRating && (
                <div className="booking-rate-section">
                  {selectedBooking === booking._id ? (
                    <div className="rating-modal-v2">
                      <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#1a1a1a' }}>Rate Your Experience</h4>
                      
                      <div className="form-group">
                        <label>Your Rating</label>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star.toString())}
                              className="star-btn"
                              style={{ color: parseInt(rating) >= star ? '#ffc107' : '#e0e0e0' }}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                          className="review-textarea"
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="What did you like about the service?"
                          rows="3"
                        ></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                          className="btn-primary"
                          style={{ flex: 2 }}
                          onClick={() => handleRateBooking(booking._id)}
                        >
                          Submit
                        </button>
                        <button 
                          className="btn-secondary"
                          style={{ flex: 1 }}
                          onClick={() => setSelectedBooking(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="btn-rate-service"
                      onClick={() => setSelectedBooking(booking._id)}
                    >
                      RATE THIS SERVICE
                    </button>
                  )}
                </div>
              )}

              {booking.customerRating && (
                <div className="completed-rating-box">
                  <strong>Your Rating: ⭐ {booking.customerRating}/5</strong>
                  <p style={{ marginTop: '10px' }}>{booking.customerReview}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No bookings found. Start booking a service!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CustomerBookings;
