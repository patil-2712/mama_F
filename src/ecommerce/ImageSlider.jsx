//// src/ecommerce/ImageSlider.jsx
//import React, { useState, useEffect } from "react";
//import "./ImageSlider.css";
//
//const ImageSlider = () => {
//  const [slides, setSlides] = useState([]);
//  const [currentIndex, setCurrentIndex] = useState(0);
//  const [isAutoPlay, setIsAutoPlay] = useState(true);
//  const [loading, setLoading] = useState(true);
//
//  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in";
//
//  const getDefaultSlides = () => {
//    return [
//      {
//        id: 1,
//        title: "Greener, Healthier, Natural",
//        description: "Pure plant-based proteins and clean organic foods.",
//        cta: "Explore Now",
//        link: "/shop",
//        image: "https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1200&h=600&fit=crop", // Healthy food image
//        badge: "Organic"
//      },
//      {
//        id: 2,
//        title: "Pure Organic Superfoods",
//        description: "100% Certified Clean Ingredients for Your Daily Nutrition.",
//        cta: "Shop Now",
//        link: "/shop",
//        image: "https://images.unsplash.com/photo-1570813875851-28e5b16f0fb0?w=1200&h=600&fit=crop", // Food ingredients
//        badge: "Premium"
//      },
//      {
//        id: 3,
//        title: "Farm Fresh, Naturally Pure",
//        description: "Direct from organic farms to your doorstep.",
//        cta: "Discover More",
//        link: "/shop",
//        image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&h=600&fit=crop", // Fresh produce
//        badge: "Fresh"
//      }
//    ];
//  };
//
//  useEffect(() => {
//    const fetchBanners = async () => {
//      try {
//        setLoading(true);
//        const response = await fetch(`${API_URL}/api/banners/active?position=hero&limit=5`);
//        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//        
//        const data = await response.json();
//        if (data.success && data.data && data.data.length > 0) {
//          const formattedSlides = data.data.map((banner, index) => ({
//            id: banner._id || index,
//            title: banner.title || "Greener, Healthier, Natural",
//            description: banner.description || banner.subtitle || "",
//            cta: banner.buttonText || "Explore Now",
//            link: banner.buttonLink || "/shop",
//            image: banner.image && banner.image.startsWith('http') 
//              ? banner.image 
//              : `${API_URL}${banner.image || ''}`,
//            badge: banner.badge || "Organic"
//          }));
//          setSlides(formattedSlides);
//        } else {
//          setSlides(getDefaultSlides());
//        }
//      } catch (err) {
//        console.error("❌ Error fetching banners:", err);
//        setSlides(getDefaultSlides());
//      } finally {
//        setLoading(false);
//      }
//    };
//    fetchBanners();
//  }, [API_URL]);
//
//  useEffect(() => {
//    let interval;
//    if (isAutoPlay && slides.length > 0 && !loading) {
//      interval = setInterval(() => {
//        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//      }, 6000);
//    }
//    return () => clearInterval(interval);
//  }, [isAutoPlay, slides.length, loading]);
//
//  const nextSlide = () => {
//    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//  };
//
//  const prevSlide = () => {
//    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//  };
//
//  if (loading) {
//    return (
//      <div className="image-slider-container">
//        <div className="slider-loading-state">
//          <div className="spinner"></div>
//          <p>Loading...</p>
//        </div>
//      </div>
//    );
//  }
//
//  return (
//    <div className="image-slider-container">
//      <div className="slider-viewport">
//        <div 
//          className="slides-track"
//          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//        >
//          {slides.map((slide) => (
//            <div key={slide.id} className="slide-item">
//              {/* Background Image */}
//              <div className="slide-background">
//                <img 
//                  src={slide.image} 
//                  alt={slide.title}
//                  onError={(e) => {
//                    e.target.src = 'https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1200&h=600&fit=crop';
//                  }}
//                />
//                <div className="slide-overlay"></div>
//              </div>
//              
//              {/* Content */}
//              <div className="slide-content">
//                {slide.badge && (
//                  <span className="slide-badge">{slide.badge}</span>
//                )}
//                <h1 className="slide-title">{slide.title}</h1>
//                {slide.description && (
//                  <p className="slide-description">{slide.description}</p>
//                )}
//                <button 
//                  className="slide-cta-btn"
//                  onClick={() => { if (slide.link) window.location.href = slide.link; }}
//                >
//                  {slide.cta}
//                </button>
//              </div>
//            </div>
//          ))}
//        </div>
//      </div>
//
//      {/* Navigation Arrows */}
//      {slides.length > 1 && (
//        <>
//          <button className="slider-arrow arrow-left" onClick={prevSlide} aria-label="Previous">
//            ‹
//          </button>
//          <button className="slider-arrow arrow-right" onClick={nextSlide} aria-label="Next">
//            ›
//          </button>
//        </>
//      )}
//
//      {/* Dots */}
//      {slides.length > 1 && (
//        <div className="slider-dots">
//          {slides.map((_, index) => (
//            <button
//              key={index}
//              className={`dot ${index === currentIndex ? 'active' : ''}`}
//              onClick={() => setCurrentIndex(index)}
//              aria-label={`Go to slide ${index + 1}`}
//            />
//          ))}
//        </div>
//      )}
//    </div>
//  );
//};
//
//export default ImageSlider;

