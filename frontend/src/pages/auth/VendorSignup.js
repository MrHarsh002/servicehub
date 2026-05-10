import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function VendorSignup() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    licenseNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/vendor/signup', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.vendor));
      localStorage.setItem('role', 'vendor');

      setAuth({
        token: response.data.token,
        user: response.data.vendor,
        role: 'vendor'
      });

      toast.success('Vendor signup successful!');
      navigate('/vendor/dashboard');
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
        <div className="auth-card" style={{ maxWidth: '1000px' }}>
          <div className="auth-banner">
            <h2>Partner with Us</h2>
            <p>Join thousands of service providers who trust our platform to scale their business. Quick onboarding, verified leads, and secure payments.</p>
            <div style={{ marginTop: '40px', fontSize: '40px' }}>🛠️🤝</div>
          </div>

          <div className="auth-form-container" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <h3>Register Your Business</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>BUSINESS NAME</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Quick Fix Solutions"
                />
                {errors.businessName && <div className="form-error">{errors.businessName}</div>}
              </div>

              <div className="form-group">
                <label>OWNER NAME</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
                {errors.ownerName && <div className="form-error">{errors.ownerName}</div>}
              </div>

              <div className="form-group">
                <label>BUSINESS EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
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
                  placeholder="Enter contact number"
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label>SERVICE CATEGORY</label>
                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--border-gray)', padding: '12px 0', fontWeight: '700' }}>
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label>LICENSE / REGISTRATION NO.</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter registration ID"
                />
                {errors.licenseNumber && <div className="form-error">{errors.licenseNumber}</div>}
              </div>

              <div className="form-group">
                <label>CREATE PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
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
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>

              <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
                {loading ? 'REGISTERING...' : 'REGISTER BUSINESS'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already a partner? <Link to="/vendor/login">LOGIN</Link></p>
              <p style={{ marginTop: '10px' }}>Are you a Customer? <Link to="/customer/signup">SIGNUP AS CUSTOMER</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorSignup;
