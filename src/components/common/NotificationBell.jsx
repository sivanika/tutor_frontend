import { useState, useEffect, useRef } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socket";
import API from "../../services/api";
import toast from "react-hot-toast";
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";



export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    API.get("/notifications")
      .then(res => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        }
      })
      .catch(err => console.error("Error fetching notifications:", err));

    // Listen for real-time notifications
    const onNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      toast(notif.message, {
        icon: notif.type === "success" ? <FiCheckCircle className="text-emerald-500" /> : notif.type === "warning" ? <FiAlertTriangle className="text-amber-500" /> : notif.type === "error" ? <FiXCircle className="text-red-500" /> : <FiBell className="text-[var(--primary)]" />,
      });

    };

    socket.on("newNotification", onNewNotification);

    return () => {
      socket.off("newNotification", onNewNotification);
    };
  }, [user]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      await API.put(`/notifications/${id}/read`);
    } catch(err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await API.put("/notifications/read-all");
    } catch(err) {
      console.error(err);
    }
  };

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
      >
        <FiBell size={18} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[var(--primary)] hover:text-[#520dc2] font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-1">
                  <FiBell size={20} />
                </div>
                <p className="text-sm font-medium text-gray-800">No notifications yet</p>
                <p className="text-xs text-gray-500">We'll let you know when something arrives!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    onClick={() => {
                        if (!notif.isRead) markAsRead(notif._id);
                    }}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 group ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="shrink-0 mt-1">
                      {notif.type === "success" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/20" />}
                      {notif.type === "warning" && <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/20" />}
                      {notif.type === "error" && <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm shadow-red-400/20" />}
                      {notif.type === "info" && <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/20" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm mb-0.5 ${!notif.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsRead(notif._id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 hover:text-gray-600 rounded text-gray-400 shrink-0 self-start transition-all"
                        title="Mark as read"
                      >
                        <FiCheck size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
