// // src/ecommerce/ContactUs.jsx
// import React, { useState, useEffect } from "react";
// import "./ContactUs.css";

// const ContactUs = () => {
//   const [contactData, setContactData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
  
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobileNumber: "",
//     emailId: "",
//     message: ""
//   });

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//   useEffect(() => {
//     const fetchContact = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const response = await fetch(`${API_URL}/contact`);
//         const data = await response.json();

//         if (data.success && data.data) {
//           setContactData(data.data);
//         } else {
//           setContactData(getFallbackData());
//         }
//       } catch (err) {
//         console.error("❌ Error fetching contact:", err);
//         setContactData(getFallbackData());
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchContact();
//   }, [API_URL]);

//   const getFallbackData = () => {
//     return {
//       address: "Palm Court Bldg M, 50/1B, 5th Floor, New Link Road, Beside Goregaon Sports Complex, Malad West, Mumbai, Maharashtra 400064",
//       email: "websupport@justdial.com",
//       phone: "+91-8888888888",
//       timing: "Mon - Sun : 10:00 AM - 07:00 PM",
//       mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=72.825%2C19.165%2C72.855%2C19.195&layer=mapnik&marker=19.1804%2C72.8402"
//     };
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     alert("Thank you! Your message has been submitted successfully.");
//     setFormData({ fullName: "", mobileNumber: "", emailId: "", message: "" });
//   };

//   if (loading) {
//     return (
//       <section className="clean-contact-section">
//         <div className="contact-spinner-wrapper">
//           <div className="spinner-element"></div>
//           <p>Loading contact coordinates...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="clean-contact-section">
//       <div className="clean-contact-container">
        
//         <h2 className="contact-main-serif-title">Contact Us</h2>

//         {/* ROW 1: Map Element & Circular Icons Column */}
//         <div className="contact-top-layout-grid">
          
//           {/* Map Section */}
//           <div className="contact-map-frame-holder">
//             <iframe
//               src={contactData?.mapUrl || getFallbackData().mapUrl}
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen=""
//               loading="lazy"
//               title="Office Location Map View"
//             />
//             <a 
//               href="https://maps.google.com" 
//               target="_blank" 
//               rel="noreferrer" 
//               className="map-direction-floating-badge"
//             >
//               Get Direction <span className="direction-arrow-icon">➔</span>
//             </a>
//           </div>

//           {/* Details & Circular Icons Section */}
//           <div className="contact-meta-details-column">
            
//             {/* Address Row */}
//             <div className="meta-info-row-item">
//               <div className="meta-icon-circle-badge">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                   <circle cx="12" cy="10" r="3"></circle>
//                 </svg>
//               </div>
//               <div className="meta-typography-text-box">
//                 <h4>Our Office Address</h4>
//                 <p>{contactData?.address || getFallbackData().address}</p>
//               </div>
//             </div>

//             {/* Email Row */}
//             <div className="meta-info-row-item">
//               <div className="meta-icon-circle-badge">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)', marginLeft: '2px' }}>
//                   <line x1="22" y1="2" x2="11" y2="13"></line>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                 </svg>
//               </div>
//               <div className="meta-typography-text-box">
//                 <h4>General Enquiries</h4>
//                 <p>
//                   <a href={`mailto:${contactData?.email || getFallbackData().email}`}>
//                     {contactData?.email || getFallbackData().email}
//                   </a>
//                 </p>
//               </div>
//             </div>

//             {/* Phone Row */}
//             <div className="meta-info-row-item">
//               <div className="meta-icon-circle-badge">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//                 </svg>
//               </div>
//               <div className="meta-typography-text-box">
//                 <h4>Call Us</h4>
//                 <p>
//                   <a href={`tel:${contactData?.phone || getFallbackData().phone}`}>
//                     {contactData?.phone || getFallbackData().phone}
//                   </a>
//                 </p>
//               </div>
//             </div>

//             {/* Timings Row */}
//             <div className="meta-info-row-item">
//               <div className="meta-icon-circle-badge">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="10"></circle>
//                   <polyline points="12 6 12 12 16 14"></polyline>
//                 </svg>
//               </div>
//               <div className="meta-typography-text-box">
//                 <h4>Our Timing</h4>
//                 <p>{contactData?.timing || getFallbackData().timing}</p>
//               </div>
//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default ContactUs
// ;
// src/ecommerce/ContactUs.jsx
import React, { useState, useEffect } from "react";
import "./ContactUs.css";

