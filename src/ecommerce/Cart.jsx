// src/ecommerce/Cart.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in";

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          setCartItems(items);
        } catch (error) {
          console.error("Error loading cart:", error);
          setCartItems([]);
        }
      }
      setLoading(false);
    };
    loadCart();
  }, []);

  // Update cart in localStorage
  const updateCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedItems);
  };

  // Remove item from cart
  const removeItem = (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      const updatedItems = cartItems.filter(item => item._id !== productId);
      updateCart(updatedItems);
    }
  };

  // Clear cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      updateCart([]);
    }
  };

  // Calculate totals (shipping is always 0)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal; // No shipping, no discount

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

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        discountAmount: 0,
        total
      }
    });
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-loading">Loading your cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              <div className="cart-header">
                <span className="cart-header-product">Product</span>
                <span className="cart-header-price">Price</span>
                <span className="cart-header-quantity">Quantity</span>
                <span className="cart-header-total">Total</span>
                <span className="cart-header-action">Action</span>
              </div>

              {cartItems.map((item) => {
                const itemPrice = item.discount 
                  ? item.price * (1 - item.discount / 100) 
                  : item.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-product">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="cart-item-image"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f5f5f5"/%3E%3Ctext x="10" y="45" font-family="Arial" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        {item.discount > 0 && (
                          <span className="cart-item-discount">{item.discount}% OFF</span>
                        )}
                      </div>
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(itemPrice)}
                      {item.discount > 0 && (
                        <span className="cart-item-original-price">{formatPrice(item.price)}</span>
                      )}
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-total">{formatPrice(itemTotal)}</div>
                    <div className="cart-item-action">
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item._id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <Link to="/products" className="continue-shopping-link">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;