import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Initialize state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup');

  return (
    <nav className={`navbar ${(!isHomePage || scrolled) ? 'navbar-scrolled' : 'navbar-transparent'}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">make</span>
          <span className="logo-box">my</span>
          <span className="logo-text">service</span>
        </Link>
        
        <ul className="navbar-links">
          {!isHomePage && !isAuthPage && <li><Link to="/">Home</Link></li>}
          {auth?.role === 'customer' && (
            <>
              <li><Link to="/customer/dashboard">Dashboard</Link></li>
              <li><Link to="/customer/bookings">My Bookings</Link></li>
            </>
          )}
          {auth?.role === 'vendor' && (
            <>
              <li><Link to="/vendor/dashboard">Dashboard</Link></li>
              <li><Link to="/vendor/bookings">Work List</Link></li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {auth ? (
            <div className="user-profile">
              <div className="avatar">{auth.user.name?.[0] || auth.user.businessName?.[0]}</div>
              <div className="user-info">
                <span className="welcome-text">Hey {auth.user.name || auth.user.businessName}</span>
                <button type="button" onClick={logout} className="logout-link">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="login-btns">
              <Link to="/customer/login" className="btn-login-mmt">
                Login or Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
