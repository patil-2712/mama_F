
// // OrganicProducts.jsx
// import React, { useState, useEffect } from "react";
// import "./OrganicProducts.css";

// const OrganicProducts = ({ searchTerm = "" }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // Default categories to show
//   const TARGET_CATEGORIES = [
//     "Organic Tea",
//     "Organic Millet", 
//     "Organic Spices",
//     "Dairy"
//   ];

//   useEffect(() => {
//     const fetchOrganicProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // If search term is provided, use search API
//         if (searchTerm && searchTerm.trim()) {
//           console.log(`🔍 Searching products for: "${searchTerm}"`);
//           const response = await fetch(
//             `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}&limit=4&inStock=true`
//           );
//           const data = await response.json();
          
//           if (data.success && data.data && data.data.length > 0) {
//             console.log(`✅ Found ${data.data.length} products for search`);
//             setProducts(data.data);
//           } else {
//             console.log("⚠️ No search results found");
//             setProducts([]);
//           }
//           setLoading(false);
//           return;
//         }

//         // If no search term, fetch by categories
//         console.log("📂 Fetching products for categories:", TARGET_CATEGORIES);
        
//         // Try to fetch one product from each target category
//         const productPromises = TARGET_CATEGORIES.map(async (category) => {
//           try {
//             const response = await fetch(
//               `${API_URL}/api/products?category=${encodeURIComponent(category)}&limit=1&inStock=true`
//             );
//             const data = await response.json();
//             if (data.success && data.data && data.data.length > 0) {
//               console.log(`✅ Found product for category: ${category}`);
//               return data.data[0];
//             }
//             console.log(`⚠️ No product found for category: ${category}`);
//             return null;
//           } catch (err) {
//             console.error(`Error fetching product for category ${category}:`, err);
//             return null;
//           }
//         });

//         let results = await Promise.all(productPromises);
        
//         // Filter out null results
//         let validProducts = results.filter(product => product !== null);
//         console.log(`✅ Loaded ${validProducts.length} products from specific categories`);
        
//         // If no products found from specific categories, fetch default products
//         if (validProducts.length === 0) {
//           console.log("📂 No category products found, fetching default products...");
          
//           const defaultResponse = await fetch(
//             `${API_URL}/api/products?limit=4&inStock=true&sortBy=createdAt&sortOrder=desc`
//           );
//           const defaultData = await defaultResponse.json();
          
//           if (defaultData.success && defaultData.data && defaultData.data.length > 0) {
//             validProducts = defaultData.data;
//             console.log(`✅ Loaded ${validProducts.length} default products from backend`);
//           }
//         }
        
//         // If still no products, use fallback
//         if (validProducts.length === 0) {
//           console.log("⚠️ No products found from API, using fallback");
//           validProducts = getFallbackProducts();
//         }
        
//         setProducts(validProducts);
        
//       } catch (err) {
//         console.error("❌ Error fetching organic products:", err);
//         setError("Error loading products");
//         setProducts(getFallbackProducts());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrganicProducts();
//   }, [API_URL, searchTerm]); // Add searchTerm as dependency

//   // Fallback products in case API fails
//   const getFallbackProducts = () => {
//     return [
//       {
//         _id: "fallback1",
//         name: "Organic Green Tea Powder",
//         price: 799,
//         discount: 10,
//         description: "Pure organic green tea powder rich in antioxidants. Boosts metabolism and immunity.",
//         category: "Organic Tea",
//         image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop",
//         inStock: true,
//         rating: 4.5,
//         reviews: 89,
//         badge: "Organic",
//         quantity: 50
//       },
//       {
//         _id: "fallback2",
//         name: "Pearl Millet (Bajra)",
//         price: 450,
//         discount: 5,
//         description: "Organic pearl millet rich in iron and fiber. Gluten-free and highly nutritious.",
//         category: "Organic Millet",
//         image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
//         inStock: true,
//         rating: 4.3,
//         reviews: 67,
//         badge: "Organic",
//         quantity: 100
//       },
//       {
//         _id: "fallback3",
//         name: "Organic Spices Set",
//         price: 999,
//         discount: 15,
//         description: "Premium organic spice collection including turmeric, cumin, coriander, and more.",
//         category: "Organic Spices",
//         image: "https://images.unsplash.com/photo-1532335696416-5f6e026d02f5?w=400&h=400&fit=crop",
//         inStock: true,
//         rating: 4.7,
//         reviews: 156,
//         badge: "Pure",
//         quantity: 30
//       },
//       {
//         _id: "fallback4",
//         name: "100% Natural Milk Goodness",
//         price: 299,
//         discount: 0,
//         description: "Pure and natural milk products rich in calcium and protein. Perfect for daily nutrition.",
//         category: "Dairy",
//         image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
//         inStock: true,
//         rating: 4.6,
//         reviews: 210,
//         badge: "Natural",
//         quantity: 75
//       }
//     ];
//   };

