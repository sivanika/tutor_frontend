export const resolveMediaUrl = (url) => {
  if (!url) return "";
  
  // Local uploads
  if (url.startsWith("uploads/")) {
    const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${API_BASE}/${url}`;
  }
  
  // If it's already a full HTTP URL (e.g. Cloudinary, Youtube, external links, etc.)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Add Cloudinary optimizations if applicable
    if (url.includes("res.cloudinary.com")) {
      // Inject /f_auto,q_auto/ after /upload/ for automatic format/quality optimization
      if (url.includes("/upload/")) {
        return url.replace("/upload/", "/upload/f_auto,q_auto/");
      }
    }
    return url;
  }
  
  // fallback for anything else
  return url;
};

export const media = resolveMediaUrl;
export default resolveMediaUrl;
