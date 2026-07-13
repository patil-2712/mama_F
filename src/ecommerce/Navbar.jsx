// // // src/ecommerce/Navbar.jsx
// // import React, { useState, useEffect, useRef } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import LoginPopup from "./LoginPopup";
// // import "./Navbar.css";

// // const Navbar = () => {
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const [isMoreOpen, setIsMoreOpen] = useState(false);
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [cartCount, setCartCount] = useState(0);
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [showLoginPopup, setShowLoginPopup] = useState(false);
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(false);
  
// //   // Search states
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [showSearchResults, setShowSearchResults] = useState(false);
// //   const [isSearching, setIsSearching] = useState(false);
// //   const searchRef = useRef(null);
  
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await fetch(`${API_URL}/api/categories`);
// //         const data = await response.json();
// //         if (data.success) {
// //           setCategories(data.data || []);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching categories:", error);
// //         setCategories([
// //           "Sports Nutrition",
// //           "Health Drinks",
// //           "Organic Tea",
// //           "Organic Spices",
// //           "Superfoods"
// //         ]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchCategories();
// //   }, [API_URL]);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     const userData = localStorage.getItem("user");
// //     if (token && userData) {
// //       setIsLoggedIn(true);
// //       try {
// //         setUser(JSON.parse(userData));
// //       } catch (error) {
// //         localStorage.clear();
// //         setIsLoggedIn(false);
// //         setUser(null);
// //       }
// //     }
// //     const savedCart = localStorage.getItem("cart");
// //     if (savedCart) {
// //       try {
// //         const items = JSON.parse(savedCart);
// //         setCartCount(items.reduce((total, item) => total + item.quantity, 0));
// //       } catch (error) {
// //         console.error("Error parsing cart:", error);
// //       }
// //     }
// //   }, []);

// //   // Close search results on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (searchRef.current && !searchRef.current.contains(event.target)) {
// //         setShowSearchResults(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // Search products with debounce
// //   useEffect(() => {
// //     const searchProducts = async () => {
// //       if (searchTerm.trim().length < 2) {
// //         setSearchResults([]);
// //         setShowSearchResults(false);
// //         return;
// //       }

// //       setIsSearching(true);
// //       try {
// //         const response = await fetch(
// //           `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}&limit=5`
// //         );
// //         const data = await response.json();
        
// //         if (data.success) {
// //           setSearchResults(data.data || []);
// //           setShowSearchResults(true);
// //         } else {
// //           setSearchResults([]);
// //         }
// //       } catch (error) {
// //         console.error("Search error:", error);
// //         setSearchResults([]);
// //       } finally {
// //         setIsSearching(false);
// //       }
// //     };

// //     const debounceTimer = setTimeout(searchProducts, 300);
// //     return () => clearTimeout(debounceTimer);
// //   }, [searchTerm, API_URL]);

// //   const isActive = (path) => (location.pathname === path ? 'active' : '');

// //   const handleLogout = () => {
// //     localStorage.clear();
// //     setIsLoggedIn(false);
// //     setUser(null);
// //     navigate("/");
// //     window.location.reload();
// //   };

// //   const handleSearchSubmit = (e) => {
// //     e.preventDefault();
// //     if (searchTerm.trim()) {
// //       navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
// //       setShowSearchResults(false);
// //       setSearchTerm("");
// //     }
// //   };

// //   const handleSearchChange = (e) => {
// //     setSearchTerm(e.target.value);
// //   };

// //   const handleResultClick = (product) => {
// //     setShowSearchResults(false);
// //     setSearchTerm("");
// //     navigate(`/products?search=${encodeURIComponent(product.name)}`);
// //   };

// //   const handleViewAllClick = () => {
// //     setShowSearchResults(false);
// //     const searchQuery = searchTerm.trim();
// //     setSearchTerm("");
// //     navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
// //   };

// //   const formatPrice = (price) => {
// //     return `₹${parseFloat(price).toLocaleString('en-IN')}`;
// //   };

// //   const getImageUrl = (imagePath) => {
// //     if (!imagePath) return '';
// //     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
// //       return imagePath;
// //     }
// //     if (imagePath.startsWith('/uploads')) {
// //       return `${API_URL}${imagePath}`;
// //     }
// //     return `${API_URL}/uploads/images/${imagePath}`;
// //   };

// //   return (
// //     <>
// //       <nav className="main-navbar">
// //         <div className="nav-container">
          
