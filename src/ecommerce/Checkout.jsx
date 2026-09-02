// // src/ecommerce/Checkout.jsx
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import "./Checkout.css";

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderId, setOrderId] = useState("");
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "India",
//     paymentMethod: "cod"
//   });

//   // Get cart data from location state
//   const cartData = location.state || {};
//   const { cartItems = [], subtotal = 0, discountAmount = 0, total = 0 } = cartData;

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // Load user data from localStorage
//   useEffect(() => {
//     const loadUserData = () => {
//       try {
//         const token = localStorage.getItem("token");
//         const userData = localStorage.getItem("user");
        
//         if (token && userData) {
//           const parsedUser = JSON.parse(userData);
//           setUser(parsedUser);
//           setIsLoggedIn(true);
          
//           // Auto-fill form with user data
//           const nameParts = parsedUser.name ? parsedUser.name.split(' ') : ['', ''];
//           setFormData(prev => ({
//             ...prev,
//             firstName: nameParts[0] || "",
//             lastName: nameParts.slice(1).join(' ') || "",
//             email: parsedUser.email || "",
//             phone: parsedUser.phone || "",
//             address: parsedUser.address?.street || "",
//             city: parsedUser.address?.city || "",
//             state: parsedUser.address?.state || "",
//             pincode: parsedUser.address?.pincode || "",
//             country: parsedUser.address?.country || "India"
//           }));
//         }
//       } catch (error) {
//         console.error("Error loading user data:", error);
//       }
//     };

//     loadUserData();
//   }, []);

//   useEffect(() => {
//     // If no cart items, redirect to cart
//     if (cartItems.length === 0 && !orderPlaced) {
//       navigate("/cart");
//     }
//   }, [cartItems, navigate, orderPlaced]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const formatPrice = (price) => {
//     return `₹${parseFloat(price).toLocaleString('en-IN')}`;
//   };

//   // In Checkout.jsx, update the handleSubmit function:

// // In Checkout.jsx - Update handleSubmit function

// // src/ecommerce/Checkout.jsx - Updated handleSubmit

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     // Validate form
//     if (!formData.firstName || !formData.lastName || !formData.email || 
//         !formData.phone || !formData.address || !formData.city || 
//         !formData.state || !formData.pincode) {
//       alert("Please fill all required fields");
//       setLoading(false);
//       return;
//     }

//     // Get user info from localStorage
//     const token = localStorage.getItem("token");
//     const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
//     console.log("👤 User Data:", userData);
//     console.log("🔑 Token:", token ? token.substring(0, 20) + "..." : "Missing");

//     // IMPORTANT: Check if user is logged in
//     if (!token) {
//       alert("Please login to place an order");
//       setLoading(false);
//       return;
//     }

//     // Prepare order data
//     const orderData = {
//       items: cartItems.map(item => ({
//         _id: item._id,
//         name: item.name,
//         price: parseFloat(item.price),
//         quantity: parseInt(item.quantity),
//         image: item.image || '',
//         discount: parseFloat(item.discount) || 0
//       })),
//       customer: {
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim(),
//         address: {
//           street: formData.address.trim(),
//           city: formData.city.trim(),
//           state: formData.state.trim(),
//           pincode: formData.pincode.trim(),
//           country: formData.country || 'India'
//         }
//       },
//       payment: {
//         method: "cod",
//         status: "pending"
//       },
//       totals: {
//         subtotal: parseFloat(subtotal),
//         discount: parseFloat(discountAmount) || 0,
//         shipping: 0,
//         total: parseFloat(total)
//       },
//       notes: ""
//     };

//     console.log("📦 Sending order:", orderData);

//     // ALWAYS send Authorization header with token
//     const response = await fetch(`${API_URL}/api/orders`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`  // ✅ Always include token
//       },
//       body: JSON.stringify(orderData)
//     });

//     const data = await response.json();
//     console.log("📦 Order response:", data);

//     if (data.success) {
//       setOrderId(data.orderId);
//       setOrderPlaced(true);
//       // Clear cart
//       localStorage.removeItem("cart");
//       // Update cart count in navbar
//       window.dispatchEvent(new Event('cartUpdated'));
//     } else {
//       alert(data.message || "Failed to place order. Please try again.");
//     }
//   } catch (error) {
//     console.error("Order error:", error);
//     alert("Failed to place order. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

