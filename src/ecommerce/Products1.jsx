// Products1.jsx
import React, { useState, useEffect } from "react";
import "./Products1.css";

const Products1 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const productsPerPage = 12;

  // Base URL for API
  const API_URL = "http://localhost:5000";

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
          console.log(`✅ Loaded ${data.count} categories with products`);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([
          "Sports Nutrition",
          "Health Drinks",
          "Organic Tea",
          "Organic Spices",
          "Superfoods",
          "Baby Food",
          "Dry Fruits",
          "Organic Millet",
          "Organic Seeds",
          "Healthy Snacks",
          "Organic Pulses",
          "Natural Sweeteners",
          "Cooking Oils",
          "Dairy",
          "Gluten Free Pasta"
        ]);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: currentPage,
          limit: productsPerPage,
          sortBy: sortBy,
          sortOrder: sortOrder
        });
        
        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        const response = await fetch(`${API_URL}/api/products?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
          setTotalPages(data.pagination.totalPages);
          setTotalProducts(data.pagination.total);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Error loading products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, sortOrder, searchTerm, API_URL]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch(value) {
      case "price_low":
        setSortBy("price");
        setSortOrder("asc");
        break;
      case "price_high":
        setSortBy("price");
        setSortOrder("desc");
        break;
      case "popular":
        setSortBy("rating");
        setSortOrder("desc");
        break;
      default:
        setSortBy("createdAt");
        setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount === 0) return price;
    return price - (price * (discount / 100));
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

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-page-container">
          <div className="products-page-header">
            <h1 className="products-page-title">All Products</h1>
            <p className="products-page-subtitle">Loading products...</p>
          </div>
          <div className="products-page-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="product-page-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-info">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text price"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="products-page-container">
          <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="products-page">
        <div className="products-page-container">
          <div className="products-page-header">
            <h1 className="products-page-title">All Products</h1>
            <p className="products-page-subtitle">
              Discover our wide range of organic and natural products
              {totalProducts > 0 && ` (${totalProducts} products)`}
            </p>
          </div>

          <div className="filter-bar">
            <div className="filter-left">
              <span className="filter-label">Category:</span>
              <select 
                className="filter-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            
            <div className="filter-right">
              <span className="filter-label">Sort By:</span>
              <select 
                className="filter-select"
                onChange={handleSortChange}
                defaultValue="featured"
              >
                <option value="featured">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="products-page-grid">
                {products.map((product) => (
                  <div 
                    key={product._id} 
                    className="product-page-card"
                    onClick={() => openProductModal(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="product-page-image-wrapper">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="product-page-image"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23cccccc'/%3E%3Ctext x='50' y='150' font-family='Arial' font-size='20' fill='%23666666'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {product.badge && (
                        <span className="product-page-badge">{product.badge}</span>
                      )}
                      {product.discount > 0 && (
                        <span className="product-page-discount">
                          {product.discount}% OFF
                        </span>
                      )}
                      <button 
                        className="product-page-quick-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProductModal(product);
                        }}
                      >
                        Quick View
                      </button>
                    </div>
                    <div className="product-page-info">
                      <span className="product-page-category">{product.category}</span>
                      <h3 className="product-page-name">{product.name}</h3>
                      <div className="product-page-price-wrapper">
                        <p className="product-page-price">
                          {formatPrice(product.price)}
                          {product.discount > 0 && (
                            <span className="original-price">
                              {formatPrice(product.price / (1 - product.discount / 100))}
                            </span>
                          )}
                        </p>
                      </div>
                      {product.rating > 0 && (
                        <div className="product-rating">
                          {"⭐".repeat(Math.round(product.rating))}
                          <span className="rating-count">({product.reviews})</span>
                        </div>
                      )}
                      <button 
                        className="product-page-add-btn"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ❮ Previous
                  </button>
                  <div className="pagination-numbers">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={index}
                            className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => paginate(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={index} className="pagination-ellipsis">…</span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <button 
                    className="pagination-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next ❯
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
                <h2 className="modal-product-title">{selectedProduct.name}</h2>
                
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

export default Products1;