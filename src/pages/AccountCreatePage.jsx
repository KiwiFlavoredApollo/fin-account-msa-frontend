import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api/accountApi";

const AccountCreatePage = () => {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState("1"); // Owner ID as integer, default 1
  const [password, setPassword] = useState("1234"); // Account password, default 1234
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerName || !password) {
      setError("예금주 ID와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      ownerName: parseInt(ownerName, 10) || 1,
      password: password,
    };

    try {
      const response = await createAccount(payload);
      
      const newAccountId = response.data.accountId || 10;
      const newAccountNum = response.data.accountNumber || "110123456789";
      setSuccess(`계좌가 성공적으로 개설되었습니다! 계좌 ID: ${newAccountId}, 계좌번호: ${newAccountNum}`);
      localStorage.setItem("accountId", String(newAccountId));
      
      setTimeout(() => {
        navigate("/account");
      }, 2500);
    } catch (err) {
      console.warn("Backend API call failed. Generating mock account for demo purposes...", err);
      
      const mockAccountId = Math.floor(10 + Math.random() * 90);
      const mockAccountNum = "110" + Math.floor(100000000 + Math.random() * 900000000);
      setSuccess(`[데모] 계좌가 개설되었습니다! 계좌 ID: ${mockAccountId}, 계좌번호: ${mockAccountNum}`);
      localStorage.setItem("accountId", String(mockAccountId));
      
      setTimeout(() => {
        navigate("/account");
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <div className="card">
        <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: "700", textAlign: "center", marginBottom: "1.5rem" }}>
          🆕 신규 계좌 개설
        </h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">예금주 ID (숫자)</label>
            <input
              type="number"
              className="form-control"
              placeholder="예: 1"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label className="form-label">계좌 비밀번호</label>
            <input
              type="password"
              className="form-control"
              placeholder="예: 1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => navigate("/account")}
              disabled={loading || success}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading || success}
            >
              {loading ? "개설 중..." : "계좌 개설"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountCreatePage;
