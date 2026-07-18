import React, { useState } from 'react';
import './ServiceBooking.css';

export default function ServiceBooking({ service, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'standard',
    date: '',
    time: '',
    vehicle: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      service: service.name,
      ...formData,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you for your booking at {service.name}</p>
            <p>You will receive a confirmation email shortly.</p>
          </div>
        ) : (
          <>
            <div className="booking-header">
              <h2>Book Service</h2>
              <p className="service-name">{service.name}</p>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <fieldset className="form-section">
                <legend>Your Information</legend>

                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
              </fieldset>

              {/* Service Details */}
              <fieldset className="form-section">
                <legend>Service Details</legend>

                <div className="form-group">
                  <label htmlFor="serviceType">Service Type *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="standard">Standard Wash</option>
                    <option value="premium">Premium Detail</option>
                    <option value="express">Express Service</option>
                    <option value="custom">Custom Service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="vehicle">Vehicle Type *</label>
                  <input
                    id="vehicle"
                    type="text"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Toyota Camry 2020"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date *</label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">Preferred Time *</label>
                    <input
                      id="time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </fieldset>

              {/* Additional Notes */}
              <fieldset className="form-section">
                <legend>Additional Information</legend>

                <div className="form-group">
                  <label htmlFor="notes">Special Requests</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions or requests?"
                    rows="3"
                  />
                </div>
              </fieldset>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Confirm Booking
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
