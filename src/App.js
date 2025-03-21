import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import "./App.css";

function App() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ 
    name: "", 
    price: "", 
    bedrooms: "", 
    bathrooms: "" 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const particlesRef = useRef(null);

  // Add mouse position tracking for cards
  const handleCardMouseMove = (e, cardElement) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Limit the rotation to a small amount (5 degrees)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    // Apply the transform
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    
    // Add glow effect based on mouse position
    const percentX = x / rect.width * 100;
    const percentY = y / rect.height * 100;
    cardElement.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(40, 80, 100, 0.9), rgba(25, 40, 50, 0.8))`;
  };
  
  const handleCardMouseLeave = (cardElement) => {
    // Reset the transform and background when mouse leaves
    cardElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    cardElement.style.background = 'rgba(25, 40, 50, 0.8)';
  };

  // Particles animation
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const numParticles = 80;
    
    // Create particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch properties data
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get("https://full-stack-8-da76.onrender.com/api/properties")
      .then((res) => {
        console.log("Data received:", res.data);
        setProperties(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch from API. Using local data instead.");
        // Fallback to local data if API fails
        fetch('/properties.json')
          .then(response => response.json())
          .then(data => {
            console.log("Using local data instead");
            setProperties(data);
            setLoading(false);
          })
          .catch(err => {
            console.error("Could not load local data either:", err);
            setError("Failed to load property data");
            setLoading(false);
          });
      });
  }, []);

  const applyFilters = (property) => {
    return (
      (!filters.name || property.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.price || property.price <= parseInt(filters.price)) &&
      (!filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms)) &&
      (!filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms))
    );
  };

  // Force background color on mount
  useEffect(() => {
    // Target all possible elements
    const elements = [
      document.documentElement,
      document.body,
      document.getElementById('root')
    ];
    
    elements.forEach(el => {
      if (el) {
        el.style.backgroundColor = '#121212';
        el.style.background = '#121212';
        el.style.color = '#ffffff';
      }
    });
    
    // Create and inject a style tag
    const style = document.createElement('style');
    style.textContent = `
      html, body, #root, .app-wrapper, .background, .container {
        background-color: #121212 !important;
        background: #121212 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add these new state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 3; // Changed from 6 to 3
  
  // Calculate which properties to display
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.filter(applyFilters).slice(indexOfFirstProperty, indexOfLastProperty);
  
  // Calculate total pages
  const totalPages = Math.ceil(properties.filter(applyFilters).length / propertiesPerPage);
  
  // Functions to change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '20px'
    }}>
      <div className="background"></div>
      <canvas ref={particlesRef} className="particles"></canvas>
      <div className="container">
        <h1 style={{ fontSize: '1.2rem', margin: '5px 0' }}>Property Listings</h1>
        
        {error && <div className="error-message" style={{ fontSize: '0.7rem' }}>{error}</div>}
        
        <div className="filters" style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '5px' }}>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            style={{ padding: '2px', fontSize: '0.6rem', height: '20px', width: '60px' }}
          />
          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setFilters({ ...filters, price: e.target.value })}
            style={{ padding: '2px', fontSize: '0.6rem', height: '20px', width: '60px' }}
          />
          <input
            type="number"
            placeholder="Beds"
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
            style={{ padding: '2px', fontSize: '0.6rem', height: '20px', width: '60px' }}
          />
          <input
            type="number"
            placeholder="Baths"
            onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
            style={{ padding: '2px', fontSize: '0.6rem', height: '20px', width: '60px' }}
          />
        </div>
        
        {loading ? (
          <div className="loading">Loading properties...</div>
        ) : (
          <>
            <div className="listings">
              {currentProperties.map((property) => (
                <div 
                  key={property.id || property.name} 
                  className="card"
                  onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
                >
                  <img src={property.image_url} alt={property.name} />
                  <div className="card-content">
                    <h2>{property.name}</h2>
                    <p>${property.price.toLocaleString()} | {property.bedrooms} bedrooms, {property.bathrooms} bathrooms</p>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;






















