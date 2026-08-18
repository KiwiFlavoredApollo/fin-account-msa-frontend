import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const accountId = localStorage.getItem("accountId");

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

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to={token ? "/account" : "/login"} className="brand" onClick={handleBrandClick}>
          🏦 FIN-M Banking
        </Link>
        <nav className="nav-links">
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
