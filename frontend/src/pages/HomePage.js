import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import api from '../api/axios';

function HomePage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Other'];
  const popularCities = ['Mumbai', 'Bengaluru', 'Hyderabad', 'Pune'];
  const trendingOffers = [
    {
      title: 'First Booking Bonus',
      text: 'Get up to 15% instant discount on your first confirmed service.',
      tag: 'New User'
    },
    {
      title: 'Home Deep-Clean Week',
      text: 'Flat Rs 500 off on premium cleaning slots this weekend.',
      tag: 'Limited'
    },
    {
      title: 'Priority Vendor Access',
      text: 'Book top-rated professionals with same-day availability.',
      tag: 'Top Pick'
    }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setError(null);
      const response = await api.get('/services');
      setServices(response.data.services || []);
      setFilteredServices(response.data.services || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Could not connect to the server. Please check if the backend is running and the database is connected.');
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
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login as customer to book services');
      navigate('/customer/login');
      return;
    }
    navigate(`/service/${serviceId}`);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Plumbing: '🚿',
      Electrical: '💡',
      Cleaning: '🧼',
      Carpentry: '🔨',
      Painting: '🎨',
      Other: '⚙️'
    };
    return iconMap[category] || '⚙️';
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

      <section className="mmt-hero">
        <div className="mmt-hero-content container">
          <h1>Book Trusted Professionals Near You</h1>

          <div className="mmt-search-card fade-in">
            <div className="mmt-category-tabs">
              <button
                type="button"
                className={!selectedCategory ? 'mmt-tab active' : 'mmt-tab'}
                onClick={() => handleCategoryFilter('')}
              >
                <span>🛠️</span>
                All Services
              </button>
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={selectedCategory === cat ? 'mmt-tab active' : 'mmt-tab'}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  <span>{getCategoryIcon(cat)}</span>
                  {cat}
                </button>
              ))}
            </div>

            <div className="mmt-search-row">
              <div className="mmt-field">
                <span>LOCATION</span>
                <select defaultValue="Mumbai">
                  {popularCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mmt-field">
                <span>SERVICE CATEGORY</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mmt-field no-arrow">
                <span>PREFERRED DATE</span>
                <h4>Today</h4>
              </div>
            </div>

            <div className="mmt-search-btn-container">
              <button type="button" className="btn-primary mmt-search-btn">
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mmt-offers container">
        <div className="section-headline">
          <h2>Trending offers</h2>
        </div>
        <div className="mmt-offers-grid">
          {trendingOffers.map((offer) => (
            <article className="mmt-offer-card" key={offer.title}>
              <span>{offer.tag}</span>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container services-section">
        <div className="section-headline">
          <h2>Available services</h2>
          <p>{filteredServices.length} results</p>
        </div>
      </section>

      <div className="services-grid container">
        {error ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#e91e63', fontWeight: '700' }}>{error}</p>
            <button className="btn-primary" onClick={fetchServices} style={{ marginTop: '16px' }}>
              Retry
            </button>
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div key={service._id} className="service-card">
              <div className="service-card-image">{getCategoryIcon(service.category)}</div>
              <div className="service-card-content">
                <span className="category">{service.category}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="price">₹{service.basePrice}</div>
                <small>Est. Duration: {service.estimatedDuration}</small>
                <button 
                  className="btn-primary" 
                  style={{ marginTop: '16px', width: '100%' }}
                  onClick={() => handleBookService(service._id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p>No services found</p>
          </div>
        )}
      </div>

      <section className="container mmt-footer-note">
        <p>Need urgent support? Book verified experts with fast response slots.</p>
      </section>
    </>
  );
}

export default HomePage;
