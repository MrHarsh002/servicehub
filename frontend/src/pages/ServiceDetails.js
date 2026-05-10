import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    description: '',
    address: '',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.role !== 'customer') {
      navigate('/customer/login');
      return;
    }
    fetchService();
  }, [id, auth, navigate]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${id}`);
      setService(response.data.service);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast.error('Failed to fetch service details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!bookingData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
    if (!bookingData.address.trim()) newErrors.address = 'Address is required';
    if (!bookingData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        serviceId: id,
        ...bookingData,
        price: service.basePrice
      });

      toast.success('Booking confirmed!');
      navigate('/customer/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 40px' }}>
          <h2>Service not found</h2>
          <button onClick={() => navigate('/customer/dashboard')}>Back to Services</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="page-content" style={{ backgroundColor: '#f5f7fa', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <button 
            onClick={() => navigate('/customer/dashboard')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#008cff', 
              cursor: 'pointer', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '20px',
              padding: '0'
            }}
          >
            ← Back to Services
          </button>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '40px', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.05)' 
          }}>
            <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', color: '#1a1a1a', marginBottom: '10px' }}>{service.name}</h2>
              <span style={{ 
                backgroundColor: '#e8f1ff', 
                color: '#008cff', 
                padding: '4px 12px', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: '700' 
              }}>
                {service.category}
              </span>
              <p style={{ marginTop: '15px', color: '#666', lineHeight: '1.6' }}>{service.description}</p>
            </div>

            <form onSubmit={handleBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Date & Time</label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                  {errors.scheduledDate && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.scheduledDate}</div>}
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={bookingData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                  />
                  {errors.city && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.city}</div>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Service Address</label>
                <input
                  type="text"
                  name="address"
                  value={bookingData.address}
                  onChange={handleChange}
                  placeholder="Street name, house/flat no."
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                {errors.address && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.address}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Additional Instructions (Optional)</label>
                <textarea
                  name="description"
                  value={bookingData.description}
                  onChange={handleChange}
                  placeholder="Any specific details for the vendor..."
                  rows="3"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                ></textarea>
              </div>

              <div style={{ 
                backgroundColor: '#f9f9f9', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Amount to Pay</span>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>₹{service.basePrice}</div>
                </div>
                <div style={{ textAlign: 'right', color: '#666', fontSize: '14px' }}>
                  ⏱ Duration: {service.estimatedDuration}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '16px', borderRadius: '8px', fontSize: '16px', fontWeight: '700' }}
                disabled={submitting}
              >
                {submitting ? 'Confirming...' : 'Book Service Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceDetails;