//   // Function to capitalize first letter of each word
//   const capitalizeFirstLetter = (text) => {
//     if (!text) return '';
//     return text.split(' ').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//     ).join(' ');
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

//   // Format price
//   const formatPrice = (price) => {
//     return `₹${parseFloat(price).toLocaleString('en-IN')}`;
//   };

//   // Calculate discounted price
//   const getDiscountedPrice = (price, discount) => {
//     if (!discount || discount === 0) return price;
//     return price - (price * (discount / 100));
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

//   // Loading state
//   if (loading) {
//     return (
//       <section className="organic-products-section">
//         <div className="organic-products-container">
//           <div className="organic-section-header">
//             <h2 className="organic-section-title">
//               {searchTerm ? `Searching for "${searchTerm}"...` : "Health Food Products"}
//             </h2>
//           </div>
//           <div className="organic-products-grid">
//             {[...Array(4)].map((_, index) => (
//               <div key={index} className="organic-product-card skeleton">
//                 <div className="organic-product-image-wrapper skeleton-image"></div>
//                 <div className="organic-product-name-wrapper">
//                   <div className="skeleton-text"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="organic-products-section">
//         <div className="organic-products-container">
//           <div className="organic-section-header">
//             <h2 className="organic-section-title">
//               {searchTerm ? `Results for "${searchTerm}"` : "Health Food Products"}
//             </h2>
//             {products.length > 0 && searchTerm && (
//               <span className="organic-products-count">{products.length} products found</span>
//             )}
//           </div>

//           {products.length === 0 && searchTerm ? (
//             <div className="organic-no-products">
//               <h3>No products found for "{searchTerm}"</h3>
//               <p>Try adjusting your search or browse our categories below.</p>
//             </div>
//           ) : (
//             <div className="organic-products-grid">
//               {products.map((product) => (
//                 <div 
//                   key={product._id} 
//                   className="organic-product-card"
//                   onClick={() => openProductModal(product)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {/* Image Container */}
//                   <div className="organic-product-image-wrapper">
//                     <img 
//                       src={getImageUrl(product.image)} 
//                       alt={product.name} 
//                       className="organic-product-image"
//                       loading="lazy"
//                       onError={(e) => {
//                         console.log("🖼️ Image failed to load:", product.image);
//                         e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
//                       }}
//                     />
//                     {product.badge && (
//                       <span className="organic-product-badge">{product.badge}</span>
//                     )}
//                     {product.discount > 0 && (
//                       <span className="organic-product-discount">{product.discount}% OFF</span>
//                     )}
//                   </div>
                  
//                   {/* Name Container */}
//                   <div className="organic-product-name-wrapper">
//                     <h3 className="organic-product-name">
//                       {capitalizeFirstLetter(product.name)}
//                     </h3>
//                     <p className="organic-product-price">
//                       {formatPrice(getDiscountedPrice(product.price, product.discount))}
//                       {product.discount > 0 && (
//                         <span className="organic-original-price">
//                           {formatPrice(product.price)}
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Product Detail Modal */}
//       {showModal && selectedProduct && (
//         <div className="organic-modal-overlay" onClick={handleBackdropClick}>
//           <div className="organic-modal">
//             <button className="organic-modal-close-btn" onClick={closeProductModal}>✕</button>
            
//             <div className="organic-modal-content-wrapper">
//               {/* Left: Image */}
//               <div className="organic-modal-image-section">
//                 <img 
//                   src={getImageUrl(selectedProduct.image)} 
//                   alt={selectedProduct.name} 
//                   className="organic-modal-product-image"
//                   onError={(e) => {
//                     e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
//                   }}
//                 />
//                 {selectedProduct.badge && (
//                   <span className="organic-modal-badge">{selectedProduct.badge}</span>
//                 )}
//               </div>

//               {/* Right: Details */}
//               <div className="organic-modal-details-section">
//                 <div className="organic-modal-product-category">{selectedProduct.category || 'Product'}</div>
//                 <h2 className="organic-modal-product-title">{capitalizeFirstLetter(selectedProduct.name)}</h2>
          
//                 <div className="organic-modal-price-section">
//                   <span className="organic-modal-current-price">
//                     {formatPrice(getDiscountedPrice(selectedProduct.price, selectedProduct.discount))}
//                   </span>
//                   {selectedProduct.discount > 0 && (
//                     <>
//                       <span className="organic-modal-original-price">
//                         {formatPrice(selectedProduct.price)}
//                       </span>
//                       <span className="organic-modal-discount-percent">
//                         {selectedProduct.discount}% OFF
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 <div className="organic-modal-description">
//                   <h4>Description</h4>
//                   <p>{selectedProduct.description || 'No description available.'}</p>
//                 </div>