//   if (orderPlaced) {
//     return (
//       <div className="checkout-page">
//         <div className="checkout-container">
//           <div className="order-success">
//             <div className="success-icon">✅</div>
//             <h1>Order Placed Successfully!</h1>
//             <p className="order-id">Order ID: #{orderId}</p>
//             <p className="order-message">
//               Thank you for your order! We will send you a confirmation email shortly.
//             </p>
//             <div className="order-summary-box">
//               <p>Order Total: <strong>{formatPrice(total)}</strong></p>
//               <p>Payment Method: <strong>Cash on Delivery</strong></p>
//               <p>Shipping to: <strong>{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</strong></p>
//             </div>
//             <div className="success-actions">
//               <Link to="/" className="continue-btn">Continue Shopping</Link>
//               <Link to="/orders" className="view-orders-btn">View Orders</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container">
//         <h1 className="checkout-title">Checkout</h1>
        
//         <div className="checkout-content">
//           {/* Left: Billing Form */}
//           <div className="checkout-form-section">
//             <form onSubmit={handleSubmit} className="checkout-form">
//               <h2 className="form-section-title">Billing Details</h2>
              
//               {!isLoggedIn && (
//                 <div className="login-notice">
//                   <p>📝 <Link to="/LoginPopup">Login</Link> to auto-fill your details</p>
//                 </div>
//               )}
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>First Name *</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     required
//                     placeholder="John"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Last Name *</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     required
//                     placeholder="Doe"
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="you@example.com"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Phone *</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     placeholder="9876543210"
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>Address *</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   required
//                   placeholder="123 Main Street, Apartment 4B"
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>City *</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     required
//                     placeholder="Mumbai"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>State *</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     required
//                     placeholder="Maharashtra"
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Pincode *</label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleChange}
//                     required
//                     placeholder="400001"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Country</label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={formData.country}
//                     onChange={handleChange}
//                     readOnly
//                   />
//                 </div>
//               </div>

//               {/* Payment Method - Only Cash on Delivery */}
//               <div className="form-group">
//                 <label>Payment Method</label>
//                 <div className="payment-method-display">
//                   <div className="payment-method-box cod">
//                     <span className="payment-icon">💵</span>
//                     <div className="payment-method-info">
//                       <span className="payment-method-name">Cash on Delivery</span>
//                       <span className="payment-method-desc">Pay when you receive your order</span>
//                     </div>
//                     <span className="payment-badge">Available</span>
//                   </div>
//                 </div>
//                 <input type="hidden" name="paymentMethod" value="cod" />
//               </div>

//               <button 
//                 type="submit" 
//                 className="place-order-btn"
//                 disabled={loading}
//               >
//                 {loading ? "Placing Order..." : "Place Order - Cash on Delivery"}
//               </button>
//             </form>
//           </div>

//           {/* Right: Order Summary */}
//           <div className="checkout-summary-section">
//             <div className="order-summary-card">
//               <h2 className="summary-title">Your Order</h2>
              
//               <div className="order-items">
//                 {cartItems.map((item) => {
//                   const price = item.discount 
//                     ? item.price * (1 - item.discount / 100) 
//                     : item.price;
                  
//                   return (
//                     <div key={item._id} className="order-item">
//                       <img 
//                         src={item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`}
//                         alt={item.name} 
//                         className="order-item-image"
//                         onError={(e) => {
//                           e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="28" font-family="Arial" font-size="10" fill="%23999"%3ENo%20Image%3C/text%3E%3C/svg%3E';
//                         }}
//                       />
//                       <div className="order-item-details">
//                         <div className="order-item-name">{item.name}</div>
//                         <div className="order-item-qty">Qty: {item.quantity}</div>
//                       </div>
//                       <div className="order-item-price">{formatPrice(price * item.quantity)}</div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="order-totals">
//                 <div className="summary-row">
//                   <span>Subtotal</span>
//                   <span>{formatPrice(subtotal)}</span>
//                 </div>
//                 {discountAmount > 0 && (
//                   <div className="summary-row discount">
//                     <span>Discount</span>
//                     <span>-{formatPrice(discountAmount)}</span>
//                   </div>
//                 )}
//                 <div className="summary-row total">
//                   <span>Total</span>
//                   <span>{formatPrice(subtotal - discountAmount)}</span>
//                 </div>
//               </div>