// //           {/* Left Area: Mobile Menu Toggle & Brand Identity */}
// //           <div className="nav-left-group">
// //             <button 
// //               className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
// //               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// //               aria-label="Toggle navigation"
// //             >
// //               <span></span>
// //               <span></span>
// //               <span></span>
// //             </button>
            
// //             <Link to="/" className="brand-identity">
// //               <img src="/logo.jpeg" alt="Assure Organic Zone Logo" className="brand-logo" />
// //               <span className="brand-name">MaisFood</span>
// //             </Link>
// //           </div>

// //           {/* Center Area: Desktop Menu Links */}
// //           <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
// //             <ul className="nav-menu-list">
// //               <li><Link to="/" className={`menu-link ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>HOME</Link></li>
              
// //               <li 
// //                 className="menu-link dropdown"
// //                 onMouseEnter={() => setIsDropdownOpen(true)}
// //                 onMouseLeave={() => setIsDropdownOpen(false)}
// //               >
// //                 <span className="dropdown-trigger">CATEGORIES <span className="arrow-down">▼</span></span>
// //                 {isDropdownOpen && (
// //                   <ul className="dropdown-menu-list">
// //                     {loading ? (
// //                       <li className="dropdown-info">Loading...</li>
// //                     ) : categories.length > 0 ? (
// //                       categories.map((cat, idx) => (
// //                         <li key={idx}>
// //                           <Link to={`/categories/${encodeURIComponent(cat)}`} onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}>
// //                             {cat}
// //                           </Link>
// //                         </li>
// //                       ))
// //                     ) : (
// //                       <li className="dropdown-info">No categories available</li>
// //                     )}
// //                   </ul>
// //                 )}
// //               </li>

// //               <li><Link to="/products" className={`menu-link ${isActive('/products')}`} onClick={() => setIsMobileMenuOpen(false)}>PRODUCTS</Link></li>
// //               <li><Link to="/about" className={`menu-link ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</Link></li>
// //               <li><Link to="/gallery" className={`menu-link ${isActive('/gallery')}`} onClick={() => setIsMobileMenuOpen(false)}>GALLERY</Link></li>
              
// //               <li 
// //                 className="menu-link dropdown"
// //                 onMouseEnter={() => setIsMoreOpen(true)}
// //                 onMouseLeave={() => setIsMoreOpen(false)}
// //               >
// //                 <span className="dropdown-trigger">MORE <span className="arrow-down">▼</span></span>
// //                 {isMoreOpen && (
// //                   <ul className="dropdown-menu-list">
// //                     <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
// //                     <li><Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>👤 Profile ({user?.name?.split(' ')[0]})</Link></li>
// //                     <li className="dropdown-divider"></li>
// //                     <li><button onClick={handleLogout} className="dropdown-logout-btn">Logout</button></li>
// //                   </ul>
// //                 )}
// //               </li>
// //             </ul>
// //           </div>

// //           {/* Right Area: Search & Bag */}
// //           <div className="nav-actions-right">
// //             <div className="search-container" ref={searchRef}>
// //               <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
// //                 <input 
// //                   type="text" 
// //                   placeholder="Search" 
// //                   className="search-field"
// //                   value={searchTerm}
// //                   onChange={handleSearchChange}
// //                   onFocus={() => searchTerm.trim().length >= 2 && setShowSearchResults(true)}
// //                 />
// //                 <button type="submit" className="search-submit-btn" aria-label="Search">
// //                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-svg">
// //                     <circle cx="11" cy="11" r="8"></circle>
// //                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
// //                   </svg>
// //                 </button>
// //               </form>

