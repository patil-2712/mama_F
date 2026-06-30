// // Testimonials.jsx
// import React, { useRef } from "react";
// import "./Testimonials.css";

// const Testimonials = () => {
//   const sliderRef = useRef(null);

//   const testimonials = [
//     {
//       id: 1,
//       name: "Rupesh Joshi",
//       text: "I always buy organic food products from them. Their prices are quite lesser than the market price and the quality is super best.",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
//     },
//     {
//       id: 2,
//       name: "Krishna Mukherjee",
//       text: "Since I've started eating homemade food products, my health has become a little better. I'll always stick to them for homemade food products.",
//       image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
//     },
//     {
//       id: 3,
//       name: "Priya Sharma",
//       text: "The organic products are truly amazing. I've noticed a significant improvement in my family's health since we started using their products.",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
//     },
//     {
//       id: 4,
//       name: "Amit Patel",
//       text: "Best quality organic food I've ever found. Their delivery is always on time and the packaging is excellent.",
//       image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
//     },
//     {
//       id: 5,
//       name: "Sneha Reddy",
//       text: "I've been a loyal customer for years. Their organic products are simply the best in the market. Highly recommended!",
//       image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face"
//     },
//     {
//       id: 6,
//       name: "Vikram Singh",
//       text: "The quality of their organic food is unmatched. My whole family loves their products. Thank you for the amazing service!",
//       image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
//     }
//   ];

//   const scrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
//     }
//   };

//   return (
//     <section className="testimonials-section-full">
//       <div className="testimonials-container-full">
//         <div className="testimonials-header-full">
//           <h2 className="testimonials-title-full">What Our Customers Say</h2>
//         </div>

//         <div className="testimonials-slider-wrapper-full">
//           <button className="testimonial-arrow-full left-arrow-full" onClick={scrollLeft}>
//             ❮
//           </button>

//           <div className="testimonials-slider-full" ref={sliderRef}>
//             {testimonials.map((testimonial) => (
//               <div key={testimonial.id} className="testimonial-card-full">
//                 <div className="testimonial-image-wrapper-full">
//                   <img 
//                     src={testimonial.image} 
//                     alt={testimonial.name} 
//                     className="testimonial-image-full"
//                   />
//                 </div>
//                 <div className="testimonial-content-full">
//                   <p className="testimonial-text-full">{testimonial.text}</p>
//                   <div className="testimonial-divider-full"></div>
//                   <h3 className="testimonial-name-full">{testimonial.name}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button className="testimonial-arrow-full right-arrow-full" onClick={scrollRight}>
//             ❯
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;
// src/components/Testimonials.jsx
import React, { useRef, useState, useEffect } from "react";
import "./Testimonials.css";

const Testimonials = () => {
  const sliderRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("🔍 Fetching testimonials from:", `${API_URL}/testimonials`);
        
        const response = await fetch(`${API_URL}/testimonials?limit=10`, {
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
        console.log("📦 Testimonials data:", data);

        if (data.success && data.data && data.data.length > 0) {
          // Format testimonials from API
          const formattedTestimonials = data.data.map((item) => ({
            id: item._id,
            name: item.name,
            text: item.text,
            image: item.image.startsWith('http') 
              ? item.image 
              : `${BASE_URL}${item.image}`,
            position: item.position || '',
            rating: item.rating || 5
          }));
          setTestimonials(formattedTestimonials);
        } else {
          // Use fallback data if no testimonials from API
          console.log("📋 No testimonials from API, using fallback data");
          setTestimonials(getFallbackTestimonials());
        }
      } catch (err) {
        console.error("❌ Error fetching testimonials:", err);
        setError("Failed to load testimonials. Showing default.");
        setTestimonials(getFallbackTestimonials());
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Fallback testimonials data
  const getFallbackTestimonials = () => {
    return [
      {
        id: 1,
        name: "Rupesh Joshi",
        text: "I always buy organic food products from them. Their prices are quite lesser than the market price and the quality is super best.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        position: "",
        rating: 5
      },
      {
        id: 2,
        name: "Krishna Mukherjee",
        text: "Since I've started eating homemade food products, my health has become a little better. I'll always stick to them for homemade food products.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        position: "",
        rating: 5
      },
      {
        id: 3,
        name: "Priya Sharma",
        text: "The organic products are truly amazing. I've noticed a significant improvement in my family's health since we started using their products.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        position: "",
        rating: 5
      },
      {
        id: 4,
        name: "Amit Patel",
        text: "Best quality organic food I've ever found. Their delivery is always on time and the packaging is excellent.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        position: "",
        rating: 5
      },
      {
        id: 5,
        name: "Sneha Reddy",
        text: "I've been a loyal customer for years. Their organic products are simply the best in the market. Highly recommended!",
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
        position: "",
        rating: 5
      },
      {
        id: 6,
        name: "Vikram Singh",
        text: "The quality of their organic food is unmatched. My whole family loves their products. Thank you for the amazing service!",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
        position: "",
        rating: 5
      }
    ];
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="testimonials-section-full">
        <div className="testimonials-container-full">
          <div className="testimonials-header-full">
            <h2 className="testimonials-title-full">What Our Customers Say</h2>
          </div>
          <div className="testimonials-loading">
            <div className="loading-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section-full">
      <div className="testimonials-container-full">
        <div className="testimonials-header-full">
          <h2 className="testimonials-title-full">What Our Customers Say</h2>
        </div>

        <div className="testimonials-slider-wrapper-full">
          <button className="testimonial-arrow-full left-arrow-full" onClick={scrollLeft}>
            ❮
          </button>

          <div className="testimonials-slider-full" ref={sliderRef}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card-full">
                <div className="testimonial-image-wrapper-full">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="testimonial-image-full"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100/cccccc/666666?text=User';
                    }}
                  />
                </div>
                <div className="testimonial-content-full">
                  {/* Rating Stars */}
                  {testimonial.rating && (
                    <div className="testimonial-rating-full">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                  <p className="testimonial-text-full">{testimonial.text}</p>
                  <div className="testimonial-divider-full"></div>
                  <h3 className="testimonial-name-full">{testimonial.name}</h3>
                  {testimonial.position && (
                    <p className="testimonial-position-full">{testimonial.position}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="testimonial-arrow-full right-arrow-full" onClick={scrollRight}>
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;