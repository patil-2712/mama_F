// // src/ecommerce/Profile.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Profile.css";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [imagePreview, setImagePreview] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//   const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: {
//       street: "",
//       city: "",
//       state: "",
//       pincode: "",
//       country: ""
//     }
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });

//   const getToken = () => {
//     let token = localStorage.getItem("token");
//     if (!token) {
//       token = localStorage.getItem("userToken");
//     }
//     return token;
//   };

//   const getUserData = () => {
//     let userData = localStorage.getItem("user");
//     if (!userData) {
//       userData = localStorage.getItem("userData");
//     }
//     return userData;
//   };

//   useEffect(() => {
//     const token = getToken();
//     const userData = getUserData();
    
//     if (!token || !userData) {
//       navigate("/");
//       return;
//     }
    
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       setError("");
      
//       const token = getToken();
      
//       const response = await fetch(`${API_URL}/auth/me`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("userToken");
//         localStorage.removeItem("userData");
//         navigate("/");
//         return;
//       }

//       const data = await response.json();

//       if (data.success) {
//         setUser(data.data);
//         setFormData({
//           name: data.data.name || "",
//           phone: data.data.phone || "",
//           address: {
//             street: data.data.address?.street || "",
//             city: data.data.address?.city || "",
//             state: data.data.address?.state || "",
//             pincode: data.data.address?.pincode || "",
//             country: data.data.address?.country || ""
//           }
//         });
//         // Handle profile image
//         if (data.data.profileImage && data.data.profileImage !== 'default.jpg') {
//           const imageUrl = data.data.profileImage.startsWith('http') 
//             ? data.data.profileImage 
//             : `${BASE_URL}${data.data.profileImage}`;
//           setImagePreview(imageUrl);
//         } else {
//           setImagePreview("");
//         }
//       } else {
//         if (data.message === "Not authorized") {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           localStorage.removeItem("userToken");
//           localStorage.removeItem("userData");
//           navigate("/");
//         }
//         setError(data.message || "Failed to fetch profile");
//       }
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//       setError("Failed to fetch profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("address.")) {
//       const field = name.split(".")[1];
//       setFormData({
//         ...formData,
//         address: {
//           ...formData.address,
//           [field]: value
//         }
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData({
//       ...passwordData,
//       [name]: value
//     });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size must be less than 5MB");
//         return;
//       }
      
//       // Validate file type
//       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!allowedTypes.includes(file.type)) {
//         setError("Only JPG, PNG, GIF, and WebP images are allowed");
//         return;
//       }
      
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Upload profile image separately
//   const uploadProfileImage = async () => {
//     if (!imageFile) return;

//     setUploadingImage(true);
//     setError("");
//     setSuccess("");

//     try {
//       const token = getToken();
//       const formDataToSend = new FormData();
//       formDataToSend.append('image', imageFile);

//       const response = await fetch(`${API_URL}/profile/upload-image`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formDataToSend
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccess("Profile image updated successfully!");
//         // Update user data with new image
//         if (data.data && data.data.profileImage) {
//           const imageUrl = data.data.profileImage.startsWith('http') 
//             ? data.data.profileImage 
//             : `${BASE_URL}${data.data.profileImage}`;
//           setImagePreview(imageUrl);
          
//           // Update user in localStorage
//           const updatedUser = { ...user, profileImage: data.data.profileImage };
//           localStorage.setItem("user", JSON.stringify(updatedUser));
//           setUser(updatedUser);
//         }
//         setImageFile(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = "";
//         }
//         setTimeout(() => setSuccess(""), 3000);
//       } else {
//         setError(data.message || "Failed to upload image");
//       }
//     } catch (err) {
//       console.error("❌ Upload error:", err);
//       setError("Network error. Please try again.");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       // First upload image if there's a new image
//       if (imageFile) {
//         await uploadProfileImage();
//         // If image upload fails, the function will handle the error
//         // and we'll continue with profile update
//       }

//       const payload = {
//         name: formData.name,
//         phone: formData.phone,
//         address: formData.address
//       };

//       const token = getToken();
//       const response = await fetch(`${API_URL}/auth/updateprofile`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccess("Profile updated successfully!");
//         setUser(data.data);
//         localStorage.setItem("user", JSON.stringify(data.data));
//         setIsEditing(false);
//         // Refresh the page to update navbar
//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);
//       } else {
//         if (data.errors) {
//           setError(data.errors.map(err => err.msg).join(", "));
//         } else {
//           setError(data.message || "Something went wrong");
//         }
//       }
//     } catch (err) {
//       console.error("❌ Update error:", err);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setError("New password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = getToken();
//       const response = await fetch(`${API_URL}/auth/changepassword`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           currentPassword: passwordData.currentPassword,
//           newPassword: passwordData.newPassword
//         })
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccess("Password changed successfully!");
//         setPasswordData({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: ""
//         });
//         setTimeout(() => setSuccess(""), 3000);
//       } else {
//         setError(data.message || "Failed to change password");
//       }
//     } catch (err) {
//       console.error("❌ Password change error:", err);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeImage = () => {
//     setImagePreview("");
//     setImageFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const getInitial = () => {
//     if (user && user.name) {
//       return user.name.charAt(0).toUpperCase();
//     }
//     return "U";
//   };

//   if (loading) {
//     return (
//       <div className="profile-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <h1 className="profile-title">My Profile</h1>

//         {error && <div className="alert alert-error">{error}</div>}
//         {success && <div className="alert alert-success">{success}</div>}

//         <div className="profile-content">
//           {/* Profile Image Section */}
//           <div className="profile-image-section">
//             <div className="profile-image-wrapper">
//               {imagePreview ? (
//                 <img src={imagePreview} alt="Profile" className="profile-image" />
//               ) : (
//                 <div className="profile-image-placeholder">
//                   <span className="placeholder-text">{getInitial()}</span>
//                 </div>
//               )}
//               {isEditing && (
//                 <div className="profile-image-actions">
//                   <label className="image-upload-btn">
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden-input"
//                     />
//                     📷 Change
//                   </label>
//                   {imagePreview && (
//                     <button 
//                       className="image-remove-btn" 
//                       onClick={removeImage}
//                       type="button"
//                     >
//                       ✕
//                     </button>
//                   )}
//                   {imageFile && (
//                     <button 
//                       className="image-upload-submit-btn"
//                       onClick={uploadProfileImage}
//                       disabled={uploadingImage}
//                       type="button"
//                     >
//                       {uploadingImage ? 'Uploading...' : '✅ Save Image'}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//             <h2 className="profile-name">{user?.name}</h2>
//             <p className="profile-email">{user?.email}</p>
//             <button 
//               className="edit-toggle-btn"
//               onClick={() => {
//                 setIsEditing(!isEditing);
//                 if (!isEditing) {
//                   // When entering edit mode, reset image file
//                   setImageFile(null);
//                   if (fileInputRef.current) {
//                     fileInputRef.current.value = "";
//                   }
//                 }
//               }}
//             >
//               {isEditing ? 'Cancel Edit' : 'Edit Profile'}
//             </button>
//           </div>

//           {/* Profile Info Section */}
//           <div className="profile-info-section">
//             <form onSubmit={handleSubmit} className="profile-form">
//               <h3 className="section-title">Personal Information</h3>
              
//               <div className="form-group">
//                 <label>Full Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className={!isEditing ? 'disabled-input' : ''}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   value={user?.email}
//                   disabled={true}
//                   className="disabled-input"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Phone Number</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className={!isEditing ? 'disabled-input' : ''}
//                 />
//               </div>

//               <h3 className="section-title">Address</h3>

//               <div className="form-group">
//                 <label>Street</label>
//                 <input
//                   type="text"
//                   name="address.street"
//                   value={formData.address.street}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className={!isEditing ? 'disabled-input' : ''}
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>City</label>
//                   <input
//                     type="text"
//                     name="address.city"
//                     value={formData.address.city}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={!isEditing ? 'disabled-input' : ''}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>State</label>
//                   <input
//                     type="text"
//                     name="address.state"
//                     value={formData.address.state}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={!isEditing ? 'disabled-input' : ''}
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Pincode</label>
//                   <input
//                     type="text"
//                     name="address.pincode"
//                     value={formData.address.pincode}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={!isEditing ? 'disabled-input' : ''}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Country</label>
//                   <input
//                     type="text"
//                     name="address.country"
//                     value={formData.address.country}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className={!isEditing ? 'disabled-input' : ''}
//                   />
//                 </div>
//               </div>

//               {isEditing && (
//                 <button type="submit" className="save-btn" disabled={loading}>
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//               )}
//             </form>

//             {/* Change Password */}
//             <div className="password-section">
//               <h3 className="section-title">Change Password</h3>
//               <form onSubmit={handlePasswordSubmit} className="password-form">
//                 <div className="form-group">
//                   <label>Current Password</label>
//                   <input
//                     type="password"
//                     name="currentPassword"
//                     value={passwordData.currentPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Enter current password"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>New Password</label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     value={passwordData.newPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Enter new password (min 6 characters)"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label>Confirm New Password</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={passwordData.confirmPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Confirm new password"
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="password-btn" disabled={loading}>
//                   {loading ? 'Updating...' : 'Change Password'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// src/ecommerce/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const getToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = localStorage.getItem("userToken");
    }
    return token;
  };

  const getUserData = () => {
    let userData = localStorage.getItem("user");
    if (!userData) {
      userData = localStorage.getItem("userData");
    }
    return userData;
  };

  useEffect(() => {
    const token = getToken();
    const userData = getUserData();
    
    if (!token || !userData) {
      navigate("/");
      return;
    }
    
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = getToken();
      
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        navigate("/");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
          address: {
            street: data.data.address?.street || "",
            city: data.data.address?.city || "",
            state: data.data.address?.state || "",
            pincode: data.data.address?.pincode || "",
            country: data.data.address?.country || ""
          }
        });
        
        // Handle profile image
        if (data.data.profileImage && data.data.profileImage !== 'default.jpg') {
          let imageUrl = data.data.profileImage;
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${BASE_URL}${imageUrl}`;
          }
          setImagePreview(imageUrl);
          console.log('📸 Profile image loaded:', imageUrl);
        } else {
          setImagePreview("");
          console.log('📸 No profile image set');
        }
      } else {
        if (data.message === "Not authorized") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
          navigate("/");
        }
        setError(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, GIF, and WebP images are allowed");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile image
  const uploadProfileImage = async () => {
    if (!imageFile) {
      console.log('⚠️ No image file to upload');
      return;
    }

    setUploadingImage(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();
      
      if (!token) {
        setError("Please login again");
        navigate("/");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('image', imageFile);

      console.log('📸 Uploading image:', {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
        apiUrl: `${API_URL}/auth/profile/upload-image`
      });

      const response = await fetch(`${API_URL}/auth/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('📸 Response status:', response.status);
      
      const data = await response.json();
      console.log('📸 Upload response:', data);

      if (data.success) {
        setSuccess("Profile image updated successfully!");
        
        // Update user data with new image
        if (data.data && data.data.profileImage) {
          let imageUrl = data.data.profileImage;
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${BASE_URL}${imageUrl}`;
          }
          setImagePreview(imageUrl);
          
          // Update user in localStorage
          const updatedUser = { 
            ...user, 
            profileImage: data.data.profileImage 
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        
        setImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to upload image");
        console.error('❌ Upload failed:', data.message);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Network error. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // First upload image if there's a new image
      if (imageFile) {
        console.log('📸 Uploading image before profile update...');
        
        const token = getToken();
        const formDataToSend = new FormData();
        formDataToSend.append('image', imageFile);

        const imageResponse = await fetch(`${API_URL}/auth/profile/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend
        });

        const imageData = await imageResponse.json();
        console.log('📸 Image upload result:', imageData);

        if (imageData.success) {
          setSuccess("Profile image updated!");
          // Update local image preview
          if (imageData.data && imageData.data.profileImage) {
            let imageUrl = imageData.data.profileImage;
            if (!imageUrl.startsWith('http')) {
              imageUrl = `${BASE_URL}${imageUrl}`;
            }
            setImagePreview(imageUrl);
          }
          setImageFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setError(imageData.message || "Failed to upload image");
          setLoading(false);
          return;
        }
      }

      // Now update profile
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };

      const token = getToken();
      const response = await fetch(`${API_URL}/auth/updateprofile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Profile updated successfully!");
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
        setIsEditing(false);
        // Refresh the page to update navbar
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        if (data.errors) {
          setError(data.errors.map(err => err.msg).join(", "));
        } else {
          setError(data.message || "Something went wrong");
        }
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/changepassword`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("❌ Password change error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-content">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <span className="placeholder-text">{getInitial()}</span>
                </div>
              )}
              {isEditing && (
                <div className="profile-image-actions">
                  <label className="image-upload-btn">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden-input"
                    />
                    📷 Change
                  </label>
                  {imagePreview && (
                    <button 
                      className="image-remove-btn" 
                      onClick={removeImage}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                  {imageFile && (
                    <button 
                      className="image-upload-submit-btn"
                      onClick={uploadProfileImage}
                      disabled={uploadingImage}
                      type="button"
                    >
                      {uploadingImage ? '⏳ Uploading...' : '✅ Save Image'}
                    </button>
                  )}
                </div>
              )}
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <button 
              className="edit-toggle-btn"
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  // When entering edit mode, reset image file
                  setImageFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }
              }}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Info Section */}
          <div className="profile-info-section">
            <form onSubmit={handleSubmit} className="profile-form">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'disabled-input' : ''}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled={true}
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'disabled-input' : ''}
                />
              </div>

              <h3 className="section-title">Address</h3>

              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? 'disabled-input' : ''}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled-input' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled-input' : ''}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled-input' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? 'disabled-input' : ''}
                  />
                </div>
              </div>

              {isEditing && (
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>

            {/* Change Password */}
            <div className="password-section">
              <h3 className="section-title">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 6 characters)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button type="submit" className="password-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;