// //               {/* Search Results Dropdown */}
// //               {showSearchResults && (
// //                 <div className="search-results-dropdown">
// //                   {isSearching ? (
// //                     <div className="search-loading">Searching...</div>
// //                   ) : searchResults.length > 0 ? (
// //                     <>
// //                       {searchResults.map((product) => (
// //                         <div 
// //                           key={product._id}
// //                           className="search-result-item"
// //                           onClick={() => handleResultClick(product)}
// //                           style={{ cursor: 'pointer' }}
// //                         >
// //                           <img 
// //                             src={getImageUrl(product.image)} 
// //                             alt={product.name}
// //                             className="search-result-image"
// //                             onError={(e) => {
// //                               e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="25" font-family="Arial" font-size="10" fill="%23999"%3ENo%3C/text%3E%3C/svg%3E';
// //                             }}
// //                           />
// //                           <div className="search-result-info">
// //                             <div className="search-result-name">{product.name}</div>
// //                             <div className="search-result-price">{formatPrice(product.price)}</div>
// //                             {product.category && (
// //                               <div className="search-result-category">{product.category}</div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       ))}
// //                       <div 
// //                         className="search-view-all"
// //                         onClick={handleViewAllClick}
// //                         style={{ cursor: 'pointer' }}
// //                       >
// //                         View all results for "{searchTerm}"
// //                       </div>
// //                     </>
// //                   ) : searchTerm.trim().length >= 2 ? (
// //                     <div className="search-no-results">
// //                       <p>No products found for "{searchTerm}"</p>
// //                       <div 
// //                         className="search-view-all"
// //                         onClick={handleViewAllClick}
// //                         style={{ cursor: 'pointer' }}
// //                       >
// //                         Search all products
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="search-no-results">
// //                       <p>Type at least 2 characters to search</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             <Link to="/cart" className="shopping-cart-action">
// //               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cart-svg-icon">
// //                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
// //                 <line x1="3" y1="6" x2="21" y2="6"></line>
// //                 <path d="M16 10a4 4 0 0 1-8 0"></path>
// //               </svg>
// //               {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
// //             </Link>
// //           </div>

// //         </div>
// //       </nav>

// //       {showLoginPopup && (
// //         <LoginPopup 
// //           onClose={() => setShowLoginPopup(false)} 
// //           onLoginSuccess={(data) => {
// //             setIsLoggedIn(true);
// //             setUser(data);
// //             setShowLoginPopup(false);
// //             window.location.reload();
// //           }}
// //         />
// //       )}
// //     </>
// //   );
// // };

// // export default Navbar;
// // src/ecommerce/Navbar.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import LoginPopup from "./LoginPopup";
// import "./Navbar.css";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMoreOpen, setIsMoreOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   // Search states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const searchRef = useRef(null);
  
//   const location = useLocation();
//   const navigate = useNavigate();

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_URL}/api/categories`);
//         const data = await response.json();
//         if (data.success) {
//           setCategories(data.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setCategories([
//           "Sports Nutrition",
//           "Health Drinks",
//           "Organic Tea",
//           "Organic Spices",
//           "Superfoods"
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, [API_URL]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("user");
//     if (token && userData) {
//       setIsLoggedIn(true);
//       try {
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         localStorage.clear();
//         setIsLoggedIn(false);
//         setUser(null);
//       }
//     }
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       try {
//         const items = JSON.parse(savedCart);
//         setCartCount(items.reduce((total, item) => total + item.quantity, 0));
//       } catch (error) {
//         console.error("Error parsing cart:", error);
//       }
//     }
//   }, []);

//   // Close search results on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearchResults(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Search products with debounce
//   useEffect(() => {
//     const searchProducts = async () => {
//       if (searchTerm.trim().length < 2) {
//         setSearchResults([]);
//         setShowSearchResults(false);
//         return;
//       }

//       setIsSearching(true);
//       try {
//         const response = await fetch(
//           `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}&limit=5`
//         );
//         const data = await response.json();
        
//         if (data.success) {
//           setSearchResults(data.data || []);
//           setShowSearchResults(true);
//         } else {
//           setSearchResults([]);
//         }
//       } catch (error) {
//         console.error("Search error:", error);
//         setSearchResults([]);
//       } finally {
//         setIsSearching(false);
//       }
//     };

//     const debounceTimer = setTimeout(searchProducts, 300);
//     return () => clearTimeout(debounceTimer);
//   }, [searchTerm, API_URL]);

//   const isActive = (path) => (location.pathname === path ? 'active' : '');

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);
//     setUser(null);
//     navigate("/");
//     window.location.reload();
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
//       setShowSearchResults(false);
//       setSearchTerm("");
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleResultClick = (product) => {
//     setShowSearchResults(false);
//     setSearchTerm("");
//     navigate(`/products?search=${encodeURIComponent(product.name)}`);
//   };

//   const handleViewAllClick = () => {
//     setShowSearchResults(false);
//     const searchQuery = searchTerm.trim();
//     setSearchTerm("");
//     navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//   };

//   const formatPrice = (price) => {
//     return `₹${parseFloat(price).toLocaleString('en-IN')}`;
//   };

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath;
//     }
//     if (imagePath.startsWith('/uploads')) {
//       return `${API_URL}${imagePath}`;
//     }
//     return `${API_URL}/uploads/images/${imagePath}`;
//   };

//   return (
//     <>
//       <nav className="main-navbar">
//         <div className="nav-container">
          
//           {/* Left Area: Mobile Menu Toggle & Brand Identity */}
//           <div className="nav-left-group">
//             <button 
//               className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               aria-label="Toggle navigation"
//             >
//               <span></span>
//               <span></span>
//               <span></span>
//             </button>
            
//             <Link to="/" className="brand-identity">
//               <img src="/logo.jpeg" alt="Assure Organic Zone Logo" className="brand-logo" />
//               <span className="brand-name">MaisFood</span>
//             </Link>
//           </div>

//           {/* Center Area: Desktop Menu Links */}
//           <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
//             <ul className="nav-menu-list">
//               <li><Link to="/" className={`menu-link ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>HOME</Link></li>
              
