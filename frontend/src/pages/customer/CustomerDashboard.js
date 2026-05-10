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
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
    <div className="page-content" style={{ backgroundColor: '#f8fbff' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            Hey {auth?.user?.name}! 👋
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
            What service are you looking for today?
          </p>
        </div>

        {/* Category Selector */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '40px',
          flexWrap: 'wrap',
          padding: '10px 0'
        }}>
          <button 
            className={selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => handleCategoryFilter('')}
            style={{ borderRadius: '99px', padding: '10px 24px', fontWeight: '700', fontSize: '14px' }}
          >
            All Services
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              className={selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleCategoryFilter(cat)}
              style={{ borderRadius: '99px', padding: '10px 24px', fontWeight: '700', fontSize: '14px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredServices.length > 0 ? (
            filteredServices.map(service => {
              const imageMap = {
                'Plumbing': 'https://images.unsplash.com/photo-1503676260728-1c00da096a0b?auto=format&fit=crop&q=80&w=400',
                'Electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
                'Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=400',
                'Carpentry': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400',
                'Painting': 'https://images.unsplash.com/photo-1562259946-08e5475d4a61?auto=format&fit=crop&q=80&w=400',
                'Other': 'https://images.unsplash.com/photo-1454165833767-027eeed9b36d?auto=format&fit=crop&q=80&w=400'
              };
              const serviceImg = imageMap[service.category] || imageMap['Other'];

              return (
                <div key={service._id} className="service-card" style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid #eef2f6',
                  transition: 'transform 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ 
                      backgroundColor: '#e8f1ff', 
                      color: '#008cff', 
                      padding: '4px 12px', 
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '900',
                      textTransform: 'uppercase'
                    }}>
                      {service.category}
                    </span>
                    <div style={{ fontSize: '20px' }}>🔧</div>
                  </div>
                  <div className="service-card-content">
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', marginBottom: '10px' }}>{service.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', height: '64px', overflow: 'hidden' }}>
                      {service.description}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginTop: '25px',
                      paddingTop: '20px',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#999', fontWeight: '700' }}>Starting at</span>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#000' }}>₹{service.basePrice}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#999', display: 'block' }}>⏱ Duration</span>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>{service.estimatedDuration}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ marginTop: '25px', width: '100%', padding: '14px', borderRadius: '10px', fontWeight: '800', letterSpacing: '0.5px' }}
                      onClick={() => handleBookService(service._id)}
                    >
                      BOOK SERVICE
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', backgroundColor: 'white', borderRadius: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ color: '#1a1a1a' }}>No services found</h3>
              <p style={{ color: '#666' }}>Try selecting a different category or browse all services.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default CustomerDashboard;
