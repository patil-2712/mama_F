// About1.jsx
import React, { useState, useEffect } from "react";
import "./About1.css";

const About1 = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("🔍 Fetching about page data from:", `${API_URL}/about`);
        
        const response = await fetch(`${API_URL}/about`, {
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
        console.log("📦 About data:", data);

        if (data.success && data.data) {
          setAboutData(data.data);
        } else {
          setError("Failed to load about page data");
        }
      } catch (err) {
        console.error("❌ Error fetching about:", err);
        setError("Failed to load about page. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="about-page">
        <div className="about-page-container">
          <div className="about-loading">
            <div className="loading-spinner"></div>
            <p>Loading about page...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show fallback content
  if (error || !aboutData) {
    return (
      <div className="about-page">
        <div className="about-page-container">
          <div className="about-page-header">
            <h1 className="about-page-title">About Us</h1>
            <p className="about-page-subtitle">Learn more about our journey and commitment to quality</p>
          </div>

          <div className="about-page-content">
            {/* Fallback Section 1: Our Story */}
            <div className="about-section-block">
              <div className="about-section-image">
                <img 
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop" 
                  alt="Our Story" 
                />
              </div>
              <div className="about-section-text">
                <h2 className="about-section-title">Our Story</h2>
                <p>
                  As pioneers in the realm of health food products, herbal cosmetics and aromatherapy, 
                  we at Assure Organic Zone have come a long way. Over a while, we have modified our 
                  repertoire and now offer a vast range of products that enhance health and appearance.
                </p>
                <p>
                  Located at Malad West, Mumbai, Maharashtra we are now a one-stop shop that caters to 
                  all your health needs. Among our product range we have all organic essentials, low 
                  calorie foods, cereals, infant foods and many more.
                </p>
              </div>
            </div>

            {/* Fallback Section 2: Our Mission */}
            <div className="about-section-block reverse">
              <div className="about-section-image">
                <img 
                  src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=400&fit=crop" 
                  alt="Our Mission" 
                />
              </div>
              <div className="about-section-text">
                <h2 className="about-section-title">Our Mission</h2>
                <p>
                  With a plethora of products that gives you the organic substitute for all your food 
                  requirements, it is India's contribution to the global organic revolution. We are 
                  striding ahead with the aim of improving the quality of life by improving the quality 
                  of food.
                </p>
                <p>
                  Contact us today to grab the best deals on organic and natural products that will 
                  transform your health and wellbeing.
                </p>
              </div>
            </div>

            {/* Features Section */}
            <div className="about-features-section">
              <h2 className="about-features-title">Why Choose Us</h2>
              <div className="about-features-grid">
                <div className="about-feature-card">
                  <div className="feature-icon">🌿</div>
                  <h3>100% Organic</h3>
                  <p>All our products are certified organic and free from harmful chemicals.</p>
                </div>
                <div className="about-feature-card">
                  <div className="feature-icon">💪</div>
                  <h3>Premium Quality</h3>
                  <p>We source only the finest ingredients for all our health products.</p>
                </div>
                <div className="about-feature-card">
                  <div className="feature-icon">🚚</div>
                  <h3>Fast Delivery</h3>
                  <p>We deliver your orders quickly and safely to your doorstep.</p>
                </div>
                <div className="about-feature-card">
                  <div className="feature-icon">⭐</div>
                  <h3>Customer Satisfaction</h3>
                  <p>Our customers love our products and keep coming back for more.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  return (
    <div className="about-page">
      <div className="about-page-container">
        <div className="about-page-header">
          <h1 className="about-page-title">About Us</h1>
          <p className="about-page-subtitle">Learn more about our journey and commitment to quality</p>
        </div>

        <div className="about-page-content">
          {/* Section 1: Dynamic Content */}
          <div className="about-section-block">
            <div className="about-section-image">
              <img 
                src={getImageUrl(aboutData.image1)} 
                alt={aboutData.title1 || "Our Story"} 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop";
                }}
              />
            </div>
            <div className="about-section-text">
              <h2 className="about-section-title">{aboutData.title1 || "Our Story"}</h2>
              <p>{aboutData.paragraph1 || "Loading content..."}</p>
            </div>
          </div>

          {/* Section 2: Dynamic Content */}
          <div className="about-section-block reverse">
            <div className="about-section-image">
              <img 
                src={getImageUrl(aboutData.image2)} 
                alt={aboutData.title2 || "Our Mission"} 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=400&fit=crop";
                }}
              />
            </div>
            <div className="about-section-text">
              <h2 className="about-section-title">{aboutData.title2 || "Our Mission"}</h2>
              <p>{aboutData.paragraph2 || "Loading content..."}</p>
            </div>
          </div>

          {/* Section 3: Why Choose Us (Static Features) */}
          <div className="about-features-section">
            <h2 className="about-features-title">Why Choose Us</h2>
            <div className="about-features-grid">
              <div className="about-feature-card">
                <div className="feature-icon">🌿</div>
                <h3>100% Organic</h3>
                <p>All our products are certified organic and free from harmful chemicals.</p>
              </div>
              <div className="about-feature-card">
                <div className="feature-icon">💪</div>
                <h3>Premium Quality</h3>
                <p>We source only the finest ingredients for all our health products.</p>
              </div>
              <div className="about-feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>We deliver your orders quickly and safely to your doorstep.</p>
              </div>
              <div className="about-feature-card">
                <div className="feature-icon">⭐</div>
                <h3>Customer Satisfaction</h3>
                <p>Our customers love our products and keep coming back for more.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About1;