import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom user location icon
const userIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjNDI4NWY0IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom service location icon
const serviceIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDMyIDQwIj48cGF0aCBkPSJNMTYgMEM4LjI3IDAgMiA2LjI3IDIgMTRjMCA3IDE0IDI2IDE0IDI2czE0LTE5IDE0LTI2YzAtNy43Ni02LjI3LTE0LTE0LTE0eiIgZmlsbD0iI2U3NDAyYyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  iconSize: [32, 40],
  iconAnchor: [16, 40],
});

// Sample service locations
const serviceLocations = [
  {
    id: 1,
    name: 'Downtown Wash Station',
    lat: 40.7128,
    lng: -74.0060,
    type: 'station',
    distance: '0.5 km',
  },
  {
    id: 2,
    name: 'Midtown Mobile Unit',
    lat: 40.7580,
    lng: -73.9855,
    type: 'mobile',
    distance: '1.2 km',
  },
  {
    id: 3,
    name: 'East Side Professional',
    lat: 40.7489,
    lng: -73.9680,
    type: 'station',
    distance: '2.3 km',
  },
];

function MapController({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13);
    }
  }, [userLocation, map]);

  return null;
}

export default function MapComponent({ userLocation, onMarkerClick }) {
  const [locatingUser, setLocatingUser] = useState(false);

  const handleLocateClick = () => {
    setLocatingUser(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Location update would trigger through parent state
          setLocatingUser(false);
        },
        () => {
          console.error('Unable to get location');
          setLocatingUser(false);
        }
      );
    }
  };

  if (!userLocation) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        center={userLocation}
        zoom={13}
        className="leaflet-map-container"
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Map Controller */}
        <MapController userLocation={userLocation} />

        {/* User Current Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="popup-content">
                <h4>Your Location</h4>
                <p>Current position</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Service Location Markers */}
        {serviceLocations.map((service) => (
          <Marker
            key={service.id}
            position={[service.lat, service.lng]}
            icon={serviceIcon}
            eventHandlers={{
              click: () => onMarkerClick(service),
            }}
          >
            <Popup>
              <div className="popup-content">
                <h4>{service.name}</h4>
                <p>Type: {service.type}</p>
                <p>Distance: {service.distance}</p>
                <button
                  className="popup-btn"
                  onClick={() => onMarkerClick(service)}
                >
                  Book Service
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Locate User Button */}
      <button
        className={`locate-btn ${locatingUser ? 'locating' : ''}`}
        onClick={handleLocateClick}
        title="Locate me"
      >
        {locatingUser ? '⌛' : '📍'}
      </button>
    </div>
  );
}
