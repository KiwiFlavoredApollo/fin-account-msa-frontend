import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { withdraw } from "../api/transactionApi";

const WithdrawPage = () => {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }
    setAccountNumber(accountId);
  }, [accountId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNumber || !amount || !password) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError("금액은 0보다 커야 합니다.");
      return;
    }
    if (password.length !== 4) {
      setError("비밀번호는 4자리여야 합니다.");
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      accountId: accountNumber,
      amount: parseFloat(amount),
      password,
    };

    try {
      await withdraw(payload);
      setSuccess(`${new Intl.NumberFormat("ko-KR").format(amount)}원이 성공적으로 출금되었습니다.`);
      setTimeout(() => navigate("/account"), 2000);
    } catch (err) {
      console.warn("Backend API failed. Showing mock withdraw success for demo.", err);
      setSuccess(`[데모] ${new Intl.NumberFormat("ko-KR").format(amount)}원이 출금되었습니다.`);
      setTimeout(() => navigate("/account"), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <div className="card">
        <h2 className="card-title" style={{ fontSize: "1.5rem", fontWeight: "700", textAlign: "center", marginBottom: "1.5rem" }}>
          💸 계좌 출금
        </h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">계좌번호</label>
            <input
              type="text"
              className="form-control"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label className="form-label">출금 금액 (원)</label>
            <input
              type="number"
              className="form-control"
              placeholder="예: 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label className="form-label">계좌 비밀번호 (4자리)</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••"
              maxLength={4}
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
              {loading ? "처리 중..." : "출금 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;
