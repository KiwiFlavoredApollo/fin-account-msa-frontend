import React from "react";
import { Link } from "react-router-dom";

const AccountCard = ({ account, balance, loading }) => {
  if (loading) {
    return <div className="card" style={{ textAlign: "center", padding: "3rem" }}>계좌 정보를 불러오는 중...</div>;
  }

  if (!account) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>연결된 계좌가 없습니다.</p>
        <Link to="/create-account" className="btn btn-primary">
          계좌 개설하기
        </Link>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(value || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
      case "active":
        return <span className="badge badge-success">활성</span>;
      case "SUSPENDED":
      case "suspended":
        return <span className="badge badge-warning">정지</span>;
      default:
        return <span className="badge badge-error">{status || "비활성"}</span>;
    }
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>DIGITAL ACCOUNT</span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", letterSpacing: "1px", margin: "0.2rem 0" }}>
            {account.accountNumber || account.id}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>예금주: <strong style={{ color: "var(--text)" }}>{account.ownerName || account.owner || "사용자"}</strong></p>
        </div>
        <div>
          {getStatusBadge(account.status || "ACTIVE")}
        </div>
      </div>
      
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "1rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>사용 가능 잔액</span>
        <div style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--primary)" }}>
          {formatCurrency(balance !== undefined ? balance : account.balance)}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
