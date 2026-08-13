import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../api/transactionApi";
import TransactionList from "../components/TransactionList";

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const accountId = localStorage.getItem("accountId");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accountId) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getTransactions(accountId);
        setTransactions(response.data || []);
      } catch (err) {
        console.warn("Backend API failed. Using mock transaction data for demo purposes.", err);
        
        // Mock Transactions for testing
        const demoTransactions = [
          {
            id: "tx-1",
            transactionType: "DEPOSIT",
            senderAccountNumber: "-",
            receiverAccountNumber: accountId,
            amount: 100000,
            status: "SUCCESS",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
          },
          {
            id: "tx-2",
            transactionType: "WITHDRAW",
            senderAccountNumber: accountId,
            receiverAccountNumber: "-",
            amount: 20000,
            status: "SUCCESS",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
          },
          {
            id: "tx-3",
            transactionType: "TRANSFER",
            senderAccountNumber: accountId,
            receiverAccountNumber: "110-987-65432",
            amount: 30000,
            status: "SUCCESS",
            createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          },
          {
            id: "tx-4",
            transactionType: "TRANSFER",
            senderAccountNumber: "110-987-65432",
            receiverAccountNumber: accountId,
            amount: 15000,
            status: "SUCCESS",
            createdAt: new Date(Date.now() - 100000).toISOString(), // 1.5 minutes ago
          }
        ];
        
        setTransactions(demoTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [accountId, navigate]);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700" }}>거래 내역 조회</h1>
        <button onClick={() => navigate("/account")} className="btn btn-secondary">
          대시보드로 돌아가기
        </button>
      </div>

      <div className="card" style={{ padding: "1rem" }}>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          계좌번호: <strong style={{ color: "var(--text)" }}>{accountId}</strong> 의 최근 거래내역입니다.
        </p>
        <TransactionList 
          transactions={transactions} 
          loading={loading} 
          currentAccountNumber={accountId} 
        />
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
