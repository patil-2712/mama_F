// src/ecommerce/ContactUs.jsx
import React, { useState, useEffect } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("🔍 Fetching contact info from:", `${API_URL}/contact`);
        
        const response = await fetch(`${API_URL}/contact`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Contact data:", data);

        if (data.success && data.data) {
          setContactData(data.data);
        } else {
          setError("Failed to load contact information");
          setContactData(getFallbackData());
        }
      } catch (err) {
        console.error("❌ Error fetching contact:", err);
        setError("Failed to load contact information. Showing default.");
        setContactData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  // Fallback data if API fails
  const getFallbackData = () => {
    return {
      address: "Palm Court Bldg M, 50/1B, 5th Floor, New Link Road, Beside Gorgeon Sports Complex, Malad West, Mumbai, Maharashtra 400064",
      email: "support@assureorganic.com",
      phone: "+91-8888888888",
      timing: "Mon - Sun : 10:00 AM - 07:00 PM",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.456789012345!2d72.83123456789012!3d19.19876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzEwLjAiTiA3MsKwNDknNTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
    };
  };

  // Loading state
  if (loading) {
    return (
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-header">
            <h2 className="contact-title">Contact Us</h2>
          </div>
          <div className="contact-loading">
            <div className="loading-spinner"></div>
            <p>Loading contact information...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Contact Us</h2>
        </div>

        <div className="contact-content">
          {/* Left Side - Contact Info */}
          <div className="contact-info">
            <div className="contact-item">
              <h3 className="contact-subtitle">Our Office Address</h3>
              <p className="contact-text">
                {contactData?.address || "Loading address..."}
              </p>
            </div>

            <div className="contact-item">
              <h3 className="contact-subtitle">General Enquiries</h3>
              <a href={`mailto:${contactData?.email || ''}`} className="contact-link">
                {contactData?.email || "Loading email..."}
              </a>
            </div>

            <div className="contact-item">
              <h3 className="contact-subtitle">Call Us</h3>
              <a href={`tel:${contactData?.phone || ''}`} className="contact-link">
                {contactData?.phone || "Loading phone..."}
              </a>
            </div>

            <div className="contact-item">
              <h3 className="contact-subtitle">Our Timing</h3>
              <p className="contact-text">
                {contactData?.timing || "Mon - Sun : 10:00 AM - 07:00 PM"}
              </p>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="contact-map">
            <div className="map-container">
              <iframe
                src={contactData?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.456789012345!2d72.83123456789012!3d19.19876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDEyJzEwLjAiTiA3MsKwNDknNTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location Map"
                className="map-iframe"
                onError={(e) => {
                  console.error("❌ Map iframe failed to load");
                }}
              />
              <div className="map-overlay">
                <span className="map-label">Get Direction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;