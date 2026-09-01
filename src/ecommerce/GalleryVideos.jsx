// // src/components/GalleryVideos.jsx
// import React, { useState, useEffect } from "react";
// import "./GalleryVideos.css";

// const GalleryVideos = () => {
//   const [galleryData, setGalleryData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedMedia, setSelectedMedia] = useState(null);
//   const [mediaType, setMediaType] = useState('image');

//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//   const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchGallery = async () => {
//       try {
//         setLoading(true);
//         console.log("🔍 Fetching gallery data...");
        
//         const response = await fetch(`${API_URL}/gallery`);
//         const data = await response.json();

//         console.log("📦 Gallery response:", data);

//         if (data.success) {
//           setGalleryData(data.data);
//         } else {
//           setError("Gallery not found");
//           setGalleryData(getFallbackData());
//         }
//       } catch (err) {
//         console.error("❌ Error fetching gallery:", err);
//         setError("Failed to load gallery");
//         setGalleryData(getFallbackData());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGallery();
//   }, []);

//   // Fallback data if API fails
//   const getFallbackData = () => {
//     return {
//       image1: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
//       image1Title: "ORGANIC",
//       image1Alt: "Organic Products",
//       image2: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop",
//       image2Title: "ORGANIC",
//       image2Alt: "Organic Products",
//       image3: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
//       image3Title: "ORGANIC",
//       image3Alt: "Organic Products",
//       video1: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       video1Title: "ORGANIC",
//       video1Description: "Organic Products Video",
//       video2: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       video2Title: "ORGANIC",
//       video2Description: "Organic Products Video",
//       video3: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//       video3Title: "ORGANIC",
//       video3Description: "Organic Products Video"
//     };
//   };

//   const openModal = (url, type) => {
//     setSelectedMedia(url);
//     setMediaType(type);
//   };

//   const closeModal = () => {
//     setSelectedMedia(null);
//   };

//   if (loading) {
//     return (
//       <section className="gallery-section">
//         <div className="gallery-container">
//           <div className="gallery-header">
//             <h2 className="gallery-title">Gallery</h2>
//           </div>
//           <div className="gallery-loading">
//             <div className="loading-spinner"></div>
//             <p>Loading gallery...</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Get all media items with proper ordering
//   const getMediaItems = () => {
//     if (!galleryData) return [];

//     const images = [];
//     const videos = [];

//     // Collect all images
//     if (galleryData.image1) {
//       images.push({
//         id: 'img1',
//         type: 'image',
//         url: `${BASE_URL}${galleryData.image1}`,
//         title: galleryData.image1Title || 'Image 1',
//         alt: galleryData.image1Alt || 'Gallery Image'
//       });
//     }
//     if (galleryData.image2) {
//       images.push({
//         id: 'img2',
//         type: 'image',
//         url: `${BASE_URL}${galleryData.image2}`,
//         title: galleryData.image2Title || 'Image 2',
//         alt: galleryData.image2Alt || 'Gallery Image'
//       });
//     }
//     if (galleryData.image3) {
//       images.push({
//         id: 'img3',
//         type: 'image',
//         url: `${BASE_URL}${galleryData.image3}`,
//         title: galleryData.image3Title || 'Image 3',
//         alt: galleryData.image3Alt || 'Gallery Image'
//       });
//     }

//     // Collect all videos
//     if (galleryData.video1) {
//       videos.push({
//         id: 'vid1',
//         type: 'video',
//         url: galleryData.video1.startsWith('http') ? galleryData.video1 : `${BASE_URL}${galleryData.video1}`,
//         title: galleryData.video1Title || 'Video 1',
//         description: galleryData.video1Description || ''
//       });
//     }
//     if (galleryData.video2) {
//       videos.push({
//         id: 'vid2',
//         type: 'video',
//         url: galleryData.video2.startsWith('http') ? galleryData.video2 : `${BASE_URL}${galleryData.video2}`,
//         title: galleryData.video2Title || 'Video 2',
//         description: galleryData.video2Description || ''
//       });
//     }
//     if (galleryData.video3) {
//       videos.push({
//         id: 'vid3',
//         type: 'video',
//         url: galleryData.video3.startsWith('http') ? galleryData.video3 : `${BASE_URL}${galleryData.video3}`,
//         title: galleryData.video3Title || 'Video 3',
//         description: galleryData.video3Description || ''
//       });
//     }

