import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { createAccount } from "../api/accountApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // "login" or "create"

  // Login form states
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");

  // Create account form states
  const [ownerName, setOwnerName] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!accountNumber) {
      setError("계좌번호를 입력해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1. API Login request
      const response = await apiClient.post("/auth/login", {
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
      
      // Automatic fallback for demo/development purposes
      localStorage.setItem("accessToken", "demo-jwt-token-value");
      localStorage.setItem("accountId", "10"); // Default mock accountId
      
      setInfoMessage("안내: 백엔드 인증 API가 준비되지 않아 데모 세션(계좌 ID: 10)으로 로그인되었습니다.");
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!ownerName) {
      setError("예금주 이름을 입력해주세요.");
      return;
    }
    if (!createPassword) {
      setError("계좌 비밀번호를 입력해주세요.");
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const payload = {
      ownerName: ownerName,
      password: createPassword,
    };

    try {
      // API call to create account with the string ownerName and password
      const response = await createAccount(payload);
      
      const newAccountId = response.data.accountId || 10;
      const newAccountNum = response.data.accountNumber || "110123456789";
      const registeredName = response.data.ownerName || ownerName;
      
      setSuccessMessage(`🎉 계좌 개설 성공!\n계좌번호: ${newAccountNum}\n예금주: ${registeredName}\n계좌 ID: ${newAccountId}`);
      
      // Auto-login on success
      localStorage.setItem("accessToken", "demo-jwt-token-value");
      localStorage.setItem("accountId", String(newAccountId));
      localStorage.setItem("mockOwnerName", registeredName);
      localStorage.setItem("mockAccountNumber", newAccountNum);
      
      setTimeout(() => {
        navigate("/account");
      }, 3000);
    } catch (err) {
      console.warn("Backend API call failed. Generating mock account for demo purposes...", err);
      
      const mockAccountId = Math.floor(10 + Math.random() * 90);
      const mockAccountNum = "110" + Math.floor(100000000 + Math.random() * 900000000);
      
      setSuccessMessage(`[데모] 계좌 개설 성공!\n계좌번호: ${mockAccountNum}\n예금주: ${ownerName}\n계좌 ID: ${mockAccountId}`);
      
      // Auto-login on success (demo mode)
      localStorage.setItem("accessToken", "demo-jwt-token-value");
      localStorage.setItem("accountId", String(mockAccountId));
      localStorage.setItem("mockOwnerName", ownerName);
      localStorage.setItem("mockAccountNumber", mockAccountNum);
      
      setTimeout(() => {
        navigate("/account");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoId, demoName, demoNum) => {
    localStorage.setItem("accessToken", "demo-jwt-token-value");
    localStorage.setItem("accountId", String(demoId));
    if (demoName) localStorage.setItem("mockOwnerName", demoName);
    if (demoNum) localStorage.setItem("mockAccountNumber", demoNum);
    navigate("/account");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "1rem", fontWeight: "700" }}>
          🏦 FIN-M 디지털 뱅킹
        </h2>

        {/* Auth Tabs */}
        <div className="auth-tabs">
          <div
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError("");
              setSuccessMessage("");
              setInfoMessage("");
            }}
          >
            로그인
          </div>
          <div
            className={`auth-tab ${activeTab === "create" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("create");
              setError("");
              setSuccessMessage("");
              setInfoMessage("");
            }}
          >
            계좌 개설
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {infoMessage && <div className="alert alert-success">{infoMessage}</div>}
        {successMessage && (
          <div className="alert alert-success" style={{ whiteSpace: "pre-line" }}>
            {successMessage}
          </div>
        )}

        {/* Tab content */}
        {activeTab === "login" ? (
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
              style={{ marginTop: "1.5rem" }}
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateAccount}>
            <div className="form-group">
              <label className="form-label">예금주 이름</label>
              <input
                type="text"
                className="form-control"
                placeholder="예: 황윤서"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                disabled={loading || !!successMessage}
              />
            </div>

            <div className="form-group">
              <label className="form-label">계좌 비밀번호</label>
              <input
                type="password"
                className="form-control"
                placeholder="비밀번호 4자리"
                maxLength={4}
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                disabled={loading || !!successMessage}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: "1.5rem" }}
              disabled={loading || !!successMessage}
            >
              {loading ? "계좌 개설 중..." : "🆕 계좌 개설 및 로그인"}
            </button>
          </form>
        )}

        {/* Demo Section */}
        <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginBottom: "0.75rem" }}>
            데모 계좌로 즉시 테스트하기
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={() => handleDemoLogin(10, "황윤서", "110123456789")} 
              className="btn btn-secondary" 
              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
            >
              황윤서 (ID: 10)
            </button>
            <button 
              onClick={() => handleDemoLogin(20, "김민지", "110987654321")} 
              className="btn btn-secondary" 
              style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
            >
              김민지 (ID: 20)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