const ContactUs = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailId: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: ""
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://api.maisfood.in/api";

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_URL}/contact`);
        const data = await response.json();

        if (data.success && data.data) {
          setContactData(data.data);
        } else {
          setContactData(getFallbackData());
        }
      } catch (err) {
        console.error("❌ Error fetching contact:", err);
        setContactData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [API_URL]);

  const getFallbackData = () => {
    return {
      address: "Palm Court Bldg M, 50/1B, 5th Floor, New Link Road, Beside Goregaon Sports Complex, Malad West, Mumbai, Maharashtra 400064",
      email: "websupport@justdial.com",
      phone: "+91-8888888888",
      timing: "Mon - Sun : 10:00 AM - 07:00 PM",
      mapUrl: "https://www.openstreetmap.org/export/embed.html?bbox=72.825%2C19.165%2C72.855%2C19.195&layer=mapnik&marker=19.1804%2C72.8402"
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 // In ContactUs.jsx, update the handleFormSubmit function:

const handleFormSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.fullName.trim()) {
    setFormStatus({ ...formStatus, error: "Please enter your full name" });
    return;
  }
  if (!formData.mobileNumber.trim()) {
    setFormStatus({ ...formStatus, error: "Please enter your mobile number" });
    return;
  }
  if (!formData.emailId.trim()) {
    setFormStatus({ ...formStatus, error: "Please enter your email" });
    return;
  }
  if (!formData.message.trim()) {
    setFormStatus({ ...formStatus, error: "Please enter your message" });
    return;
  }

  setFormStatus({ submitting: true, success: false, error: "" });

  try {
    // ✅ Changed endpoint to /api/customer-contact/submit
    const response = await fetch(`${API_URL}/customer-contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.emailId,
        phone: formData.mobileNumber,
        message: formData.message
      })
    });

    const data = await response.json();

    if (data.success) {
      setFormStatus({ submitting: false, success: true, error: "" });
      setFormData({ fullName: "", mobileNumber: "", emailId: "", message: "" });
      setTimeout(() => {
        setFormStatus({ submitting: false, success: false, error: "" });
      }, 5000);
    } else {
      setFormStatus({ 
        submitting: false, 
        success: false, 
        error: data.message || "Failed to submit message" 
      });
    }
  } catch (err) {
    console.error("❌ Error submitting form:", err);
    setFormStatus({ 
      submitting: false, 
      success: false, 
      error: "Network error. Please try again." 
    });
  }
};

  if (loading) {
    return (
      <section className="clean-contact-section">
        <div className="contact-spinner-wrapper">
          <div className="spinner-element"></div>
          <p>Loading contact coordinates...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="clean-contact-section">
      <div className="clean-contact-container">
        
        <h2 className="contact-main-serif-title">Contact Us</h2>

        {/* ROW 1: Map Element & Circular Icons Column */}
        <div className="contact-top-layout-grid">
          
          {/* Map Section */}
          <div className="contact-map-frame-holder">
            <iframe
              src={contactData?.mapUrl || getFallbackData().mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Office Location Map View"
            />
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer" 
              className="map-direction-floating-badge"
            >
              Get Direction <span className="direction-arrow-icon">➔</span>
            </a>
          </div>

          {/* Details & Circular Icons Section */}
          <div className="contact-meta-details-column">
            
            {/* Address Row */}
            <div className="meta-info-row-item">
              <div className="meta-icon-circle-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="meta-typography-text-box">
                <h4>Our Office Address</h4>
                <p>{contactData?.address || getFallbackData().address}</p>
              </div>
            </div>

            {/* Email Row */}
            <div className="meta-info-row-item">
              <div className="meta-icon-circle-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)', marginLeft: '2px' }}>
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </div>
              <div className="meta-typography-text-box">
                <h4>General Enquiries</h4>
                <p>
                  <a href={`mailto:${contactData?.email || getFallbackData().email}`}>
                    {contactData?.email || getFallbackData().email}
                  </a>
                </p>
              </div>
            </div>

            {/* Phone Row */}
            <div className="meta-info-row-item">
              <div className="meta-icon-circle-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="meta-typography-text-box">
                <h4>Call Us</h4>
                <p>
                  <a href={`tel:${contactData?.phone || getFallbackData().phone}`}>
                    {contactData?.phone || getFallbackData().phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Timings Row */}
            <div className="meta-info-row-item">
              <div className="meta-icon-circle-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="meta-typography-text-box">
                <h4>Our Timing</h4>
                <p>{contactData?.timing || getFallbackData().timing}</p>
              </div>
            </div>

          </div>
        </div>

        {/* ROW 2: Contact Form */}
        <div className="contact-feedback-submission-form">
          <form onSubmit={handleFormSubmit} className="contact-form-wrapper">
            
            {/* Form Status Messages */}
            {formStatus.error && (
              <div className="form-status-message error">
                {formStatus.error}
              </div>
            )}
            {formStatus.success && (
              <div className="form-status-message success">
                ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            <div className="contact-bottom-form-grid">
              <div className="form-inputs-stacked-column">
                <input
                  type="text"
                  name="fullName"
                  className="feedback-form-input-field"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="mobileNumber"
                  className="feedback-form-input-field"
                  placeholder="Mobile Number *"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="emailId"
                  className="feedback-form-input-field"
                  placeholder="Email ID *"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-textarea-column">
                <textarea
                  name="message"
                  className="feedback-form-textarea-field"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-submit-btn-row">
              <button 
                type="submit" 
                className="feedback-form-submit-pill-btn"
                disabled={formStatus.submitting}
              >
                {formStatus.submitting ? 'Submitting...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactUs;