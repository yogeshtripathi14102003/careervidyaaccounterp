import React from 'react';

import './cardsection.css';
const ServiceSection = () => {
  const services = [
    {
      id: 1,
      title: 'E-Commerce',
      description: 'Revolutionizing business processes with AI & ML in retail.',
      image: 'https://picsum.photos/400/800?random=11' // Replace with your local image
    },
    {
      id: 2,
      title: 'Travel & Hospitality',
      description: 'Enhancing customer experience and boosting earnings.',
      image: 'https://picsum.photos/400/800?random=12'
    },
    {
      id: 3,
      title: 'Education',
      description: 'Digital transformation in learning and management.',
      image: 'https://picsum.photos/400/800?random=13'
    },
    {
      id: 4,
      title: 'Healthcare',
      description: 'Smart tech for better patient care and efficiency.',
      image: 'https://picsum.photos/400/800?random=14'
    }
  ];

  return (
    <section className="custom-service-wrapper">
      <div className="service-flex-container">
        {services.map((item) => (
          <div 
            key={item.id} 
            className="service-item" 
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Dark Overlay jo image ko thoda neela/kaala touch deta hai */}
            <div className="service-overlay">
              <div className="service-text-content">
                <h3 className="service-title">{item.title}</h3>
                <p className="service-desc">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;