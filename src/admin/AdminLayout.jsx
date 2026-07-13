// // src/admin/AdminLayout.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
// import "./AdminLayout.css";

// const AdminLayout = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userData = localStorage.getItem("user");
    
//     console.log("🔐 AdminLayout - Token:", token ? "Exists" : "Missing");
//     console.log("👤 AdminLayout - User Data:", userData);
    
//     if (!token || !userData) {
//       console.log("❌ No token or user data, redirecting to login");
//       navigate("/login");
//       return;
//     }

//     try {
//       const parsedUser = JSON.parse(userData);
//       console.log("👤 Parsed user:", parsedUser);
      
//       // Check if user is admin
//       if (parsedUser.role !== "admin") {
//         console.log("❌ User is not admin, redirecting to login");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         navigate("/login");
//         return;
//       }
      
//       setUser(parsedUser);
//     } catch (error) {
//       console.error("❌ Error parsing user data:", error);
//       navigate("/login");
//       return;
//     }
    
//     setLoading(false);
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Get current page title from path
//   const getPageTitle = () => {
//     const path = location.pathname;
//     if (path.includes("/admin/dashboard")) return "Dashboard";
//     if (path.includes("/admin/products")) return "Products";
//     if (path.includes("/admin/orders")) return "Orders";
//     if (path.includes("/admin/users")) return "Users";
//     if (path.includes("/admin/categories")) return "Categories";
//     if (path.includes("/admin/testimonials")) return "Testimonials";
//     if (path.includes("/admin/banners")) return "Banners";
//     if (path.includes("/admin/settings")) return "Settings";
//     return "Admin Panel";
//   };

//   if (loading) {
//     return (
//       <div className="admin-loading">
//         <div className="loader"></div>
//         <p>Loading Dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-layout">
//       {/* Sidebar */}
//       <div className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
//         <div className="admin-logo">
//           <h2>{isSidebarOpen ? 'Admin Panel' : 'AP'}</h2>
//         </div>
//         <nav className="admin-nav">
//           <ul>
//             <li className={location.pathname === "/admin/dashboard" ? "active" : ""}>
//               <Link to="/admin/dashboard">
//                 <span className="nav-icon">📊</span>
//                 {isSidebarOpen && <span className="nav-text">Dashboard</span>}
//               </Link>
//             </li>
//             <li className={location.pathname === "/admin/products" ? "active" : ""}>
//               <Link to="/admin/products">
//                 <span className="nav-icon">📦</span>
//                 {isSidebarOpen && <span className="nav-text">Products</span>}
//               </Link>
//             </li>
//             <li className={location.pathname === "/admin/orders" ? "active" : ""}>
//               <Link to="/admin/orders">
//                 <span className="nav-icon">🛒</span>
//                 {isSidebarOpen && <span className="nav-text">Orders</span>}
//               </Link>
//             </li>
//             <li className={location.pathname === "/admin/users" ? "active" : ""}>
//               <Link to="/admin/users">
//                 <span className="nav-icon">👤</span>
//                 {isSidebarOpen && <span className="nav-text">Users</span>}
//               </Link>
//             </li>
//             <li className={location.pathname === "/admin/banners" ? "active" : ""}>
//               <Link to="/admin/banners">
//                 <span className="nav-icon">🖼️</span>
//                 {isSidebarOpen && <span className="nav-text">Banners</span>}
//               </Link>
//             </li>
           
// <li className={location.pathname === "/admin/about" ? "active" : ""}>
//   <Link to="/admin/about">
//     <span className="nav-icon">ℹ️</span>
//     {isSidebarOpen && <span className="nav-text">About</span>}
//   </Link>
// </li>

// <li className={location.pathname === "/admin/gallery" ? "active" : ""}>
//   <Link to="/admin/gallery">
//     <span className="nav-icon">🖼️</span>
//     {isSidebarOpen && <span className="nav-text">Gallery</span>}
//   </Link>
// </li>

// <li className={location.pathname === "/admin/testimonials" ? "active" : ""}>
//   <Link to="/admin/testimonials">
//     <span className="nav-icon">💬</span>
//     {isSidebarOpen && <span className="nav-text">Testimonials</span>}
//   </Link>
// </li>
//             <li className={location.pathname === "/admin/categories" ? "active" : ""}>
//               <Link to="/admin/categories">
//                 <span className="nav-icon">📝</span>
//                 {isSidebarOpen && <span className="nav-text">Categories</span>}
//               </Link>
//             </li>
            
           
//             <li className={location.pathname === "/admin/contact" ? "active" : ""}>
//   <Link to="/admin/contact">
//     <span className="nav-icon">📞</span>
//     {isSidebarOpen && <span className="nav-text">Contact</span>}
//   </Link>
// </li>
//             <li onClick={handleLogout} className="logout-item">
//               <span className="nav-icon">🚪</span>
//               {isSidebarOpen && <span className="nav-text">Logout</span>}
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className={`admin-main ${!isSidebarOpen ? 'expanded' : ''}`}>
//         {/* Top Header */}
//         <div className="admin-top-header">
//           <div className="header-left">
//             <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
//               {isSidebarOpen ? '◀' : '▶'}
//             </button>
//             <h1>{getPageTitle()}</h1>
//           </div>
//           <div className="header-right">
//             <span className="admin-user-name">👋 Welcome, {user?.name || "Admin"}!</span>
//             <button className="admin-logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Page Content */}
//         <div className="admin-page-content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

