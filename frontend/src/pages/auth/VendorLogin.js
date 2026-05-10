import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function VendorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/vendor/login', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.vendor));
      localStorage.setItem('role', 'vendor');

      setAuth({
        token: response.data.token,
        user: response.data.vendor,
        role: 'vendor'
      });

      toast.success('Login successful!');
      navigate('/vendor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
            <h2>Vendor Partner Portal</h2>
            <p>Grow your business with us. Manage your service requests, track earnings, and provide top-notch service to our customers.</p>
            <div style={{ marginTop: '40px', fontSize: '40px' }}>💼📈</div>
          </div>
          
          <div className="auth-form-container">
            <h3>Vendor Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>BUSINESS EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter business email"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>

            <div className="auth-footer">
              <p>New partner? <Link to="/vendor/signup">REGISTER BUSINESS</Link></p>
              <p style={{ marginTop: '10px' }}>Are you a Customer? <Link to="/customer/login">LOGIN AS CUSTOMER</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorLogin;
