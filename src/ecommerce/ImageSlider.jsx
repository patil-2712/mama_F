// ImageSlider.jsx
import React, { useState, useEffect } from "react";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Default slides as fallback
  const getDefaultSlides = () => {
    return [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1920&h=600&fit=crop&q=80",
        fallback: "https://via.placeholder.com/1920x600/1a3a2a/87CEEB?text=Organic+Baby+Food",
        title: "Organic Baby Food",
        description: "Pure & Natural Ingredients for Your Baby's Health",
        cta: "Explore Now",
        link: "/shop"
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1920&h=600&fit=crop&q=80",
        fallback: "https://via.placeholder.com/1920x600/1a3a2a/87CEEB?text=Healthy+Nutrition",
        title: "Healthy Nutrition",
        description: "Balanced Meals for Growing Children",
        cta: "Shop Now",
        link: "/shop"
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1920&h=600&fit=crop&q=80",
        fallback: "https://via.placeholder.com/1920x600/1a3a2a/87CEEB?text=Natural+Products",
        title: "Natural Products",
        description: "100% Organic & Chemical-Free",
        cta: "Discover More",
        link: "/shop"
      }
    ];
  };

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("🔍 Fetching banners from:", `${API_URL}/banners/active?position=hero&limit=5`);
        
        const response = await fetch(`${API_URL}/banners/active?position=hero&limit=5`, {
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
        console.log("📦 Banner data:", data);

        if (data.success && data.data && data.data.length > 0) {
          // Transform banner data to match slider format
          const formattedSlides = data.data.map((banner, index) => ({
            id: banner._id || index,
            url: banner.image && banner.image.startsWith('http') 
              ? banner.image 
              : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${banner.image || ''}`,
            fallback: "https://via.placeholder.com/1920x600/1a3a2a/87CEEB?text=Organic+Products",
            title: banner.title || "Organic Products",
            description: banner.description || banner.subtitle || "",
            cta: banner.buttonText || "Shop Now",
            link: banner.buttonLink || "/shop",
            position: banner.position || "hero"
          }));
          
          console.log("✅ Formatted slides:", formattedSlides);
          setSlides(formattedSlides);
        } else {
          console.log("📋 No banners from API, using default slides");
          setSlides(getDefaultSlides());
        }
      } catch (err) {
        console.error("❌ Error fetching banners:", err);
        setError("Failed to load banners. Showing default slides.");
        setSlides(getDefaultSlides());
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlay && slides.length > 0 && !loading) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length, loading]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Handle CTA button click
  const handleCTAClick = (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="slider-container-full">
        <div className="slider-loading">
          <div className="loading-spinner"></div>
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  // Show error state but still render slides (fallback)
  if (error && slides.length === 0) {
    return (
      <div className="slider-container-full">
        <div className="slider-error">
          <p>Unable to load banners. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-container-full">
      <div className="slider-wrapper-full">
        <div 
          className="slides-wrapper-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="slide-full">
              <img 
                src={slide.url} 
                alt={slide.title} 
                className="slide-image-full"
                onError={(e) => {
                  console.log(`🖼️ Image failed to load, using fallback for ${slide.title}`);
                  e.target.src = slide.fallback;
                }}
              />
              <div className="slide-overlay-full">
                <div className="slide-content-full">
                  <h2 className="slide-title-full">{slide.title}</h2>
                  {slide.description && (
                    <p className="slide-description-full">{slide.description}</p>
                  )}
                  <button 
                    className="slide-btn-full"
                    onClick={() => handleCTAClick(slide.link)}
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons - only show if more than 1 slide */}
        {slides.length > 1 && (
          <>
            <button className="slider-btn-full prev-btn-full" onClick={prevSlide}>
              ❮
            </button>
            <button className="slider-btn-full next-btn-full" onClick={nextSlide}>
              ❯
            </button>
          </>
        )}

        {/* Dots - only show if more than 1 slide */}
        {slides.length > 1 && (
          <div className="dots-container-full">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot-full ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play toggle - only show if more than 1 slide */}
        {slides.length > 1 && (
          <button 
            className="autoplay-btn-full" 
            onClick={toggleAutoPlay}
            aria-label={isAutoPlay ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isAutoPlay ? '⏸' : '▶'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;