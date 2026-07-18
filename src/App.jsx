import React, { useState, useEffect } from 'react';
import CustomerMap from './components/CustomerMap';
import ServiceBooking from './components/ServiceBooking';
import './App.css';

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Get user's current location on app load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to a center location if geolocation fails
          setUserLocation([40.7128, -74.0060]); // NYC as default
        }
      );
    }
  }, []);

  const handleMarkerClick = (service) => {
    setSelectedService(service);
    setShowBooking(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mobile Wash Pros</h1>
        <p className="subtitle">Professional Mobile Services</p>
      </header>

      <main className="app-main">
        {userLocation && (
          <CustomerMap
            initialCenter={userLocation}
            initialZoom={12}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </main>

      {showBooking && selectedService && (
        <ServiceBooking
          service={selectedService}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}