//               <li 
//                 className="menu-link dropdown"
//                 onMouseEnter={() => setIsDropdownOpen(true)}
//                 onMouseLeave={() => setIsDropdownOpen(false)}
//               >
//                 <span className="dropdown-trigger">CATEGORIES <span className="arrow-down">▼</span></span>
//                 {isDropdownOpen && (
//                   <ul className="dropdown-menu-list">
//                     {loading ? (
//                       <li className="dropdown-info">Loading...</li>
//                     ) : categories.length > 0 ? (
//                       categories.map((cat, idx) => (
//                         <li key={idx}>
//                           <Link to={`/categories/${encodeURIComponent(cat)}`} onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}>
//                             {cat}
//                           </Link>
//                         </li>
//                       ))
//                     ) : (
//                       <li className="dropdown-info">No categories available</li>
//                     )}
//                   </ul>
//                 )}
//               </li>

//               <li><Link to="/products" className={`menu-link ${isActive('/products')}`} onClick={() => setIsMobileMenuOpen(false)}>PRODUCTS</Link></li>
//               <li><Link to="/about" className={`menu-link ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</Link></li>
//               <li><Link to="/gallery" className={`menu-link ${isActive('/gallery')}`} onClick={() => setIsMobileMenuOpen(false)}>GALLERY</Link></li>
              
//               <li 
//                 className="menu-link dropdown"
//                 onMouseEnter={() => setIsMoreOpen(true)}
//                 onMouseLeave={() => setIsMoreOpen(false)}
//               >
//                 <span className="dropdown-trigger">MORE <span className="arrow-down">▼</span></span>
//                 {isMoreOpen && (
//                   <ul className="dropdown-menu-list">
//                     <li className="dropdown-centered-item">
//                       <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="dropdown-centered-link">
//                         📞 Contact
//                       </Link>
//                     </li>
                    
//                     {/* Show Profile only when logged in */}
//                     {isLoggedIn && (
//                       <li className="dropdown-centered-item">
//                         <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="dropdown-centered-link">
//                           👤 Profile ({user?.name?.split(' ')[0] || 'User'})
//                         </Link>
//                       </li>
//                     )}
                    
//                     <li className="dropdown-divider-item">
//                       <hr className="dropdown-divider" />
//                     </li>
                    
//                     {/* Show Login/Signup or Logout based on auth state */}
//                     {isLoggedIn ? (
//                       <li className="dropdown-centered-item">
//                         <button onClick={handleLogout} className="dropdown-centered-logout-btn">
//                           🚪 Logout
//                         </button>
//                       </li>
//                     ) : (
//                       <>
//                         <li className="dropdown-centered-item">
//                           <button 
//                             onClick={() => {
//                               setShowLoginPopup(true);
//                               setIsMoreOpen(false);
//                               setIsMobileMenuOpen(false);
//                             }} 
//                             className="dropdown-centered-login-btn"
//                           >
//                             🔑 Login
//                           </button>
//                         </li>
//                         <li className="dropdown-centered-item">
//                           <Link to="/login" className="dropdown-centered-link">
//                             📝 Sign Up
//                           </Link>
//                         </li>
//                       </>
//                     )}
//                   </ul>
//                 )}
//               </li>
//             </ul>
//           </div>

