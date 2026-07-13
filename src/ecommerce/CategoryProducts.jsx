// // src/ecommerce/CategoryProducts.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import "./CategoryProducts.css";

// const CategoryProducts = () => {
//   const { category } = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const productsPerPage = 12;
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // Decode category name from URL
//   const decodedCategory = decodeURIComponent(category);

//   // Fetch categories for sidebar
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${API_URL}/api/categories`);
//         const data = await response.json();
//         if (data.success) {
//           setCategories(data.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, [API_URL]);

//   // Fetch products by category
//   useEffect(() => {
//     const fetchProductsByCategory = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const params = new URLSearchParams({
//           page: currentPage,
//           limit: productsPerPage,
//           category: decodedCategory,
//           sortBy: sortBy,
//           sortOrder: sortOrder
//         });

//         const response = await fetch(`${API_URL}/api/products?${params}`);
//         const data = await response.json();

//         if (data.success) {
//           setProducts(data.data);
//           setTotalPages(data.pagination.totalPages);
//           setTotalProducts(data.pagination.total);
//         } else {
//           setError("Failed to fetch products");
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError("Error loading products");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (decodedCategory) {
//       fetchProductsByCategory();
//     }
//   }, [decodedCategory, currentPage, sortBy, sortOrder, API_URL]);

//   const formatPrice = (price) => {
//     return `₹${price.toLocaleString('en-IN')}`;
//   };

//   // Calculate discounted price
//   const getDiscountedPrice = (price, discount) => {
//     if (!discount || discount === 0) return price;
//     return price - (price * (discount / 100));
//   };

//   // Get image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath;
//     if (imagePath.startsWith('/uploads')) {
//       return `${API_URL}${imagePath}`;
//     }
//     return `${API_URL}/uploads/images/${imagePath}`;
//   };

//   // Open product detail modal
//   const openProductModal = (product) => {
//     setSelectedProduct(product);
//     setShowModal(true);
//     document.body.style.overflow = 'hidden';
//   };

//   // Close product detail modal
//   const closeProductModal = () => {
//     setShowModal(false);
//     setSelectedProduct(null);
//     document.body.style.overflow = 'auto';
//   };

//   // Close on backdrop click
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       closeProductModal();
//     }
//   };

//   // Close on Escape key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') closeProductModal();
//     };
//     document.addEventListener('keydown', handleEsc);
//     return () => document.removeEventListener('keydown', handleEsc);
//   }, []);

//   // Add to cart function
//   const addToCart = (product) => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     const existingItem = cart.find(item => item._id === product._id);
    
//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cart.push({
//         _id: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         quantity: 1,
//         discount: product.discount || 0
//       });
//     }
    
//     localStorage.setItem('cart', JSON.stringify(cart));
//     alert(`${product.name} added to cart!`);
//     closeProductModal();
//   };

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleSortChange = (e) => {
//     const value = e.target.value;
//     switch(value) {
//       case "price_low":
//         setSortBy("price");
//         setSortOrder("asc");
//         break;
//       case "price_high":
//         setSortBy("price");
//         setSortOrder("desc");
//         break;
//       default:
//         setSortBy("createdAt");
//         setSortOrder("desc");
//     }
//     setCurrentPage(1);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="category-products-page">
//         <div className="category-products-container">
//           <div className="category-header">
//             <h1>{decodedCategory}</h1>
//             <p>Loading products...</p>
//           </div>
//           <div className="category-products-grid">
//             {[...Array(8)].map((_, index) => (
//               <div key={index} className="product-card skeleton">
//                 <div className="skeleton-image"></div>
//                 <div className="skeleton-info">
//                   <div className="skeleton-text"></div>
//                   <div className="skeleton-text short"></div>
//                   <div className="skeleton-text price"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="category-products-page">
//         <div className="category-products-container">
//           <div className="error-container">
//             <h2>Oops! Something went wrong</h2>
//             <p>{error}</p>
//             <button className="retry-btn" onClick={() => window.location.reload()}>
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="category-products-page">
//         <div className="category-products-container">
//           {/* Category Header */}
//           <div className="category-header">
//             <h1>{decodedCategory}</h1>
//             <p className="category-subtitle">
//               {totalProducts > 0 
//                 ? `Showing ${totalProducts} products in ${decodedCategory}`
//                 : `No products found in ${decodedCategory}`
//               }
//             </p>
//           </div>

//           <div className="category-layout">
//             {/* Sidebar with Categories */}
//             <aside className="category-sidebar">
//               <h3>Categories</h3>
//               <ul className="category-list">
//                 <li>
//                   <Link to="/products" className="category-link">
//                     All Products
//                   </Link>
//                 </li>
//                 {categories.map((cat, index) => (
//                   <li key={index}>
//                     <Link 
//                       to={`/categories/${encodeURIComponent(cat)}`}
//                       className={`category-link ${cat === decodedCategory ? 'active' : ''}`}
//                     >
//                       {cat}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </aside>

//             {/* Main Content */}
//             <main className="category-main">
//               {/* Sort Bar */}
//               <div className="sort-bar">
//                 <span className="sort-label">Sort By:</span>
//                 <select className="sort-select" onChange={handleSortChange} defaultValue="featured">
//                   <option value="featured">Featured</option>
//                   <option value="price_low">Price: Low to High</option>
//                   <option value="price_high">Price: High to Low</option>
//                 </select>
//               </div>

//               {/* Products Grid */}
//               {products.length === 0 ? (
//                 <div className="no-products">
//                   <h3>No products found in this category</h3>
//                   <p>Check back later for new products in {decodedCategory}</p>
//                   <Link to="/products" className="browse-all-btn">Browse All Products</Link>
//                 </div>
//               ) : (
//                 <>
//                   <div className="category-products-grid">
//                     {products.map((product) => (
//                       <div 
//                         key={product._id} 
//                         className="product-card"
//                         onClick={() => openProductModal(product)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <div className="product-image-wrapper">
//                           <img 
//                             src={getImageUrl(product.image)} 
//                             alt={product.name} 
//                             className="product-image"
//                             onError={(e) => {
//                               e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23cccccc"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="20" fill="%23666666"%3ENo Image%3C/text%3E%3C/svg%3E';
//                             }}
//                           />
//                           {product.badge && (
//                             <span className="product-badge">{product.badge}</span>
//                           )}
//                           {product.discount > 0 && (
//                             <span className="product-discount">{product.discount}% OFF</span>
//                           )}
//                         </div>
//                         <div className="product-info">
//                           <span className="product-category">{product.category}</span>
//                           <h3 className="product-name">{product.name}</h3>
//                           <div className="product-price-wrapper">
//                             <p className="product-price">
//                               {formatPrice(product.price)}
//                               {product.discount > 0 && (
//                                 <span className="original-price">
//                                   {formatPrice(product.price / (1 - product.discount / 100))}
//                                 </span>
//                               )}
//                             </p>
//                           </div>
//                           {product.rating > 0 && (
//                             <div className="product-rating">
//                               {"⭐".repeat(Math.round(product.rating))}
//                               <span className="rating-count">({product.reviews})</span>
//                             </div>
//                           )}
//                           <button 
//                             className="add-to-cart-btn"
//                             disabled={!product.inStock}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               addToCart(product);
//                             }}
//                           >
//                             {product.inStock ? "Add to Cart" : "Out of Stock"}
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && (
//                     <div className="pagination">
//                       <button 
//                         className="pagination-btn"
//                         onClick={() => paginate(currentPage - 1)}
//                         disabled={currentPage === 1}
//                       >
//                         ❮ Previous
//                       </button>
//                       <div className="pagination-numbers">
//                         {[...Array(totalPages)].map((_, index) => {
//                           const pageNumber = index + 1;
//                           if (
//                             pageNumber === 1 ||
//                             pageNumber === totalPages ||
//                             (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//                           ) {
//                             return (
//                               <button
//                                 key={index}
//                                 className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
//                                 onClick={() => paginate(pageNumber)}
//                               >
//                                 {pageNumber}
//                               </button>
//                             );
//                           } else if (
//                             pageNumber === currentPage - 2 ||
//                             pageNumber === currentPage + 2
//                           ) {
//                             return <span key={index} className="pagination-ellipsis">…</span>;
//                           }
//                           return null;
//                         })}
//                       </div>
//                       <button 
//                         className="pagination-btn"
//                         onClick={() => paginate(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next ❯
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </main>
//           </div>
//         </div>
//       </div>

//       {/* Product Detail Modal */}
//       {showModal && selectedProduct && (
//         <div className="product-modal-overlay" onClick={handleBackdropClick}>
//           <div className="product-modal">
//             <button className="modal-close-btn" onClick={closeProductModal}>✕</button>
            
//             <div className="modal-content-wrapper">
//               {/* Left: Image */}
//               <div className="modal-image-section">
//                 <img 
//                   src={getImageUrl(selectedProduct.image)} 
//                   alt={selectedProduct.name} 
//                   className="modal-product-image"
//                   onError={(e) => {
//                     e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
//                   }}
//                 />
//                 {selectedProduct.badge && (
//                   <span className="modal-badge">{selectedProduct.badge}</span>
//                 )}
//               </div>

//               {/* Right: Details */}
//               <div className="modal-details-section">
//                 <div className="modal-product-category">{selectedProduct.category || 'Product'}</div>
//                 <h2 className="modal-product-title">{selectedProduct.name}</h2>
                
//                 <div className="modal-rating">
//                   {'⭐'.repeat(Math.round(selectedProduct.rating || 0))}
//                   <span className="modal-rating-count">({selectedProduct.reviews || 0} reviews)</span>
//                 </div>

//                 <div className="modal-price-section">
//                   <span className="modal-current-price">
//                     {formatPrice(getDiscountedPrice(selectedProduct.price, selectedProduct.discount))}
//                   </span>
//                   {selectedProduct.discount > 0 && (
//                     <>
//                       <span className="modal-original-price">
//                         {formatPrice(selectedProduct.price)}
//                       </span>
//                       <span className="modal-discount-percent">
//                         {selectedProduct.discount}% OFF
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 <div className="modal-stock-status">
//                   <span className={`stock-indicator ${selectedProduct.inStock ? 'in-stock' : 'out-of-stock'}`}>
//                     {selectedProduct.inStock ? '✅ In Stock' : '❌ Out of Stock'}
//                   </span>
//                 </div>

//                 <div className="modal-description">
//                   <h4>Description</h4>
//                   <p>{selectedProduct.description || 'No description available.'}</p>
//                 </div>

//                 {selectedProduct.quantity && (
//                   <div className="modal-quantity-info">
//                     <span>Quantity Available: {selectedProduct.quantity}</span>
//                   </div>
//                 )}

//                 <button 
//                   className="modal-add-to-cart-btn"
//                   onClick={() => addToCart(selectedProduct)}
//                   disabled={!selectedProduct.inStock}
//                 >
//                   {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CategoryProducts;
// src/ecommerce/CategoryProducts.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CategoryProducts.css";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  const productsPerPage = 12;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Decode category name from URL
  const decodedCategory = decodeURIComponent(category);

  // Fetch categories for navbar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Fetch products by category
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage,
          limit: productsPerPage,
          category: decodedCategory,
          sortBy: sortBy,
          sortOrder: sortOrder
        });

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
        setError("Error loading products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (decodedCategory) {
      fetchProductsByCategory();
    }
  }, [decodedCategory, currentPage, sortBy, sortOrder, API_URL]);

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
    setCartMessage(null);
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

  // Add to cart function with feedback
  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    
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
    
    // Show success message
    setCartMessage(`${product.name} added to cart!`);
    setTimeout(() => setCartMessage(null), 3000);
    
    // Close modal after short delay
    setTimeout(() => {
      closeProductModal();
    }, 1000);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      default:
        setSortBy("createdAt");
        setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="category-products-page">
        <div className="category-products-container">
          {/* Category Navbar Skeleton */}
          <div className="category-navbar skeleton-nav">
            <div className="category-nav-scroll">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-nav-item"></div>
              ))}
            </div>
          </div>

          <div className="category-header-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>

          <div className="category-products-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="product-card skeleton">
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
      <div className="category-products-page">
        <div className="category-products-container">
          <div className="error-container">
            <div className="error-icon">😕</div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="category-products-page">
        <div className="category-products-container">
          {/* Category Navbar - Horizontal */}
          <nav className="category-navbar">
            <div className="category-nav-scroll">
              <Link to="/products" className={`nav-category-item ${!decodedCategory ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span>
                <span>All Products</span>
              </Link>
              {categories.map((cat, index) => (
                <Link
                  key={index}
                  to={`/categories/${encodeURIComponent(cat)}`}
                  className={`nav-category-item ${cat === decodedCategory ? 'active' : ''}`}
                >
                  <span className="nav-icon">
                    {getCategoryIcon(cat)}
                  </span>
                  <span>{cat}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Category Header */}
          <div className="category-header">
            <div className="category-header-content">
              <h1>
                <span className="header-icon">{getCategoryIcon(decodedCategory)}</span>
                {decodedCategory}
              </h1>
              <p className="category-subtitle">
                {totalProducts > 0 
                  ? `Showing ${totalProducts} products in ${decodedCategory}`
                  : `No products found in ${decodedCategory}`
                }
              </p>
            </div>
          </div>

          {/* Sort Bar */}
          <div className="sort-bar">
            <div className="sort-left">
              <span className="sort-label">Sort By:</span>
              <select className="sort-select" onChange={handleSortChange} defaultValue="featured">
                <option value="featured">⭐ Featured</option>
                <option value="price_low">💰 Price: Low to High</option>
                <option value="price_high">💰 Price: High to Low</option>
              </select>
            </div>
            <div className="sort-right">
              <span className="product-count">{totalProducts} products</span>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>No products found in this category</h3>
              <p>Check back later for new products in {decodedCategory}</p>
              <Link to="/products" className="browse-all-btn">Browse All Products</Link>
            </div>
          ) : (
            <>
              <div className="category-products-grid">
                {products.map((product) => (
                  <div 
                    key={product._id} 
                    className="product-card"
                    onClick={() => openProductModal(product)}
                  >
                    <div className="product-image-wrapper">
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        className="product-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f5f5f5"/%3E%3Ctext x="50" y="150" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      {product.discount > 0 && (
                        <span className="product-discount">-{product.discount}%</span>
                      )}
                      {!product.inStock && (
                        <div className="product-out-of-stock-overlay">
                          <span>Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-price-wrapper">
                        <span className="product-price">
                          {formatPrice(getDiscountedPrice(product.price, product.discount))}
                        </span>
                        {product.discount > 0 && (
                          <span className="original-price">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      {product.rating > 0 && (
                        <div className="product-rating">
                          <span className="stars">
                            {'★'.repeat(Math.round(product.rating))}
                            {'☆'.repeat(5 - Math.round(product.rating))}
                          </span>
                          <span className="rating-count">({product.reviews || 0})</span>
                        </div>
                      )}
                      <button 
                        className="add-to-cart-btn"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, e);
                        }}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ◀ Previous
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
                        return <span key={index} className="pagination-ellipsis">…</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button 
                    className="pagination-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Detail Modal - Enhanced */}
      {showModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={handleBackdropClick}>
          <div className="product-modal">
            <button className="modal-close-btn" onClick={closeProductModal}>
              ✕
            </button>
            
            {cartMessage && (
              <div className="modal-cart-message">
                <span className="message-icon">✅</span>
                {cartMessage}
              </div>
            )}

            <div className="modal-content-wrapper">
              {/* Left: Image Gallery */}
              <div className="modal-image-section">
                <div className="modal-image-container">
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
                  {selectedProduct.discount > 0 && (
                    <span className="modal-discount-badge">
                      {selectedProduct.discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="modal-details-section">
                <div className="modal-category-tag">{selectedProduct.category || 'Product'}</div>
                
                <h2 className="modal-product-title">{selectedProduct.name}</h2>
                
                <div className="modal-rating-section">
                  <div className="modal-stars">
                    {'★'.repeat(Math.round(selectedProduct.rating || 0))}
                    {'☆'.repeat(5 - Math.round(selectedProduct.rating || 0))}
                  </div>
                  <span className="modal-rating-count">
                    {selectedProduct.reviews || 0} reviews
                  </span>
                  <span className="modal-rating-divider">|</span>
                  <span className="modal-stock-status">
                    <span className={`stock-dot ${selectedProduct.inStock ? 'in-stock' : 'out-of-stock'}`}></span>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="modal-price-section">
                  <div className="modal-price-main">
                    <span className="modal-current-price">
                      {formatPrice(getDiscountedPrice(selectedProduct.price, selectedProduct.discount))}
                    </span>
                    {selectedProduct.discount > 0 && (
                      <span className="modal-original-price">
                        {formatPrice(selectedProduct.price)}
                      </span>
                    )}
                  </div>
                  {selectedProduct.discount > 0 && (
                    <div className="modal-savings">
                      Save {formatPrice(selectedProduct.price * (selectedProduct.discount / 100))}
                    </div>
                  )}
                </div>

                {selectedProduct.description && (
                  <div className="modal-description">
                    <h4>Description</h4>
                    <p>{selectedProduct.description}</p>
                  </div>
                )}

                <div className="modal-features">
                  {selectedProduct.quantity && (
                    <div className="modal-feature-item">
                      <span className="feature-icon">📦</span>
                      <span>Quantity: {selectedProduct.quantity} available</span>
                    </div>
                  )}
                  {selectedProduct.sku && (
                    <div className="modal-feature-item">
                      <span className="feature-icon">🔑</span>
                      <span>SKU: {selectedProduct.sku}</span>
                    </div>
                  )}
                  <div className="modal-feature-item">
                    <span className="feature-icon">🛒</span>
                    <span>Free shipping on orders above ₹499</span>
                  </div>
                </div>

                <button 
                  className={`modal-add-to-cart-btn ${!selectedProduct.inStock ? 'disabled' : ''}`}
                  onClick={() => addToCart(selectedProduct)}
                  disabled={!selectedProduct.inStock}
                >
                  {selectedProduct.inStock ? (
                    <>
                      <span className="btn-icon">🛒</span>
                      Add to Cart
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </button>

                <div className="modal-guarantee">
                  <span className="guarantee-icon">✅</span>
                  <span>30-day money-back guarantee</span>
                  <span className="guarantee-divider">•</span>
                  <span className="guarantee-icon">🔒</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Electronics': '📱',
    'Fashion': '👕',
    'Home & Living': '🏠',
    'Books': '📚',
    'Beauty': '💄',
    'Sports': '⚽',
    'Toys': '🎮',
    'Automotive': '🚗',
    'Health': '💊',
    'Food': '🍕'
  };
  return icons[category] || '📦';
};

export default CategoryProducts;