// src/ecommerce/ImageSlider.jsx
import React, { useState, useEffect } from "react";
import "./ImageSlider.css";

const ImageSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in";

  const getDefaultSlides = () => {
    return [
      {
        id: 1,
        title: "Mai's Special Food",
        description: "100% Natural | No Sugar | No Preservative | No Salt",
        cta: "Shop Now",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1920&h=800&fit=crop&q=80",
        badge: "100% Natural",
        subtitle: "Nurturing Healthy Futures",
        features: "Wholesome, homemade goodness for your little ones."
      },
      {
        id: 2,
        title: "Pure Organic Superfoods",
        description: "Traditional Recipes with Modern Hygiene",
        cta: "Explore Now",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1570813875851-28e5b16f0fb0?w=1920&h=800&fit=crop&q=80",
        badge: "Organic",
        subtitle: "Made with Natural Ingredients",
        features: "Perfect for Babies & Kids"
      },
      {
        id: 3,
        title: "Farm Fresh, Naturally Pure",
        description: "100% Natural Food | No Sugar | No Preservative | No Salt",
        cta: "Discover More",
        link: "/shop",
        image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1920&h=800&fit=crop&q=80",
        badge: "Fresh",
        subtitle: "Made with Love, Every Time",
        features: "Traditional Recipes with Modern Hygiene"
      }
    ];
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/banners/active?position=hero&limit=5`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          const formattedSlides = data.data.map((banner, index) => {
            let imageUrl = banner.image;
            
            if (imageUrl) {
              if (!imageUrl.startsWith('http')) {
                imageUrl = `${API_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
              }
            } else {
              imageUrl = 'https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1920&h=800&fit=crop&q=80';
            }
            
            return {
              id: banner._id || index,
              title: banner.title || "Mai's Special Food",
              description: banner.description || banner.subtitle || "100% Natural Goodness",
              cta: banner.buttonText || "Shop Now",
              link: banner.buttonLink || "/shop",
              image: imageUrl,
              badge: banner.badge || "Natural",
              subtitle: banner.subtitle || "Nurturing Healthy Futures",
              features: banner.features || "Wholesome, homemade goodness"
            };
          });
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
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1542838132-5f6e9fe5f1e7?w=1920&h=800&fit=crop&q=80';
    e.target.classList.add('image-error');
  };

  if (loading) {
    return (
      <div className="image-slider-container">
        <div className="slider-loading-state">
          <div className="spinner"></div>
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="image-slider-container">
        <div className="slider-loading-state">
          <p>No banners available</p>
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
              <div className="slide-background">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="slide-overlay"></div>
              </div>
              
              <div className="slide-content">
                {slide.badge && (
                  <span className="slide-badge">{slide.badge}</span>
                )}
                <h1 className="slide-title">{slide.title}</h1>
                
                {/* Subtitle - Matching your banner */}
                {slide.subtitle && (
                  <h2 className="slide-subtitle">{slide.subtitle}</h2>
                )}
                
                {/* Description - Matching your banner */}
                {slide.description && (
                  <p className="slide-description">{slide.description}</p>
                )}
                
                {/* Features - Matching your banner */}
                {slide.features && (
                  <p className="slide-features">{slide.features}</p>
                )}
                
                <button 
                  className="slide-cta-btn"
                  onClick={() => { 
                    if (slide.link) {
                      window.location.href = slide.link; 
                    }
                  }}
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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