//           {/* Right Area: Search, Login/Signup & Cart */}
//           <div className="nav-actions-right">
//             <div className="search-container" ref={searchRef}>
//               <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
//                 <input 
//                   type="text" 
//                   placeholder="Search" 
//                   className="search-field"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   onFocus={() => searchTerm.trim().length >= 2 && setShowSearchResults(true)}
//                 />
//                 <button type="submit" className="search-submit-btn" aria-label="Search">
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-svg">
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                   </svg>
//                 </button>
//               </form>

//               {/* Search Results Dropdown */}
//               {showSearchResults && (
//                 <div className="search-results-dropdown">
//                   {isSearching ? (
//                     <div className="search-loading">Searching...</div>
//                   ) : searchResults.length > 0 ? (
//                     <>
//                       {searchResults.map((product) => (
//                         <div 
//                           key={product._id}
//                           className="search-result-item"
//                           onClick={() => handleResultClick(product)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           <img 
//                             src={getImageUrl(product.image)} 
//                             alt={product.name}
//                             className="search-result-image"
//                             onError={(e) => {
//                               e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="25" font-family="Arial" font-size="10" fill="%23999"%3ENo%3C/text%3E%3C/svg%3E';
//                             }}
//                           />
//                           <div className="search-result-info">
//                             <div className="search-result-name">{product.name}</div>
//                             <div className="search-result-price">{formatPrice(product.price)}</div>
//                             {product.category && (
//                               <div className="search-result-category">{product.category}</div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                       <div 
//                         className="search-view-all"
//                         onClick={handleViewAllClick}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         View all results for "{searchTerm}"
//                       </div>
//                     </>
//                   ) : searchTerm.trim().length >= 2 ? (
//                     <div className="search-no-results">
//                       <p>No products found for "{searchTerm}"</p>
//                       <div 
//                         className="search-view-all"
//                         onClick={handleViewAllClick}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         Search all products
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="search-no-results">
//                       <p>Type at least 2 characters to search</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Login/Signup buttons for desktop */}
//             {!isLoggedIn && (
//               <div className="auth-buttons">
//                 <button 
//                   className="auth-btn login-btn"
//                   onClick={() => setShowLoginPopup(true)}
//                 >
//                   Login
//                 </button>
//                 <Link to="/login" className="auth-btn signup-btn">
//                   Sign Up
//                 </Link>
//               </div>
//             )}

//             {/* Cart */}
//             <Link to="/cart" className="shopping-cart-action">
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cart-svg-icon">
//                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//                 <line x1="3" y1="6" x2="21" y2="6"></line>
//                 <path d="M16 10a4 4 0 0 1-8 0"></path>
//               </svg>
//               {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
//             </Link>
//           </div>

//         </div>
//       </nav>

//       {/* Login Popup */}
//       {showLoginPopup && (
//         <LoginPopup 
//           onClose={() => setShowLoginPopup(false)} 
//           onLoginSuccess={(data) => {
//             setIsLoggedIn(true);
//             setUser(data);
//             setShowLoginPopup(false);
//             window.location.reload();
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;
// src/ecommerce/Navbar.jsx


