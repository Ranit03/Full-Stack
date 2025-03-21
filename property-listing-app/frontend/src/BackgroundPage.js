import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './background-page.css';

function BackgroundPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const [filters, setFilters] = useState({
    name: "",
    priceMin: "",
    priceMax: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    sortBy: "price",
    sortDirection: "asc"
  });
  const [activeFilters, setActiveFilters] = useState([]);
  
  // New state for property form
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    image_url: ""
  });
  const [postStatus, setPostStatus] = useState(null);

  // Handle new property form input changes
  const handlePropertyInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: name === "price" || name === "bedrooms" || name === "bathrooms" 
        ? parseInt(value) || "" 
        : value
    });
  };

  // Submit new property
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    setPostStatus("posting");
    
    // Validate form
    if (!newProperty.name || !newProperty.price || !newProperty.location || 
        !newProperty.bedrooms || !newProperty.bathrooms) {
      setPostStatus("error");
      return;
    }
    
    // Send to backend
    axios.post("https://full-stack-3-9mxl.onrender.com", newProperty)
      .then(response => {
        console.log("Property posted successfully:", response.data);
        setPostStatus("success");
        
        // Add new property to the current list
        setProperties([...properties, newProperty]);
        
        // Reset form
        setNewProperty({
          name: "",
          price: "",
          location: "",
          bedrooms: "",
          bathrooms: "",
          image_url: ""
        });
        
        // Close form after successful submission
        setTimeout(() => {
          setShowPropertyForm(false);
          setPostStatus(null);
        }, 2000);
      })
      .catch(error => {
        console.error("Error posting property:", error);
        setPostStatus("error");
      });
  };

  // Create star background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create stars with different sizes, brightness and movement
    const stars = [];
    const numStars = Math.floor(canvas.width * canvas.height / 1000);
    
    for (let i = 0; i < numStars; i++) {
      const size = Math.random() * 2 + 0.1;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: size,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.9 ? 
          `rgb(${200 + Math.random() * 55}, ${150 + Math.random() * 105}, ${150 + Math.random() * 105})` : 
          'rgb(255, 255, 255)',
        // Add movement properties
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1
      });
    }
    
    // Add a few "special" stars
    for (let i = 0; i < numStars / 50; i++) {
      const size = Math.random() * 3 + 1;
      const hue = Math.random() * 60 + 180;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: size,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
        color: `hsl(${hue}, 100%, 80%)`,
        // Add movement properties
        vx: Math.random() * 0.3 - 0.15,
        vy: Math.random() * 0.3 - 0.15
      });
    }
    
    // Connection distance threshold
    const connectionDistance = 100;
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // First, draw connections between stars
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const star1 = stars[i];
          const star2 = stars[j];
          
          // Calculate distance between stars
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If stars are close enough, draw a line between them
          if (distance < connectionDistance) {
            // Make the line opacity proportional to distance
            const opacity = 0.2 * (1 - distance / connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
        }
      }
      
      // Then, draw and update stars
      stars.forEach(star => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;
        
        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        // Draw star
        ctx.beginPath();
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = 0.5 + Math.sin(star.twinklePhase) * 0.5;
        const currentOpacity = star.opacity * twinkleFactor;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${currentOpacity})`);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
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
    axios.get("https://full-stack-3-9mxl.onrender.com")
      .then((res) => {
        console.log("Data received:", res.data);
        setProperties(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setError("Failed to fetch from API. Using local data instead.");
        // Fallback to local data if API fails - using public folder
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

  // Update active filters display
  useEffect(() => {
    const newActiveFilters = [];
    
    if (filters.name) newActiveFilters.push(`Name: ${filters.name}`);
    if (filters.priceMin) newActiveFilters.push(`Min Price: $${filters.priceMin}`);
    if (filters.priceMax) newActiveFilters.push(`Max Price: $${filters.priceMax}`);
    if (filters.location) newActiveFilters.push(`Location: ${filters.location}`);
    if (filters.bedrooms) newActiveFilters.push(`Bedrooms: ${filters.bedrooms}+`);
    if (filters.bathrooms) newActiveFilters.push(`Bathrooms: ${filters.bathrooms}+`);
    
    setActiveFilters(newActiveFilters);
  }, [filters]);

  // Apply filters to properties
  const filteredProperties = properties.filter(property => {
    return (
      (!filters.name || property.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.priceMin || property.price >= parseInt(filters.priceMin)) &&
      (!filters.priceMax || property.price <= parseInt(filters.priceMax)) &&
      (!filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms)) &&
      (!filters.bathrooms || property.bathrooms >= parseInt(filters.bathrooms))
    );
  }).sort((a, b) => {
    // Sort properties based on selected criteria
    const direction = filters.sortDirection === 'asc' ? 1 : -1;
    
    switch(filters.sortBy) {
      case 'price':
        return (a.price - b.price) * direction;
      case 'bedrooms':
        return (a.bedrooms - b.bedrooms) * direction;
      case 'bathrooms':
        return (a.bathrooms - b.bathrooms) * direction;
      case 'name':
        return a.name.localeCompare(b.name) * direction;
      default:
        return 0;
    }
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      name: "",
      priceMin: "",
      priceMax: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      sortBy: "price",
      sortDirection: "asc"
    });
  };

  return (
    <div className="background-page">
      <canvas ref={canvasRef} className="star-background"></canvas>
      <div className="container">
        <h1>Property List</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="action-buttons">
          <button 
            className="post-property-button"
            onClick={() => setShowPropertyForm(!showPropertyForm)}
          >
            {showPropertyForm ? "Cancel" : "Post Property"}
          </button>
        </div>
        
        {showPropertyForm && (
          <div className="property-form-container">
            <h2>Post New Property</h2>
            <form onSubmit={handlePropertySubmit} className="property-form">
              <div className="form-group">
                <label>Property Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newProperty.name}
                  onChange={handlePropertyInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Price*</label>
                <input
                  type="number"
                  name="price"
                  value={newProperty.price}
                  onChange={handlePropertyInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location*</label>
                <input
                  type="text"
                  name="location"
                  value={newProperty.location}
                  onChange={handlePropertyInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Bedrooms*</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={newProperty.bedrooms}
                  onChange={handlePropertyInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Bathrooms*</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={newProperty.bathrooms}
                  onChange={handlePropertyInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={newProperty.image_url}
                  onChange={handlePropertyInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <button type="submit" className="submit-button">
                {postStatus === "posting" ? "Posting..." : "Submit Property"}
              </button>
              
              {postStatus === "success" && (
                <div className="success-message">Property posted successfully!</div>
              )}
              
              {postStatus === "error" && (
                <div className="error-message">Error posting property. Please try again.</div>
              )}
            </form>
          </div>
        )}
        
        <div className="filter-panel">
          <h2>Filter Properties</h2>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Property Name</label>
              <input
                type="text"
                name="name"
                placeholder="Search by name"
                value={filters.name}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <input
                  type="number"
                  name="priceMin"
                  placeholder="Min $"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                />
                <span>to</span>
                <input
                  type="number"
                  name="priceMax"
                  placeholder="Max $"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Bedrooms</label>
              <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Bathrooms</label>
              <select name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange}>
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <div className="sort-controls">
                <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                  <option value="price">Price</option>
                  <option value="bedrooms">Bedrooms</option>
                  <option value="bathrooms">Bathrooms</option>
                  <option value="name">Name</option>
                </select>
                <select name="sortDirection" value={filters.sortDirection} onChange={handleFilterChange}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            
            <div className="filter-group" style={{ marginTop: "10px" }}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="City or area"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            
            <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="active-filters">
            <span>Active Filters:</span>
            {activeFilters.map((filter, index) => (
              <span key={index} className="filter-tag">{filter}</span>
            ))}
          </div>
        )}
        
        {loading ? (
          <div className="loading">Loading properties data...</div>
        ) : (
          <div className="data-summary">
            <h2>Properties Found: {filteredProperties.length}</h2>
            <div className="property-grid">
              {filteredProperties.map((property, index) => (
                <div key={index} className="property-card">
                  <h3>{property.name}</h3>
                  <p className="price">${property.price.toLocaleString()}</p>
                  <p><i className="location-icon"></i> {property.location}</p>
                  <div className="property-features">
                    <span>{property.bedrooms} bedrooms, {property.bathrooms} bathrooms</span>
                    {/* Removed hasGarage icon/span */}
                    {/* Removed hasPool icon/span */}
                    {/* Removed property type icon/span */}
                  </div>
                  {property.image_url && <img src={property.image_url} alt={property.name} />}
                  {property.description && <p className="description">{property.description}</p>}
                  {property.squareFeet && <p>Area: {property.squareFeet} sq ft</p>}
                  {property.yearBuilt && <p>Year Built: {property.yearBuilt}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BackgroundPage;



