//                 <button 
//                   className="organic-modal-add-to-cart-btn"
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

// export default OrganicProducts;
// OrganicProducts.jsx - COMPLETE FIXED VERSION


import React, { useState, useEffect } from "react";
import "./OrganicProducts.css";

const OrganicProducts = ({ searchTerm = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Default categories to show
  const TARGET_CATEGORIES = [
    "Organic Tea",
    "Organic Millet", 
    "Organic Spices",
    "Dairy"
  ];

  useEffect(() => {
    const fetchOrganicProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If search term is provided, use search API
        if (searchTerm && searchTerm.trim()) {
          console.log(`🔍 Searching products for: "${searchTerm}"`);
          const response = await fetch(
            `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}&limit=4&inStock=true`
          );
          const data = await response.json();
          
          if (data.success && data.data && data.data.length > 0) {
            console.log(`✅ Found ${data.data.length} products for search`);
            // Filter out duplicates by _id
            const uniqueProducts = data.data.filter((product, index, self) => 
              index === self.findIndex((p) => p._id === product._id)
            );
            setProducts(uniqueProducts);
          } else {
            console.log("⚠️ No search results found");
            setProducts([]);
          }
          setLoading(false);
          return;
        }

        // If no search term, fetch by categories
        console.log("📂 Fetching products for categories:", TARGET_CATEGORIES);
        
        // Try to fetch one product from each target category
        const productPromises = TARGET_CATEGORIES.map(async (category) => {
          try {
            const response = await fetch(
              `${API_URL}/api/products?category=${encodeURIComponent(category)}&limit=1&inStock=true`
            );
            const data = await response.json();
            if (data.success && data.data && data.data.length > 0) {
              console.log(`✅ Found product for category: ${category}`);
              return data.data[0];
            }
            console.log(`⚠️ No product found for category: ${category}`);
            return null;
          } catch (err) {
            console.error(`Error fetching product for category ${category}:`, err);
            return null;
          }
        });

        let results = await Promise.all(productPromises);
        
        // Filter out null results
        let validProducts = results.filter(product => product !== null);
        
        // Remove duplicates by _id
        const uniqueProducts = validProducts.filter((product, index, self) => 
          index === self.findIndex((p) => p._id === product._id)
        );
        
        console.log(`✅ Loaded ${uniqueProducts.length} unique products from specific categories`);
        
        // If no products found from specific categories, fetch default products
        if (uniqueProducts.length === 0) {
          console.log("📂 No category products found, fetching default products...");
          
          const defaultResponse = await fetch(
            `${API_URL}/api/products?limit=4&inStock=true&sortBy=createdAt&sortOrder=desc`
          );
          const defaultData = await defaultResponse.json();
          
          if (defaultData.success && defaultData.data && defaultData.data.length > 0) {
            // Remove duplicates from default products
            const uniqueDefault = defaultData.data.filter((product, index, self) => 
              index === self.findIndex((p) => p._id === product._id)
            );
            validProducts = uniqueDefault;
            console.log(`✅ Loaded ${validProducts.length} unique default products from backend`);
          }
        }
        
        // If still no products, use fallback
        if (validProducts.length === 0) {
          console.log("⚠️ No products found from API, using fallback");
          validProducts = getFallbackProducts();
        }
        
        setProducts(validProducts);
        
      } catch (err) {
        console.error("❌ Error fetching organic products:", err);
        setError("Error loading products");
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchOrganicProducts();
  }, [API_URL, searchTerm]);

  // Fallback products in case API fails
  const getFallbackProducts = () => {
    return [
      {
        _id: "fallback1",
        name: "Organic Green Tea Powder",
        price: 799,
        discount: 10,
        description: "Pure organic green tea powder rich in antioxidants. Boosts metabolism and immunity.",
        category: "Organic Tea",
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.5,
        reviews: 89,
        badge: "Organic",
        quantity: 50
      },
      {
        _id: "fallback2",
        name: "Pearl Millet (Bajra)",
        price: 450,
        discount: 5,
        description: "Organic pearl millet rich in iron and fiber. Gluten-free and highly nutritious.",
        category: "Organic Millet",
        image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.3,
        reviews: 67,
        badge: "Organic",
        quantity: 100
      },
      {
        _id: "fallback3",
        name: "Organic Spices Set",
        price: 999,
        discount: 15,
        description: "Premium organic spice collection including turmeric, cumin, coriander, and more.",
        category: "Organic Spices",
        image: "https://images.unsplash.com/photo-1532335696416-5f6e026d02f5?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.7,
        reviews: 156,
        badge: "Pure",
        quantity: 30
      },
      {
        _id: "fallback4",
        name: "100% Natural Milk Goodness",
        price: 299,
        discount: 0,
        description: "Pure and natural milk products rich in calcium and protein. Perfect for daily nutrition.",
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
        inStock: true,
        rating: 4.6,
        reviews: 210,
        badge: "Natural",
        quantity: 75
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

  // Format price - FIXED for proper display
  const formatPrice = (price) => {
    if (!price || isNaN(parseFloat(price))) return '₹0';
    const numPrice = parseFloat(price);
    if (Number.isInteger(numPrice)) {
      return `₹${numPrice.toLocaleString('en-IN')}`;
    } else {
      return `₹${numPrice.toFixed(2).toLocaleString('en-IN')}`;
    }
  };

  // Calculate discounted price - FIXED
  const getDiscountedPrice = (price, discount) => {
    if (!price || isNaN(parseFloat(price))) return 0;
    const numPrice = parseFloat(price);
    if (!discount || discount === 0) return numPrice;
    const discounted = numPrice - (numPrice * (discount / 100));
    return Math.round(discounted * 100) / 100;
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
      <section className="organic-products-section">
        <div className="organic-products-container">
          <div className="organic-section-header">
            <h2 className="organic-section-title">
              {searchTerm ? `Searching for "${searchTerm}"...` : "Health Food Products"}
            </h2>
          </div>
          <div className="organic-products-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="organic-product-card skeleton">
                <div className="organic-product-image-wrapper skeleton-image"></div>
                <div className="organic-product-name-wrapper">
                  <div className="skeleton-text"></div>
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
      <section className="organic-products-section">
        <div className="organic-products-container">
          <div className="organic-section-header">
            <h2 className="organic-section-title">
              {searchTerm ? `Results for "${searchTerm}"` : "Health Food Products"}
            </h2>
            {products.length > 0 && searchTerm && (
              <span className="organic-products-count">{products.length} products found</span>
            )}
          </div>

          {products.length === 0 && searchTerm ? (
            <div className="organic-no-products">
              <h3>No products found for "{searchTerm}"</h3>
              <p>Try adjusting your search or browse our categories below.</p>
            </div>
          ) : (
            <div className="organic-products-grid">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="organic-product-card"
                  onClick={() => openProductModal(product)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Image Container */}
                  <div className="organic-product-image-wrapper">
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      className="organic-product-image"
                      loading="lazy"
                      onError={(e) => {
                        console.log("🖼️ Image failed to load:", product.image);
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {product.badge && (
                      <span className="organic-product-badge">{product.badge}</span>
                    )}
                    {product.discount > 0 && (
                      <span className="organic-product-discount">{product.discount}% OFF</span>
                    )}
                  </div>
                  
                  {/* Name Container */}
                  <div className="organic-product-name-wrapper">
                    <h3 className="organic-product-name">
                      {capitalizeFirstLetter(product.name)}
                    </h3>
                    <p className="organic-product-price">
                      {formatPrice(getDiscountedPrice(product.price, product.discount))}
                      {product.discount > 0 && (
                        <span className="organic-original-price">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="organic-modal-overlay" onClick={handleBackdropClick}>
          <div className="organic-modal">
            <button className="organic-modal-close-btn" onClick={closeProductModal}>✕</button>
            
            <div className="organic-modal-content-wrapper">
              {/* Left: Image */}
              <div className="organic-modal-image-section">
                <img 
                  src={getImageUrl(selectedProduct.image)} 
                  alt={selectedProduct.name} 
                  className="organic-modal-product-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50" y="200" font-family="Arial" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                {selectedProduct.badge && (
                  <span className="organic-modal-badge">{selectedProduct.badge}</span>
                )}
                {selectedProduct.discount > 0 && (
                  <span className="organic-modal-discount-badge">{selectedProduct.discount}% OFF</span>
                )}
              </div>

              {/* Right: Details */}
              <div className="organic-modal-details-section">
                <div className="organic-modal-product-category">{selectedProduct.category || 'Product'}</div>
                <h2 className="organic-modal-product-title">{capitalizeFirstLetter(selectedProduct.name)}</h2>
          
                <div className="organic-modal-price-section">
                  <span className="organic-modal-current-price">
                    {formatPrice(getDiscountedPrice(selectedProduct.price, selectedProduct.discount))}
                  </span>
                  {selectedProduct.discount > 0 && (
                    <>
                      <span className="organic-modal-original-price">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <span className="organic-modal-discount-percent">
                        {selectedProduct.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="organic-modal-description">
                  <h4>Description</h4>
                  <p>{selectedProduct.description || 'No description available.'}</p>
                </div>

                <button 
                  className="organic-modal-add-to-cart-btn"
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

export default OrganicProducts;