//     // Arrange items in specific layout:
//     // Row 1: Image 1, Video 1 (CENTER), Image 2
//     // Row 2: Video 2, Image 3 (CENTER), Video 3

//     const orderedItems = [];

//     // Row 1: Image 1, Video 1 (center), Image 2
//     if (images.length >= 2 && videos.length >= 1) {
//       orderedItems.push(images[0]);  // Image 1 (left)
//       orderedItems.push(videos[0]);  // Video 1 (center)
//       orderedItems.push(images[1]);  // Image 2 (right)
//     } else {
//       // Fallback: add what we have
//       images.forEach(img => orderedItems.push(img));
//       videos.forEach(vid => orderedItems.push(vid));
//     }

//     // Row 2: Video 2, Image 3 (center), Video 3
//     if (videos.length >= 2 && images.length >= 3) {
//       orderedItems.push(videos[1]);  // Video 2 (left)
//       orderedItems.push(images[2]);  // Image 3 (center)
//       if (videos.length >= 3) {
//         orderedItems.push(videos[2]);  // Video 3 (right)
//       } else {
//         orderedItems.push(videos[1]);  // Duplicate video 2 if no video 3
//       }
//     } else if (videos.length >= 1 && images.length >= 3) {
//       orderedItems.push(videos[0]);  // Video 1 (left)
//       orderedItems.push(images[2]);  // Image 3 (center)
//       if (videos.length >= 2) {
//         orderedItems.push(videos[1]);  // Video 2 (right)
//       }
//     }

//     return orderedItems;
//   };

//   const mediaItems = getMediaItems();

//   return (
//     <section className="gallery-section">
//       <div className="gallery-container">
//         <div className="gallery-header">
//           <h2 className="gallery-title">Gallery</h2>
//         </div>

//         {/* Gallery Grid - Combined Images and Videos */}
//         <div className="gallery-grid">
//           {mediaItems.length > 0 ? (
//             mediaItems.map((item, index) => (
//               <div 
//                 key={item.id || index} 
//                 className={`gallery-item ${item.type === 'video' ? 'video-item' : 'image-item'} ${index === 1 ? 'center-item' : ''} ${index === 4 ? 'center-item' : ''}`}
//                 onClick={() => {
//                   if (item.type === 'image') {
//                     openModal(item.url, 'image');
//                   } else if (item.type === 'video') {
//                     openModal(item.url, 'video');
//                   }
//                 }}
//               >
//                 {item.type === "video" ? (
//                   <>
//                     <div className="video-thumbnail-wrapper">
//                       {item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
//                         <div className="video-thumbnail-placeholder">
//                           <div className="video-thumbnail-bg" style={{
//                             backgroundImage: `url(https://img.youtube.com/vi/${getYouTubeId(item.url)}/hqdefault.jpg)`
//                           }}>
//                             <div className="video-play-btn">
//                               <span>▶</span>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <video 
//                           src={item.url} 
//                           className="gallery-image"
//                           muted
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                             const parent = e.target.parentElement;
//                             const placeholder = document.createElement('div');
//                             placeholder.className = 'video-thumbnail-placeholder';
//                             placeholder.innerHTML = `
//                               <div class="video-thumbnail-bg" style="background: linear-gradient(135deg, #1a3a2a, #2d5a3d);">
//                                 <div class="video-play-btn">
//                                   <span>▶</span>
//                                 </div>
//                               </div>
//                             `;
//                             parent.appendChild(placeholder);
//                           }}
//                         />
//                       )}
//                     </div>
//                     <div className="gallery-overlay">
//                       <span className="gallery-label">{item.title || 'Video'}</span>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <img 
//                       src={item.url} 
//                       alt={item.alt || item.title || 'Gallery Image'} 
//                       className="gallery-image"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found';
//                       }}
//                     />
//                     <div className="gallery-overlay">
//                       <span className="gallery-label">{item.title || 'Image'}</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="gallery-empty">
//               <p>No gallery items found.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal for viewing media */}
//       {selectedMedia && (
//         <div className="gallery-modal" onClick={closeModal}>
//           <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="gallery-modal-close" onClick={closeModal}>✕</button>
//             {mediaType === 'image' ? (
//               <img src={selectedMedia} alt="Gallery" className="gallery-modal-image" />
//             ) : (
//               <div className="gallery-modal-video-wrapper">
//                 {selectedMedia.includes('youtube.com') || selectedMedia.includes('youtu.be') ? (
//                   <iframe
//                     src={selectedMedia}
//                     title="Gallery Video"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     className="gallery-modal-video"
//                   />
//                 ) : (
//                   <video 
//                     src={selectedMedia} 
//                     controls 
//                     autoPlay 
//                     className="gallery-modal-video"
//                   />
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// // Helper function to extract YouTube video ID
// const getYouTubeId = (url) => {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//   const match = url.match(regExp);
//   return (match && match[2].length === 11) ? match[2] : null;
// };

