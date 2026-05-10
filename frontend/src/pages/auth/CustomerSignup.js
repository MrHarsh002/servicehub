import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function CustomerSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/send-otp-email', { email: formData.email });
      toast.success('OTP sent to your email');
      if (response.data?.devOtp) {
        toast.info(`Dev OTP: ${response.data.devOtp}`, { autoClose: 8000 });
      }
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim()) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/customer/signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        otp: formData.otp
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.customer));
      localStorage.setItem('role', 'customer');

      setAuth({
        token: response.data.token,
        user: response.data.customer,
        role: 'customer'
      });

      toast.success('Signup successful!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-banner">
            <h2>Join Our Service Network</h2>
            <p>Experience seamless home services with verified professionals. Sign up today and get access to exclusive offers and priority booking.</p>
            <div style={{ marginTop: '40px', fontSize: '40px' }}>🏠✨</div>
          </div>
          
          <div className="auth-form-container">
            <h3>{step === 1 ? 'Customer Signup' : 'Verify Email'}</h3>
            
            {step === 1 ? (
              <form onSubmit={handleSendOTP}>
                <div className="form-group">
                  <label>FULL NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label>PHONE NUMBER</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label>CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'CONTINUE'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                  We've sent a 6-digit OTP to <strong>{formData.email}</strong>
                </p>
                
                <div className="form-group">
                  <label>ENTER OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="6-digit code"
                    maxLength="6"
                  />
                  {errors.otp && <div className="form-error">{errors.otp}</div>}
                </div>

                <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                  {loading ? 'Verifying...' : 'VERIFY & SIGNUP'}
                </button>

                <button type="button" className="btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setStep(1)}>
                  BACK
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>Already have an account? <Link to="/customer/login">LOGIN</Link></p>
              <p style={{ marginTop: '10px' }}>Are you a Vendor? <Link to="/vendor/signup">SIGNUP AS VENDOR</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerSignup;
