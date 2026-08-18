import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getNotifications, markAsRead } from "../api/notificationApi";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const accountId = localStorage.getItem("accountId");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!token) return;
    const ownerName = localStorage.getItem("mockOwnerName");
    if (!ownerName) return;
    try {
      const res = await getNotifications(ownerName);
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      // Notification service might be unavailable in local dev without Kafka
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // 10s poll
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accountId");
    navigate("/login");
  };

  const handleBrandClick = () => {
    if (location.pathname === "/account") {
      window.dispatchEvent(new CustomEvent("reset-account-view"));
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead && notif.notificationId) {
      try {
        await markAsRead(notif.notificationId);
      } catch (e) {
        // ignore
      }
    }
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notif.notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to={token ? "/account" : "/login"} className="brand" onClick={handleBrandClick}>
          🏦 FIN-M Banking
        </Link>
        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {token ? (
            <>
              <Link
                to="/account"
                className={`nav-link ${location.pathname === "/account" ? "active" : ""}`}
              >
                계좌 조회
              </Link>
              <Link
                to="/create-account"
                className={`nav-link ${location.pathname === "/create-account" ? "active" : ""}`}
              >
                계좌 개설
              </Link>
              <Link
                to="/history"
                className={`nav-link ${location.pathname === "/history" ? "active" : ""}`}
              >
                거래 내역
              </Link>

              {/* Notification Bell */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    padding: "0.2rem 0.5rem",
                    position: "relative",
                  }}
                  title="알림"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        background: "var(--danger, #ef4444)",
                        color: "white",
                        borderRadius: "50%",
                        fontSize: "0.7rem",
                        padding: "0.1rem 0.35rem",
                        fontWeight: "bold",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "2.5rem",
                      width: "320px",
                      maxHeight: "380px",
                      overflowY: "auto",
                      background: "var(--card-bg, #ffffff)",
                      border: "1px solid var(--border, #e2e8f0)",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      zIndex: 1000,
                      padding: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid var(--border, #e2e8f0)",
                        paddingBottom: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "700" }}>
                        🔔 실시간 거래 알림
                      </h4>
                      <button
                        onClick={() => setShowNotifications(false)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                      >
                        ✕
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>
                        수신된 알림이 없습니다.
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {notifications.map((n, idx) => (
                          <div
                            key={n.notificationId || idx}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              padding: "0.6rem",
                              borderRadius: "0.5rem",
                              background: n.isRead ? "var(--bg-subtle, #f8fafc)" : "rgba(37, 99, 235, 0.08)",
                              border: n.isRead ? "1px solid transparent" : "1px solid rgba(37, 99, 235, 0.2)",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                              <span>{n.transactionType || "거래 알림"}</span>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                {n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : ""}
                              </span>
                            </div>
                            <div style={{ marginTop: "0.25rem", color: "var(--text)" }}>
                              {n.amount
                                ? `${new Intl.NumberFormat("ko-KR").format(n.amount)}원 거래가 발생했습니다.`
                                : "거래 상태 업데이트"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.3rem 0.75rem" }}>
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
