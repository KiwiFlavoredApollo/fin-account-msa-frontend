import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAccount } from "../api/accountApi";
import AccountCard from "../components/AccountCard";
import DepositPage from "./DepositPage";
import WithdrawPage from "./WithdrawPage";
import TransferPage from "./TransferPage";
import TransactionHistoryPage from "./TransactionHistoryPage";

const AccountPage = () => {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTask, setActiveTask] = useState(null); // 'deposit' | 'withdraw' | 'transfer' | 'history'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleReset = () => {
      setActiveTask(null);
    };
    window.addEventListener("reset-account-view", handleReset);
    return () => window.removeEventListener("reset-account-view", handleReset);
  }, []);

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
  }, [accountId, navigate, refreshTrigger]);

  const handleTaskComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTask(null);
  };

  const handleTaskCancel = () => {
    setActiveTask(null);
  };

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
        <>
          <div className="card" style={{ marginBottom: activeTask ? "0rem" : "1.5rem" }}>
            <h3 className="card-title">계좌 업무</h3>
            <div className="action-grid">
              <button
                onClick={() => setActiveTask(activeTask === "deposit" ? null : "deposit")}
                className={`btn ${activeTask === "deposit" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "1rem" }}
              >
                💵 입금하기
              </button>
              <button
                onClick={() => setActiveTask(activeTask === "withdraw" ? null : "withdraw")}
                className={`btn ${activeTask === "withdraw" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "1rem" }}
              >
                💸 출금하기
              </button>
              <button
                onClick={() => setActiveTask(activeTask === "transfer" ? null : "transfer")}
                className={`btn ${activeTask === "transfer" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "1rem" }}
              >
                🔄 이체하기
              </button>
              <button
                onClick={() => setActiveTask(activeTask === "history" ? null : "history")}
                className={`btn ${activeTask === "history" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "1rem" }}
              >
                📋 거래내역
              </button>
            </div>
          </div>

          {activeTask === "deposit" && (
            <DepositPage
              isInline={true}
              onComplete={handleTaskComplete}
              onCancel={handleTaskCancel}
            />
          )}
          {activeTask === "withdraw" && (
            <WithdrawPage
              isInline={true}
              onComplete={handleTaskComplete}
              onCancel={handleTaskCancel}
            />
          )}
          {activeTask === "transfer" && (
            <TransferPage
              isInline={true}
              onComplete={handleTaskComplete}
              onCancel={handleTaskCancel}
            />
          )}
          {activeTask === "history" && (
            <TransactionHistoryPage
              isInline={true}
              onCancel={handleTaskCancel}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AccountPage;