// src/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    console.log("🔐 AdminLayout - Token:", token ? "Exists" : "Missing");
    console.log("👤 AdminLayout - User Data:", userData);
    
    if (!token || !userData) {
      console.log("❌ No token or user data, redirecting to login");
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log("👤 Parsed user:", parsedUser);
      
      // Check if user is admin
      if (parsedUser.role !== "admin") {
        console.log("❌ User is not admin, redirecting to login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      
      setUser(parsedUser);
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      navigate("/login");
      return;
    }
    
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/products")) return "Products";
    if (path.includes("/admin/orders")) return "Orders";
    if (path.includes("/admin/users")) return "Users";
    if (path.includes("/admin/categories")) return "Categories";
    if (path.includes("/admin/testimonials")) return "Testimonials";
    if (path.includes("/admin/banners")) return "Banners";
    if (path.includes("/admin/about")) return "About";
    if (path.includes("/admin/gallery")) return "Gallery";
    if (path.includes("/admin/contact")) return "Contact";
    if (path.includes("/admin/settings")) return "Settings";
    if (path.includes("/admin/customer-contacts")) return "Customer Messages"; // ✅ Added this
    return "Admin Panel";
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="admin-logo">
          <h2>{isSidebarOpen ? 'Admin Panel' : 'AP'}</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li className={location.pathname === "/admin/dashboard" ? "active" : ""}>
              <Link to="/admin/dashboard">
                <span className="nav-icon">📊</span>
                {isSidebarOpen && <span className="nav-text">Dashboard</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/products" ? "active" : ""}>
              <Link to="/admin/products">
                <span className="nav-icon">📦</span>
                {isSidebarOpen && <span className="nav-text">Products</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/orders" ? "active" : ""}>
              <Link to="/admin/orders">
                <span className="nav-icon">🛒</span>
                {isSidebarOpen && <span className="nav-text">Orders</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/users" ? "active" : ""}>
              <Link to="/admin/users">
                <span className="nav-icon">👤</span>
                {isSidebarOpen && <span className="nav-text">Users</span>}
              </Link>
            </li>
            <li className={location.pathname === "/admin/banners" ? "active" : ""}>
              <Link to="/admin/banners">
                <span className="nav-icon">🖼️</span>
                {isSidebarOpen && <span className="nav-text">Banners</span>}
              </Link>
            </li>
           
            <li className={location.pathname === "/admin/about" ? "active" : ""}>
              <Link to="/admin/about">
                <span className="nav-icon">ℹ️</span>
                {isSidebarOpen && <span className="nav-text">About</span>}
              </Link>
            </li>

            <li className={location.pathname === "/admin/gallery" ? "active" : ""}>
              <Link to="/admin/gallery">
                <span className="nav-icon">🖼️</span>
                {isSidebarOpen && <span className="nav-text">Gallery</span>}
              </Link>
            </li>

            <li className={location.pathname === "/admin/testimonials" ? "active" : ""}>
              <Link to="/admin/testimonials">
                <span className="nav-icon">💬</span>
                {isSidebarOpen && <span className="nav-text">Testimonials</span>}
              </Link>
            </li>
            
            <li className={location.pathname === "/admin/categories" ? "active" : ""}>
              <Link to="/admin/categories">
                <span className="nav-icon">📝</span>
                {isSidebarOpen && <span className="nav-text">Categories</span>}
              </Link>
            </li>
            
            {/* ✅ NEW: Customer Messages Menu Item */}
            <li className={location.pathname === "/admin/customer-contacts" ? "active" : ""}>
              <Link to="/admin/customer-contacts">
                <span className="nav-icon">✉️</span>
                {isSidebarOpen && <span className="nav-text">Messages</span>}
              </Link>
            </li>
            
            <li className={location.pathname === "/admin/contact" ? "active" : ""}>
              <Link to="/admin/contact">
                <span className="nav-icon">📞</span>
                {isSidebarOpen && <span className="nav-text">Contact</span>}
              </Link>
            </li>
            
            <li className={location.pathname === "/admin/settings" ? "active" : ""}>
              <Link to="/admin/settings">
                <span className="nav-icon">⚙️</span>
                {isSidebarOpen && <span className="nav-text">Settings</span>}
              </Link>
            </li>
            
            <li onClick={handleLogout} className="logout-item">
              <span className="nav-icon">🚪</span>
              {isSidebarOpen && <span className="nav-text">Logout</span>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${!isSidebarOpen ? 'expanded' : ''}`}>
        {/* Top Header */}
        <div className="admin-top-header">
          <div className="header-left">
            <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
              {isSidebarOpen ? '◀' : '▶'}
            </button>
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <span className="admin-user-name">👋 Welcome, {user?.name || "Admin"}!</span>
            <button className="admin-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;