// export default GalleryVideos;
// src/components/GalleryVideos.jsx


import React, { useState, useEffect } from "react";
import "./GalleryVideos.css";

const GalleryVideos = () => {
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState('image');

  const API_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000/api";
  const BASE_URL = import.meta.env.VITE_API_URL || "http://103.154.233.113:8000";

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching gallery data...");
        
        const response = await fetch(`${API_URL}/gallery`);
        const data = await response.json();

        console.log("📦 Gallery response:", data);

        if (data.success) {
          setGalleryData(data.data);
        } else {
          setError("Gallery not found");
          setGalleryData(getFallbackData());
        }
      } catch (err) {
        console.error("❌ Error fetching gallery:", err);
        setError("Failed to load gallery");
        setGalleryData(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Fallback data if API fails
  const getFallbackData = () => {
    return {
      image1: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
      image1Title: "ORGANIC",
      image1Alt: "Organic Products",
      image2: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop",
      image2Title: "ORGANIC",
      image2Alt: "Organic Products",
      image3: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
      image3Title: "ORGANIC",
      image3Alt: "Organic Products",
      video1: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      video1Title: "ORGANIC",
      video1Description: "Organic Products Video",
      video2: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      video2Title: "ORGANIC",
      video2Description: "Organic Products Video",
      video3: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      video3Title: "ORGANIC",
      video3Description: "Organic Products Video"
    };
  };

  const openModal = (url, type) => {
    setSelectedMedia(url);
    setMediaType(type);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-header">
            <h2 className="gallery-title">Gallery</h2>
          </div>
          <div className="gallery-loading">
            <div className="loading-spinner"></div>
            <p>Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  // Get all media items with proper ordering
  const getMediaItems = () => {
    if (!galleryData) return [];

    const images = [];
    const videos = [];

    // Collect all images
    if (galleryData.image1) {
      images.push({
        id: 'img1',
        type: 'image',
        url: galleryData.image1.startsWith('http') ? galleryData.image1 : `${BASE_URL}${galleryData.image1}`,
        title: galleryData.image1Title || 'Image 1',
        alt: galleryData.image1Alt || 'Gallery Image'
      });
    }
    if (galleryData.image2) {
      images.push({
        id: 'img2',
        type: 'image',
        url: galleryData.image2.startsWith('http') ? galleryData.image2 : `${BASE_URL}${galleryData.image2}`,
        title: galleryData.image2Title || 'Image 2',
        alt: galleryData.image2Alt || 'Gallery Image'
      });
    }
    if (galleryData.image3) {
      images.push({
        id: 'img3',
        type: 'image',
        url: galleryData.image3.startsWith('http') ? galleryData.image3 : `${BASE_URL}${galleryData.image3}`,
        title: galleryData.image3Title || 'Image 3',
        alt: galleryData.image3Alt || 'Gallery Image'
      });
    }

    // Collect all videos
    if (galleryData.video1) {
      videos.push({
        id: 'vid1',
        type: 'video',
        url: galleryData.video1.startsWith('http') ? galleryData.video1 : `${BASE_URL}${galleryData.video1}`,
        title: galleryData.video1Title || 'Video 1',
        description: galleryData.video1Description || ''
      });
    }
    if (galleryData.video2) {
      videos.push({
        id: 'vid2',
        type: 'video',
        url: galleryData.video2.startsWith('http') ? galleryData.video2 : `${BASE_URL}${galleryData.video2}`,
        title: galleryData.video2Title || 'Video 2',
        description: galleryData.video2Description || ''
      });
    }
    if (galleryData.video3) {
      videos.push({
        id: 'vid3',
        type: 'video',
        url: galleryData.video3.startsWith('http') ? galleryData.video3 : `${BASE_URL}${galleryData.video3}`,
        title: galleryData.video3Title || 'Video 3',
        description: galleryData.video3Description || ''
      });
    }

    const orderedItems = [];

    // Row 1: Image 1, Video 1 (center), Image 2
    if (images.length >= 2 && videos.length >= 1) {
      orderedItems.push(images[0]);  // Image 1
      orderedItems.push(videos[0]);  // Video 1
      orderedItems.push(images[1]);  // Image 2
    } else {
      images.forEach(img => orderedItems.push(img));
      videos.forEach(vid => orderedItems.push(vid));
    }

    // Row 2: Video 2, Image 3 (center), Video 3
    if (videos.length >= 2 && images.length >= 3) {
      orderedItems.push(videos[1]);  // Video 2
      orderedItems.push(images[2]);  // Image 3
      if (videos.length >= 3) {
        orderedItems.push(videos[2]);  // Video 3
      } else {
        orderedItems.push(videos[1]);
      }
    } else if (videos.length >= 1 && images.length >= 3) {
      orderedItems.push(videos[0]);
      orderedItems.push(images[2]);
      if (videos.length >= 2) {
        orderedItems.push(videos[1]);
      }
    }

    return orderedItems;
  };

  const mediaItems = getMediaItems();

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        <div className="gallery-header">
          <h2 className="gallery-title">Gallery</h2>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {mediaItems.length > 0 ? (
            mediaItems.map((item, index) => {
              const isYouTube = item.type === 'video' && (item.url.includes('youtube.com') || item.url.includes('youtu.be'));
              
              return (
                <div 
                  key={item.id || index} 
                  className={`gallery-item ${item.type === 'video' ? 'video-item' : 'image-item'}`}
                  onClick={(e) => {
                    // Only open modal if clicking overlay/thumbnail, not clicking natively inline video controls
                    if (e.target.tagName !== 'VIDEO') {
                      openModal(item.url, item.type);
                    }
                  }}
                >
                  {item.type === "video" ? (
                    <div className="video-thumbnail-wrapper">
                      {isYouTube ? (
                        <div className="video-thumbnail-placeholder">
                          <div className="video-thumbnail-bg" style={{
                            backgroundImage: `url(https://img.youtube.com/vi/${getYouTubeId(item.url)}/hqdefault.jpg)`
                          }}>
                            <div className="video-play-btn">
                              <span>▶</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Direct videos get local inline controls for quick play/pause access */
                        <video 
                          src={item.url} 
                          className="gallery-inline-video"
                          controls
                          preload="metadata"
                        />
                      )}
                      
                      {/* Only overlay clicking support for YouTube since it uses image placeholders */}
                      {isYouTube && (
                        <div className="gallery-overlay">
                          <span className="gallery-label">{item.title || 'Video'}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <img 
                        src={item.url} 
                        alt={item.alt || item.title || 'Gallery Image'} 
                        className="gallery-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=Image+Not+Found';
                        }}
                      />
                      <div className="gallery-overlay">
                        <span className="gallery-label">{item.title || 'Image'}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div className="gallery-empty">
              <p>No gallery items found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing media */}
      {selectedMedia && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={closeModal}>✕</button>
            {mediaType === 'image' ? (
              <img src={selectedMedia} alt="Gallery" className="gallery-modal-image" />
            ) : (
              <div className="gallery-modal-video-wrapper">
                {selectedMedia.includes('youtube.com') || selectedMedia.includes('youtu.be') ? (
                  <iframe
                    src={selectedMedia}
                    title="Gallery Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="gallery-modal-video"
                  />
                ) : (
                  <video 
                    src={selectedMedia} 
                    controls 
                    autoPlay 
                    className="gallery-modal-video"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default GalleryVideos;