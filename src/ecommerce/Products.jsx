// Products.jsx
import React, { useRef, useState, useEffect } from "react";
import "./Products.css";

const Products = () => {
  const sliderRef = useRef(null);
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
        
        const response = await fetch(`${API_URL}/api/products?limit=8&sortBy=createdAt&sortOrder=desc`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
          console.log(`✅ Loaded ${data.data.length} products for slider`);
        } else {
          setError("Failed to fetch products");
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
        name: "Hipp Organic Rice with Dhal Porridge",
        weight: "100 Grams",
        price: 380,
        discount: 10,
        description: "Organic rice porridge with dhal, perfect for babies and toddlers. Rich in iron and essential nutrients.",
        category: "Baby Food",
        image: "https://images.unsplash.com/photo-1584568694244-14fbdf3bd0c6?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.5,
        reviews: 89,
        badge: "Baby Care",
        quantity: 50
      },
      {
        _id: 2,
        name: "Organic India Quinoa Nutrition Food",
        weight: "500 Grams",
        price: 350,
        discount: 5,
        description: "Premium organic quinoa rich in protein and fiber. Gluten-free and highly nutritious.",
        category: "Superfoods",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.3,
        reviews: 67,
        badge: "Superfood",
        quantity: 100
      },
      {
        _id: 3,
        name: "Arya Orgo Energy Health Drink",
        weight: "300 Grams",
        price: 500,
        discount: 0,
        description: "Natural energy health drink with organic ingredients. Boosts stamina and immunity.",
        category: "Health Drinks",
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.0,
        reviews: 45,
        badge: "Energy",
        quantity: 75
      },
      {
        _id: 4,
        name: "24 Mantra Organic Flax Seeds",
        weight: "200 Grams",
        price: 350,
        discount: 15,
        description: "Organic flax seeds rich in Omega-3 fatty acids and fiber. Great for heart health.",
        category: "Organic Seeds",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.7,
        reviews: 156,
        badge: "Organic",
        quantity: 200
      },
      {
        _id: 5,
        name: "Daadi's Diet Plain Khakhra",
        weight: "180 Grams",
        price: 250,
        discount: 0,
        description: "Traditional crispy khakhra made from whole wheat. Healthy and delicious snack option.",
        category: "Healthy Snacks",
        image: "https://images.unsplash.com/photo-1584568694244-14fbdf3bd0c6?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.2,
        reviews: 78,
        badge: "Healthy",
        quantity: 60
      },
      {
        _id: 6,
        name: "Organic Tattva Moong Green Split",
        weight: "10 gm",
        price: 200,
        discount: 0,
        description: "Organic green moong dal split, rich in protein and fiber. Perfect for healthy meals.",
        category: "Organic Pulses",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.4,
        reviews: 92,
        badge: "Pure",
        quantity: 150
      },
      {
        _id: 7,
        name: "Organic India Quinoa Nutrition Food",
        weight: "500 Grams",
        price: 350,
        discount: 5,
        description: "Premium organic quinoa rich in protein and fiber. Gluten-free and highly nutritious.",
        category: "Superfoods",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.3,
        reviews: 67,
        badge: "Superfood",
        quantity: 80
      },
      {
        _id: 8,
        name: "Arya Orgo Energy Health Drink",
        weight: "300 Grams",
        price: 500,
        discount: 0,
        description: "Natural energy health drink with organic ingredients. Boosts stamina and immunity.",
        category: "Health Drinks",
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.0,
        reviews: 45,
        badge: "Energy",
        quantity: 65
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

  // Format price to Indian Rupees
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price - (price * (discount / 100));
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
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
      <section className="products-section-full">
        <div className="products-container-full">
          <div className="products-header-full">
            <h2 className="products-title-full">Products</h2>
          </div>
          <div className="slider-wrapper-full-new">
            <div className="products-grid-full">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="product-item-full skeleton">
                  <div className="product-image-full skeleton-image"></div>
                  <div className="product-details-full">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-text price"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="products-section-full">
        <div className="products-container-full">
          <div className="products-header-full">
            <h2 className="products-title-full">Products</h2>
          </div>

          <div className="slider-wrapper-full-new">
            <button className="slider-arrow-full left-arrow-full" onClick={scrollLeft}>
              ❮
            </button>

            <div className="products-grid-full" ref={sliderRef}>
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="product-item-full"
                  onClick={() => openProductModal(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-full">
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name}
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
                  <div className="product-details-full">
                    <h3 className="product-name-full">{capitalizeFirstLetter(product.name)}</h3>
                    {product.quantity && (
                      <p className="product-weight-full">{product.quantity} Units</p>
                    )}
                    {!product.quantity && product.weight && (
                      <p className="product-weight-full">{product.weight}</p>
                    )}
                    <p className="product-price-full">{formatPrice(product.price)}</p>
                  </div>
                  <button 
                    className="product-add-btn-full"
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    {product.inStock ? "Add" : "Out of Stock"}
                  </button>
                </div>
              ))}
            </div>

            <button className="slider-arrow-full right-arrow-full" onClick={scrollRight}>
              ❯
            </button>
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

export default Products;