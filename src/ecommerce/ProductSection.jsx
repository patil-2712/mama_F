// ProductSection.jsx
import React, { useState, useEffect } from "react";
import "./ProductSection.css";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/api/products?limit=4&inStock=true&sortBy=createdAt&sortOrder=desc`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setProducts(data.data);
          console.log(`✅ Loaded ${data.data.length} products for Health Food section`);
        } else {
          setProducts(getFallbackProducts());
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error loading products");
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // Fallback products in case API fails
  const getFallbackProducts = () => {
    return [
      {
        _id: 1,
        name: "WHEY Protein",
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
        _id: 2,
        name: "PediaSure",
        price: 1299,
        discount: 5,
        description: "Complete balanced nutrition for children. Supports growth and development.",
        category: "Health Drinks",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.3,
        reviews: 85,
        badge: "Top Rated"
      },
      {
        _id: 3,
        name: "Barilla Pasta",
        price: 899,
        discount: 0,
        description: "Premium Italian pasta made from durum wheat semolina. Perfect for authentic Italian dishes.",
        category: "Gluten Free Pasta",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.6,
        reviews: 200,
        badge: "Gluten Free"
      },
      {
        _id: 4,
        name: "MOOLHAI Flax Seeds",
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
  };

  // Function to capitalize first letter of each word
  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
    return `${API_URL}/uploads/images/${imagePath}`;
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price - (price * (discount / 100));
  };

  // Open product detail modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close product detail modal
  const closeProductModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeProductModal();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeProductModal();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Add to cart function
  const addToCart = (product) => {
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
  };

  // Loading state
  if (loading) {
    return (
      <section className="products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Health Food Products</h2>
          </div>
          <div className="products-grid">
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

  // Error state - show fallback products
  if (error) {
    return (
      <section className="products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Health Food Products</h2>
          </div>
          <div className="products-grid">
            {getFallbackProducts().map((product) => (
              <div key={product._id} className="product-card" onClick={() => openProductModal(product)}>
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
                </div>
                <div className="product-name-wrapper">
                  <h3 className="product-name">{capitalizeFirstLetter(product.name)}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Health Food Products</h2>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="product-card"
                onClick={() => openProductModal(product)}
                style={{ cursor: 'pointer' }}
              >
                {/* Container 1: Only Image - Full size, no background */}
                <div className="product-image-wrapper">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  {product.discount > 0 && (
                    <span className="product-discount-badge">{product.discount}% OFF</span>
                  )}
                </div>
                
                {/* Container 2: Only Name - No background */}
                <div className="product-name-wrapper">
                  <h3 className="product-name">{capitalizeFirstLetter(product.name)}</h3>
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
                <div className="modal-product-category">{selectedProduct.category || 'Product'}</div>
                <h2 className="modal-product-title">{capitalizeFirstLetter(selectedProduct.name)}</h2>
                
                <div className="modal-rating">
                  {'⭐'.repeat(Math.round(selectedProduct.rating || 0))}
                  <span className="modal-rating-count">({selectedProduct.reviews || 0} reviews)</span>
                </div>

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

                <div className="modal-stock-status">
                  <span className={`stock-indicator ${selectedProduct.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {selectedProduct.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                  </span>
                </div>

                <div className="modal-description">
                  <h4>Description</h4>
                  <p>{selectedProduct.description || 'No description available.'}</p>
                </div>

                {selectedProduct.quantity && (
                  <div className="modal-quantity-info">
                    <span>Quantity Available: {selectedProduct.quantity}</span>
                  </div>
                )}

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