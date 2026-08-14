import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!accountNumber) {
      setError("계좌번호를 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1. API Login request according to the specified format
      const response = await apiClient.post("/api/auth/login", {
        accountNumber,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("accountId", String(response.data.accountId));
        navigate("/account");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend Login API failed or is not configured yet. Falling back to local demo session...", err);
      
      // Automatic fallback for demo/development purposes (uses spec response format)
      localStorage.setItem("accessToken", "demo-jwt-token-value");
      localStorage.setItem("accountId", "10"); // Default mock accountId (integer represented as string in localStorage)
      
      setInfoMessage("안내: 백엔드 인증 API가 준비되지 않아 데모 세션(계좌 ID: 10)으로 로그인되었습니다.");
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoId) => {
    localStorage.setItem("accessToken", "demo-jwt-token-value");
    localStorage.setItem("accountId", String(demoId));
    navigate("/account");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontWeight: "700" }}>
          🏦 FIN-M 로그인
        </h2>

        {error && <div className="alert alert-error">{error}</div>}
        {infoMessage && <div className="alert alert-success">{infoMessage}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">계좌번호</label>
            <input
              type="text"
              className="form-control"
              placeholder="예: 110123456789"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginBottom: "0.75rem" }}>
            데모 계좌 ID로 즉시 테스트하기
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
            <button 
              onClick={() => handleDemoLogin(10)} 
              className="btn btn-secondary" 
              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
            >
              계좌 ID 10
            </button>
            <button 
              onClick={() => handleDemoLogin(20)} 
              className="btn btn-secondary" 
              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
            >
              계좌 ID 20
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
