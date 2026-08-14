import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAccount } from "../api/accountApi";
import AccountCard from "../components/AccountCard";

const AccountPage = () => {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    const fetchAccountData = async () => {
      setLoading(true);
      setError("");
      try {
        const accountRes = await getAccount(accountId);
        setAccount(accountRes.data);
        setBalance(accountRes.data.balance !== undefined ? accountRes.data.balance : 0);
      } catch (err) {
        console.warn("Backend API failed. Showing mock account details for demo purposes.", err);
        
        const savedOwnerName = localStorage.getItem("mockOwnerName") || "황윤서";
        const savedAccountNumber = localStorage.getItem("mockAccountNumber") || "110123456789";

        // Show demo mockup data according to specified format with string ownerName
        setAccount({
          accountId: parseInt(accountId, 10) || 10,
          accountNumber: savedAccountNumber,
          ownerName: savedOwnerName, // Now ownerName is a string representing name
          status: "ACTIVE",
          balance: 100000,
        });
        setBalance(100000);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId, navigate]);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>내 계좌 대시보드 (계좌 ID: {accountId})</h1>
        <Link to="/create-account" className="btn btn-secondary">
          + 새 계좌 개설
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <AccountCard account={account} balance={balance} loading={loading} />

      {!loading && account && (
        <div className="card">
          <h3 className="card-title">계좌 업무</h3>
          <div className="action-grid">
            <Link to="/deposit" className="btn btn-primary" style={{ padding: "1rem" }}>
              💵 입금하기
            </Link>
            <Link to="/withdraw" className="btn btn-secondary" style={{ padding: "1rem" }}>
              💸 출금하기
            </Link>
            <Link to="/transfer" className="btn btn-secondary" style={{ padding: "1rem" }}>
              🔄 이체하기
            </Link>
            <Link to="/history" className="btn btn-secondary" style={{ padding: "1rem" }}>
              📋 거래내역
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
