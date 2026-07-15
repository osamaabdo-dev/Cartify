"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Eye, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getUnreadNotificationCount,
  getRecentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/actions/notificationActions";
import { timeAgo } from "@/lib/utils/dashboardUtils";

export default function NotificationBell() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const prevCountRef = useRef(null);
  const dropdownRef = useRef(null);

  async function poll() {
    try {
      const count = await getUnreadNotificationCount();

      if (prevCountRef.current !== null && count > prevCountRef.current) {
        const recent = await getRecentNotifications(count - prevCountRef.current);
        for (const n of recent) {
          const id = Date.now() + Math.random();
          setToasts((prev) => [...prev, { ...n, _localId: id }]);
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t._localId !== id));
          }, 5000);
        }
      }

      setUnreadCount(count);
      prevCountRef.current = count;
    } catch {
      // silent fail — retry on next interval
    }
  }

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    getRecentNotifications(10).then(setNotifications);
  }, [dropdownOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleNotificationClick(n) {
    if (!n.isRead) {
      await markNotificationAsRead(n.id);
      setUnreadCount((c) => c - 1);
      if (prevCountRef.current !== null) prevCountRef.current -= 1;
    }
    setDropdownOpen(false);
    router.push(n.link || "#");
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead();
    setUnreadCount(0);
    prevCountRef.current = 0;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t._localId !== id));
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="relative w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30] transition-all cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#dc2626] text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {toasts.map((t) => (
        <button
          key={t._localId}
          onClick={() => {
            removeToast(t._localId);
            router.push(t.link || "#");
          }}
          className="fixed bottom-6 left-6 z-50 flex items-start gap-3 bg-white border border-[#e2e8f0] shadow-xl rounded-2xl p-4 min-w-[300px] max-w-[380px] text-right cursor-pointer animate-slide-up"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fefce8] flex items-center justify-center shrink-0">
            <Bell size={16} className="text-[#a16207]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#0b1c30]">{t.title}</p>
            <p className="text-[10px] text-[#45464d] mt-0.5">{t.message}</p>
          </div>
          <span
            onClick={(e) => {
              e.stopPropagation();
              removeToast(t._localId);
            }}
            className="text-[#94a3b8] hover:text-[#45464d] shrink-0 cursor-pointer"
          >
            <X size={14} />
          </span>
        </button>
      ))}

      {dropdownOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0b1c30]">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-[#775a19] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CheckCheck size={12} />
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#94a3b8]">
                لا توجد إشعارات
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className="w-full text-right px-4 py-3 flex items-start gap-3 hover:bg-[#f8fafc] transition-colors border-b border-[#e2e8f0]/60 last:border-b-0 cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.isRead ? "bg-transparent" : "bg-[#775a19]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs ${
                        n.isRead ? "text-[#45464d]" : "text-[#0b1c30] font-bold"
                      }`}
                    >
                      {n.title}
                    </p>
                    {n.message && (
                      <p className="text-[10px] text-[#94a3b8] mt-0.5 truncate">
                        {n.message}
                      </p>
                    )}
                    <p className="text-[9px] text-[#94a3b8] mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && <Eye size={12} className="text-[#94a3b8] mt-1" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
