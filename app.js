import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ 
    name: "", 
    price: "", 
    location: "", 
    bedrooms: "", 
    bathrooms: "" 
  });

  useEffect(() => {
    axios.get("https://full-stack-8-da76.onrender.com/api/properties")
      .then((res) => {
        setProperties(res.data);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        // Fallback to local data if API fails - using public folder
        fetch('/properties.json')
          .then(response => response.json())
          .then(data => {
            console.log("Using local data instead");
            setProperties(data);
          })
          .catch(err => console.error("Could not load local data either:", err));
      });
  }, []);

  const applyFilters = (prop) => {
    return (
      (filters.name === "" || prop.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.price === "" || prop.price <= filters.price) &&
      (filters.location === "" || prop.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.bedrooms === "" || prop.bedrooms === parseInt(filters.bedrooms)) &&
      (filters.bathrooms === "" || prop.bathrooms === parseInt(filters.bathrooms))
    );
  };

  return (
    <div className="container">
      <h1>Property Listings</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Property Name"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Bedrooms"
          onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
        />
        <input
          type="number"
          placeholder="Bathrooms"
          onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
        />
      </div>
      <div className="listings">
        {properties.filter(applyFilters).map((property) => (
          <div key={property.id || property.name} className="card">
            <img src={property.image_url} alt={property.name} />
            <h2>{property.name}</h2>
            <p>Price: ${property.price}</p>
            <p>Location: {property.location}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
