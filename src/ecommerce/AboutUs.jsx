// AboutUs.jsx
import React, { useState, useEffect } from "react";
import "./AboutUs.css";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000";

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

  // Get image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  // Loading state
  if (loading) {
    return (
      <section className="about-section-full">
        <div className="about-container-full">
          <div className="about-loading-full">
            <div className="loading-spinner-full"></div>
            <p>Loading about us...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state - show fallback content
  if (error || !aboutData) {
    return (
      <section className="about-section-full">
        <div className="about-container-full">
          <div className="about-header-full">
            <h2 className="about-title-full">About Us</h2>
          </div>

          {/* Section 1 - Fallback */}
          <div className="about-content-full">
            <div className="about-image-wrapper-full">
              <img 
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=500&fit=crop" 
                alt="Our Story" 
                className="about-image-full"
              />
            </div>
            <div className="about-text-wrapper-full">
              <h3 className="about-subtitle-full">Our Story</h3>
              <p className="about-description-full">
                As pioneers in the realm of health food products, herbal cosmetics and aromatherapy, 
                we at Assure Organic Zone have come a long way. Over a while, we have modified our 
                repertoire and now offer a vast range of products that enhance health and appearance. 
                Located at Malad West, Mumbai, Maharashtra we are now a one-stop shop that caters to 
                all your health needs. Among our product range we have all organic essentials, low 
                calorie foods, cereals, infant foods and many more.
              </p>
            </div>
          </div>

          {/* Section 2 - Fallback (Reversed) */}
          {/*<div className="about-content-full reverse">
            <div className="about-image-wrapper-full">
              <img 
                src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=500&fit=crop" 
                alt="Our Mission" 
                className="about-image-full"
              />
            </div>
            <div className="about-text-wrapper-full">
              <h3 className="about-subtitle-full">Our Mission</h3>
              <p className="about-description-full">
                With a plethora of products that gives you the organic substitute for all your food 
                requirements, it is India's contribution to the global organic revolution. We are 
                striding ahead with the aim of improving the quality of life by improving the quality 
                of food. Contact us today to grab the best deals on organic and natural products that 
                will transform your health and wellbeing.
              </p>
            </div>
          </div>*/}
        </div>
      </section>
    );
  }

  return (
    <section className="about-section-full">
      <div className="about-container-full">
        <div className="about-header-full">
          <h2 className="about-title-full">About Us</h2>
        </div>

      

        {/* Section 2: Second Image and Text (Reversed) */}
        <div className="about-content-full reverse">
          <div className="about-image-wrapper-full">
            <img 
              src={getImageUrl(aboutData.image2)} 
              alt={aboutData.title2 || "Our Mission"} 
              className="about-image-full"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=500&fit=crop";
              }}
            />
          </div>
          <div className="about-text-wrapper-full">
            <h3 className="about-subtitle-full">{aboutData.title2 || "Our Mission"}</h3>
            <p className="about-description-full">
              {aboutData.paragraph2 || "Loading content..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;