import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';

function CustomerDashboard() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Other'];

  useEffect(() => {
    if (auth?.role !== 'customer') {
      navigate('/customer/login');
      return;
    }
    fetchServices();
  }, [auth, navigate]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services || []);
      setFilteredServices(response.data.services || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredServices(services.filter(s => s.category === category));
    } else {
      setFilteredServices(services);
    }
  };

  const handleBookService = (serviceId) => {
    navigate(`/service/${serviceId}`);
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
      
    <div className="page-content dashboard-bg">
      <div className="container">
        <div className="dashboard-header">
          <h2>Hey {auth?.user?.name}! 👋</h2>
          <p>What service are you looking for today?</p>
        </div>

        {/* Category Selector */}
        <div className="category-filter-bar">
          <button 
            className={selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => handleCategoryFilter('')}
          >
            All Services
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="services-grid">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => {
              return (
                <div key={service._id} className="service-card-v2">
                  <div className="service-card-header">
                    <span className="service-card-badge">{service.category}</span>
                    <div style={{ fontSize: '20px' }}>🔧</div>
                  </div>
                  <div className="service-card-content">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-card-footer">
                      <div className="price-box">
                        <span>Starting at</span>
                        <div className="amount">₹{service.basePrice}</div>
                      </div>
                      <div className="duration-box">
                        <span>⏱ Duration</span>
                        <span className="time">{service.estimatedDuration}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-primary btn-book-full" 
                      onClick={() => handleBookService(service._id)}
                    >
                      BOOK SERVICE
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3>No services found</h3>
              <p>Try selecting a different category or browse all services.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default CustomerDashboard;