import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import "./Navbar.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          "Sports Nutrition",
          "Health Drinks",
          "Organic Tea",
          "Organic Spices",
          "Superfoods"
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
      }
    }
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error("Error parsing cart:", error);
      }
    }
  }, []);

  // Close search results on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search products with debounce
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}&limit=5`
        );
        const data = await response.json();
        
        if (data.success) {
          setSearchResults(data.data || []);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, API_URL]);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchResults(false);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (product) => {
    setShowSearchResults(false);
    setSearchTerm("");
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
  };

  const handleViewAllClick = () => {
    setShowSearchResults(false);
    const searchQuery = searchTerm.trim();
    setSearchTerm("");
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads')) {
      return `${API_URL}${imagePath}`;
    }
    return `${API_URL}/uploads/images/${imagePath}`;
  };

  return (
    <>
      <nav className="main-navbar">
        <div className="nav-container">
          
          {/* Left Area: Mobile Menu Toggle & Brand Identity */}
          <div className="nav-left-group">
            <button 
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            <Link to="/" className="brand-identity">
              <img src="/logo.jpeg" alt="Assure Organic Zone Logo" className="brand-logo" />
              <span className="brand-name">MaisFood</span>
            </Link>
          </div>

          {/* Center Area: Desktop Menu Links */}
          <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            <ul className="nav-menu-list">
              <li><Link to="/" className={`menu-link ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>HOME</Link></li>
              
              <li 
                className="menu-link dropdown"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <span className="dropdown-trigger">CATEGORIES <span className="arrow-down">▼</span></span>
                {isDropdownOpen && (
                  <ul className="dropdown-menu-list">
                    {loading ? (
                      <li className="dropdown-info">Loading...</li>
                    ) : categories.length > 0 ? (
                      categories.map((cat, idx) => (
                        <li key={idx}>
                          <Link to={`/categories/${encodeURIComponent(cat)}`} onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}>
                            {cat}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="dropdown-info">No categories available</li>
                    )}
                  </ul>
                )}
              </li>

              <li><Link to="/products" className={`menu-link ${isActive('/products')}`} onClick={() => setIsMobileMenuOpen(false)}>PRODUCTS</Link></li>
              <li><Link to="/about" className={`menu-link ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</Link></li>
              <li><Link to="/gallery" className={`menu-link ${isActive('/gallery')}`} onClick={() => setIsMobileMenuOpen(false)}>GALLERY</Link></li>
              
              <li 
                className="menu-link dropdown"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <span className="dropdown-trigger">MORE <span className="arrow-down">▼</span></span>
                {isMoreOpen && (
                  <ul className="dropdown-menu-list">
                    <li className="dropdown-centered-item">
                      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="dropdown-centered-link">
                        📞 Contact
                      </Link>
                    </li>
                    
                    {/* Show Profile only when logged in */}
                    {isLoggedIn && (
                      <li className="dropdown-centered-item">
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="dropdown-centered-link">
                          👤 Profile ({user?.name?.split(' ')[0] || 'User'})
                        </Link>
                      </li>
                    )}
                    
                    <li className="dropdown-divider-item">
                      <hr className="dropdown-divider" />
                    </li>
                    
                    {/* Show Login/Signup or Logout based on auth state */}
                    {isLoggedIn ? (
                      <li className="dropdown-centered-item">
                        <button onClick={handleLogout} className="dropdown-centered-logout-btn">
                          🚪 Logout
                        </button>
                      </li>
                    ) : (
                      <>
                        <li className="dropdown-centered-item">
                          <button 
                            onClick={() => {
                              setShowLoginPopup(true);
                              setIsMoreOpen(false);
                              setIsMobileMenuOpen(false);
                            }} 
                            className="dropdown-centered-login-btn"
                          >
                            🔑 Login
                          </button>
                        </li>
                       
                      </>
                    )}
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Right Area: Search, Login/Signup & Cart */}
          <div className="nav-actions-right">
            <div className="search-container" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="search-field"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm.trim().length >= 2 && setShowSearchResults(true)}
                />
                <button type="submit" className="search-submit-btn" aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-svg">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="search-results-dropdown">
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <div 
                          key={product._id}
                          className="search-result-item"
                          onClick={() => handleResultClick(product)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name}
                            className="search-result-image"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="25" font-family="Arial" font-size="10" fill="%23999"%3ENo%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="search-result-info">
                            <div className="search-result-name">{product.name}</div>
                            <div className="search-result-price">{formatPrice(product.price)}</div>
                            {product.category && (
                              <div className="search-result-category">{product.category}</div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div 
                        className="search-view-all"
                        onClick={handleViewAllClick}
                        style={{ cursor: 'pointer' }}
                      >
                        View all results for "{searchTerm}"
                      </div>
                    </>
                  ) : searchTerm.trim().length >= 2 ? (
                    <div className="search-no-results">
                      <p>No products found for "{searchTerm}"</p>
                      <div 
                        className="search-view-all"
                        onClick={handleViewAllClick}
                        style={{ cursor: 'pointer' }}
                      >
                        Search all products
                      </div>
                    </div>
                  ) : (
                    <div className="search-no-results">
                      <p>Type at least 2 characters to search</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Login/Signup buttons for desktop - Only show when not logged in */}
            {!isLoggedIn && (
              <div className="auth-buttons">
                <button 
                  className="auth-btn login-btn"
                  onClick={() => setShowLoginPopup(true)}
                >
                  Login
                </button>
               
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="shopping-cart-action">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cart-svg-icon">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </Link>
          </div>

        </div>
      </nav>

      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)} 
          onLoginSuccess={(data) => {
            setIsLoggedIn(true);
            setUser(data);
            setShowLoginPopup(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export default Navbar;