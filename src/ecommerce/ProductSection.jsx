// src/ecommerce/ProductSection.jsx
import React, { useState, useEffect } from "react";
import "./ProductSection.css";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fallback products (only used if API fails)
  const fallbackProducts = [
    {
      _id: "1",
      name: "Premium Whey Protein",
      price: 2499,
      discount: 10,
      description: "Premium whey protein for muscle growth and recovery. Contains 24g of protein per serving.",
      category: "Sports Nutrition",
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.5,
      reviews: 120,
      badge: "Bestseller"
    },
    {
      _id: "2",
      name: "Complete Health Drink",
      price: 1299,
      discount: 5,
      description: "Complete balanced nutrition for children. Supports growth and development.",
      category: "Health Drinks",
      image: "https://images.unsplash.com/photo-1570813875851-28e5b16f0fb0?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.3,
      reviews: 85,
      badge: "Top Rated"
    },
    {
      _id: "3",
      name: "Premium Italian Pasta",
      price: 899,
      discount: 0,
      description: "Premium Italian pasta made from durum wheat semolina. Perfect for authentic Italian dishes.",
      category: "Gluten Free Pasta",
      image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.6,
      reviews: 200,
      badge: "Gluten Free"
    },
    {
      _id: "4",
      name: "Organic Flax Seeds",
      price: 599,
      discount: 15,
      description: "Premium quality flax seeds rich in Omega-3 fatty acids and fiber. Great for heart health.",
      category: "Organic Seeds",
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.7,
      reviews: 150,
      badge: "100% Natural"
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔍 Fetching products from backend...");
        console.log(`📡 API Endpoint: ${API_URL}/api/products?limit=4&inStock=true&sortBy=createdAt&sortOrder=desc`);
        
        const response = await fetch(
          `${API_URL}/api/products?limit=4&inStock=true&sortBy=createdAt&sortOrder=desc`
        );
        
        console.log("📊 Response Status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ API Error Response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📦 API Response Data:", data);
        
        if (data.success && data.data && data.data.length > 0) {
          // Filter products - only check for valid images
          const validProducts = data.data.filter(product => {
            const hasImage = product.image && product.image.length > 0;
            const hasName = product.name && product.name.length > 0;
            return hasImage && hasName;
          });
          
          console.log(`✅ Found ${validProducts.length} valid products from API`);
          
          if (validProducts.length > 0) {
            setProducts(validProducts);
          } else {
            console.warn("⚠️ No valid products from API, using fallback products");
            setProducts(fallbackProducts);
          }
        } else {
          console.warn("⚠️ API returned no products, using fallback products");
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError(err.message);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
    // For cloudinary or other CDN URLs
    if (imagePath.includes('cloudinary') || imagePath.includes('res.cloudinary')) {
      return imagePath;
    }
    return `${API_URL}/uploads/images/${imagePath}`;
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price - (price * (discount / 100));
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeProductModal();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeProductModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          discount: product.discount || 0
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
      closeProductModal();
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding to cart. Please try again.");
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <section className="product-section">
        <div className="product-container">
          <div className="product-header">
            <h2 className="product-title">Health Food Products</h2>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="product-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="product-image-wrapper skeleton-image"></div>
                <div className="product-name-wrapper">
                  <div className="skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <section className="product-section">
        <div className="product-container">
          <div className="product-header">
            <h2 className="product-title">Health Food Products</h2>
          </div>
          <div className="error-container">
            <p className="error-message">⚠️ Failed to load products: {error}</p>
            <p>Showing fallback products instead.</p>
          </div>
          <div className="product-grid">
            {fallbackProducts.map((product) => (
              <div 
                key={product._id} 
                className="product-card"
                onClick={() => openProductModal(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="product-discount">{product.discount}% OFF</span>
                  )}
                </div>
                <div className="product-name-wrapper">
                  <h3 className="product-name">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Main render with products
  return (
    <>
      <section className="product-section">
        <div className="product-container">
          <div className="product-header">
            <h2 className="product-title">Health Food Products</h2>
            {products.length > 0 && (
              <span className="product-count">{products.length} products</span>
            )}
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="product-card"
                onClick={() => openProductModal(product)}
                style={{ cursor: 'pointer' }}
              >
                {/* Image Container */}
                <div className="product-image-wrapper">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      console.warn("🖼️ Image failed to load:", product.image);
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="product-discount">{product.discount}% OFF</span>
                  )}
                </div>
                
                {/* Name Container */}
                <div className="product-name-wrapper">
                  <h3 className="product-name">
                    {capitalizeFirstLetter(product.name)}
                  </h3>
                  <p className="product-price">
                    {formatPrice(getDiscountedPrice(product.price, product.discount))}
                    {product.discount > 0 && (
                      <span className="original-price">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={handleBackdropClick}>
          <div className="product-modal">
            <button className="modal-close-btn" onClick={closeProductModal}>✕</button>
            
            <div className="modal-content-wrapper">
              {/* Left: Image */}
              <div className="modal-image-section">
                <img 
                  src={getImageUrl(selectedProduct.image)} 
                  alt={selectedProduct.name} 
                  className="modal-product-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                {selectedProduct.badge && (
                  <span className="modal-badge">{selectedProduct.badge}</span>
                )}
              </div>

              {/* Right: Details */}
              <div className="modal-details-section">
                <div className="modal-product-category">
                  {selectedProduct.category || 'Product'}
                </div>
                <h2 className="modal-product-title">
                  {capitalizeFirstLetter(selectedProduct.name)}
                </h2>
          
                <div className="modal-price-section">
                  <span className="modal-current-price">
                    {formatPrice(getDiscountedPrice(selectedProduct.price, selectedProduct.discount))}
                  </span>
                  {selectedProduct.discount > 0 && (
                    <>
                      <span className="modal-original-price">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <span className="modal-discount-percent">
                        {selectedProduct.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="modal-description">
                  <h4>Description</h4>
                  <p>{selectedProduct.description || 'No description available.'}</p>
                </div>

                <button 
                  className="modal-add-to-cart-btn"
                  onClick={() => addToCart(selectedProduct)}
                  disabled={!selectedProduct.inStock}
                >
                  {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSection;