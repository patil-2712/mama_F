// src/ecommerce/ImageSlider.jsx
import React, { useState, useEffect } from "react";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000";

  const getDefaultSlides = () => {
    return [
      {
        id: 1,
        title: "Greener, Healthier, Natural",
        description: "Pure plant-based proteins and clean organic foods.",
        cta: "Explore Now",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1200&h=600&fit=crop", // Healthy food image
        badge: "Organic"
      },
      {
        id: 2,
        title: "Pure Organic Superfoods",
        description: "100% Certified Clean Ingredients for Your Daily Nutrition.",
        cta: "Shop Now",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1570813875851-28e5b16f0fb0?w=1200&h=600&fit=crop", // Food ingredients
        badge: "Premium"
      },
      {
        id: 3,
        title: "Farm Fresh, Naturally Pure",
        description: "Direct from organic farms to your doorstep.",
        cta: "Discover More",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&h=600&fit=crop", // Fresh produce
        badge: "Fresh"
      }
    ];
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/banners/active?position=hero&limit=5`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          const formattedSlides = data.data.map((banner, index) => ({
            id: banner._id || index,
            title: banner.title || "Greener, Healthier, Natural",
            description: banner.description || banner.subtitle || "",
            cta: banner.buttonText || "Explore Now",
            link: banner.buttonLink || "/shop",
            image: banner.image && banner.image.startsWith('http') 
              ? banner.image 
              : `${API_URL}${banner.image || ''}`,
            badge: banner.badge || "Organic"
          }));
          setSlides(formattedSlides);
        } else {
          setSlides(getDefaultSlides());
        }
      } catch (err) {
        console.error("❌ Error fetching banners:", err);
        setSlides(getDefaultSlides());
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [API_URL]);

  useEffect(() => {
    let interval;
    if (isAutoPlay && slides.length > 0 && !loading) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length, loading]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="image-slider-container">
        <div className="slider-loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-slider-container">
      <div className="slider-viewport">
        <div 
          className="slides-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="slide-item">
              {/* Background Image */}
              <div className="slide-background">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1200&h=600&fit=crop';
                  }}
                />
                <div className="slide-overlay"></div>
              </div>
              
              {/* Content */}
              <div className="slide-content">
                {slide.badge && (
                  <span className="slide-badge">{slide.badge}</span>
                )}
                <h1 className="slide-title">{slide.title}</h1>
                {slide.description && (
                  <p className="slide-description">{slide.description}</p>
                )}
                <button 
                  className="slide-cta-btn"
                  onClick={() => { if (slide.link) window.location.href = slide.link; }}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button className="slider-arrow arrow-left" onClick={prevSlide} aria-label="Previous">
            ‹
          </button>
          <button className="slider-arrow arrow-right" onClick={nextSlide} aria-label="Next">
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;