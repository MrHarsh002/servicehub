import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import CustomerSignup from './pages/auth/CustomerSignup';
import CustomerLogin from './pages/auth/CustomerLogin';
import VendorSignup from './pages/auth/VendorSignup';
import VendorLogin from './pages/auth/VendorLogin';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorBookings from './pages/vendor/VendorBookings';
import ServiceDetails from './pages/ServiceDetails';

// Context
import AuthContext from './context/AuthContext';

// CSS
import './App.css';

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setAuth({
        token,
        user: JSON.parse(user),
        role: localStorage.getItem('role')
      });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setAuth(null);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <Router>
      <AuthContext.Provider value={{ auth, setAuth, logout }}>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/customer/signup" element={<CustomerSignup />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/vendor/signup" element={<VendorSignup />} />
            <Route path="/vendor/login" element={<VendorLogin />} />

            {/* Customer Routes */}
            <Route 
              path="/customer/dashboard" 
              element={auth?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/customer/login" />} 
            />
            <Route 
              path="/customer/bookings" 
              element={auth?.role === 'customer' ? <CustomerBookings /> : <Navigate to="/customer/login" />} 
            />
            <Route 
              path="/service/:id" 
              element={auth?.role === 'customer' ? <ServiceDetails /> : <Navigate to="/customer/login" />} 
            />

            {/* Vendor Routes */}
            <Route 
              path="/vendor/dashboard" 
              element={auth?.role === 'vendor' ? <VendorDashboard /> : <Navigate to="/vendor/login" />} 
            />
            <Route 
              path="/vendor/bookings" 
              element={auth?.role === 'vendor' ? <VendorBookings /> : <Navigate to="/vendor/login" />} 
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
