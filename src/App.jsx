// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './ecommerce/Navbar';
import ImageSlider from './ecommerce/ImageSlider';
import ProductSection from './ecommerce/ProductSection';
import OrganicProducts from './ecommerce/OrganicProducts';
import Products from './ecommerce/Products';
import Cart from './ecommerce/Cart';
import Checkout from './ecommerce/Checkout';
import Products1 from './ecommerce/Products1';
import AboutUs from './ecommerce/AboutUs';
import MyOrders from './ecommerce/MyOrders';
import About1 from './ecommerce/About1';
import AdminOrders from './admin/AdminOrders';
import GalleryVideos from './ecommerce/GalleryVideos';
import Testimonials from './ecommerce/Testimonials';
import ContactUs from './ecommerce/ContactUs';
import Footer from './ecommerce/Footer';
import CategoryProducts from './ecommerce/CategoryProducts';
import AdminTestimonials from './admin/AdminTestimonials';
import LoginRegister from './admin/LoginRegister';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import './App.css';
import AdminBanners from './admin/AdminBanners';
import AdminGallery from "./admin/AdminGallery";
import AdminAbout from './admin/AdminAbout';
import AdminContact from './admin/AdminContact';
import AdminCategories from './admin/AdminCategories';
import Profile from './ecommerce/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Login/Register Page - No Navbar or Footer */}
            <Route path="/login" element={<LoginRegister />} />
            
            {/* Admin Pages - With Sidebar Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
             
              <Route path="about" element={<AdminAbout />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="settings" element={<div>Settings Page</div>} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>
            
            {/* Home Page */}
            <Route path="/" element={
              <>
                <Navbar />
                <ImageSlider />
                <ProductSection />
                <OrganicProducts />
                <Products />
                <AboutUs />
                <GalleryVideos />
                <Testimonials />
                <ContactUs />
                <Footer />
              </>
            } />
            
            {/* Products Page */}
            <Route path="/products" element={
              <>
                <Navbar />
                <Products1 />
                <Footer />
              </>
            } />
            
            {/* Categories Page */}
            <Route path="/categories/:category" element={
              <>
                <Navbar />
                <CategoryProducts />
                <Footer />
              </>
            } />
            
            {/* About Page */}
            <Route path="/about" element={
              <>
                <Navbar />
                <About1 />
                <Footer />
              </>
            } />
            
            {/* Gallery Page */}
            <Route path="/gallery" element={
              <>
                <Navbar />
                <GalleryVideos />
                <Footer />
              </>
            } />
            
            {/* Contact Page */}
            <Route path="/contact" element={
              <>
                <Navbar />
                <ContactUs />
                <Footer />
              </>
            } />
            <Route path="/cart" element={
  <>
    <Navbar />
    <Cart />
    <Footer />
  </>
} />
<Route path="/orders" element={
  <>
    <Navbar />
    <MyOrders />
    <Footer />
  </>
} />
<Route path="/checkout" element={
  <>
    <Navbar />
    <Checkout />
    <Footer />
  </>
} />
            {/* Profile Page */}
            <Route path="/profile" element={
              <>
                <Navbar />
                <Profile />
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;