//               <Link to="/cart" className="back-to-cart-link">
//                 ← Back to Cart
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
// src/ecommerce/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LoginPopup from "./LoginPopup"; // ✅ Import LoginPopup
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // ✅ Add state for popup

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    paymentMethod: "cod"
  });

  // Get cart data from location state
  const cartData = location.state || {};
  const { cartItems = [], subtotal = 0, discountAmount = 0, total = 0 } = cartData;

  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in";

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
          
          // Auto-fill form with user data
          const nameParts = parsedUser.name ? parsedUser.name.split(' ') : ['', ''];
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(' ') || "",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            address: parsedUser.address?.street || "",
            city: parsedUser.address?.city || "",
            state: parsedUser.address?.state || "",
            pincode: parsedUser.address?.pincode || "",
            country: parsedUser.address?.country || "India"
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    // If no cart items, redirect to cart
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  // ✅ Handle login success - close popup and reload user data
  const handleLoginSuccess = (userData) => {
    console.log("✅ Login successful in Checkout:", userData);
    setShowLoginPopup(false);
    
    // Reload user data
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      
      // Auto-fill form with user data
      const nameParts = parsedUser.name ? parsedUser.name.split(' ') : ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address?.street || "",
        city: parsedUser.address?.city || "",
        state: parsedUser.address?.state || "",
        pincode: parsedUser.address?.pincode || "",
        country: parsedUser.address?.country || "India"
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.pincode) {
        alert("Please fill all required fields");
        setLoading(false);
        return;
      }

      // Get user info from localStorage
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      
      console.log("👤 User Data:", userData);
      console.log("🔑 Token:", token ? token.substring(0, 20) + "..." : "Missing");

      // IMPORTANT: Check if user is logged in
      if (!token) {
        alert("Please login to place an order");
        setShowLoginPopup(true); // ✅ Show login popup
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image: item.image || '',
          discount: parseFloat(item.discount) || 0
        })),
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: {
            street: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode.trim(),
            country: formData.country || 'India'
          }
        },
        payment: {
          method: "cod",
          status: "pending"
        },
        totals: {
          subtotal: parseFloat(subtotal),
          discount: parseFloat(discountAmount) || 0,
          shipping: 0,
          total: parseFloat(total)
        },
        notes: ""
      };

      console.log("📦 Sending order:", orderData);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log("📦 Order response:", data);

      if (data.success) {
        setOrderId(data.orderId);
        setOrderPlaced(true);
        // Clear cart
        localStorage.removeItem("cart");
        // Update cart count in navbar
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle login button click
  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">Order ID: #{orderId}</p>
            <p className="order-message">
              Thank you for your order! We will send you a confirmation email shortly.
            </p>
            <div className="order-summary-box">
              <p>Order Total: <strong>{formatPrice(total)}</strong></p>
              <p>Payment Method: <strong>Cash on Delivery</strong></p>
              <p>Shipping to: <strong>{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</strong></p>
            </div>
            <div className="success-actions">
              <Link to="/" className="continue-btn">Continue Shopping</Link>
              <Link to="/orders" className="view-orders-btn">View Orders</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          {/* Left: Billing Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2 className="form-section-title">Billing Details</h2>
              
              {!isLoggedIn ? (
                <div className="login-notice">
                  <p>
                    📝 
                    <button 
                      type="button"
                      className="login-link-btn"
                      onClick={handleLoginClick}
                    >
                      Login
                    </button> 
                    to auto-fill your details
                  </p>
                </div>
              ) : (
                <div className="login-notice logged-in">
                  <p>✅ Logged in as <strong>{user?.email}</strong></p>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="123 Main Street, Apartment 4B"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Mumbai"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="400001"
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Method - Only Cash on Delivery */}
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-method-display">
                  <div className="payment-method-box cod">
                    <span className="payment-icon">💵</span>
                    <div className="payment-method-info">
                      <span className="payment-method-name">Cash on Delivery</span>
                      <span className="payment-method-desc">Pay when you receive your order</span>
                    </div>
                    <span className="payment-badge">Available</span>
                  </div>
                </div>
                <input type="hidden" name="paymentMethod" value="cod" />
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order - Cash on Delivery"}
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="checkout-summary-section">
            <div className="order-summary-card">
              <h2 className="summary-title">Your Order</h2>
              
              <div className="order-items">
                {cartItems.map((item) => {
                  const price = item.discount 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                  
                  return (
                    <div key={item._id} className="order-item">
                      <img 
                        src={item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                        alt={item.name} 
                        className="order-item-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23f5f5f5"/%3E%3Ctext x="5" y="28" font-family="Arial" font-size="10" fill="%23999"%3ENo%20Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="order-item-details">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="order-item-price">{formatPrice(price * item.quantity)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="order-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(subtotal - discountAmount)}</span>
                </div>
              </div>

              <Link to="/cart" className="back-to-cart-link">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Login Popup */}
      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;