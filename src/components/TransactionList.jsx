import React from "react";

const TransactionList = ({ transactions, loading, currentAccountNumber }) => {
  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>거래 내역을 불러오는 중...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>거래 내역이 존재하지 않습니다.</div>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR");
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
      case "success":
        return <span className="badge badge-success">성공</span>;
      case "FAILED":
      case "failed":
        return <span className="badge badge-error">실패</span>;
      default:
        return <span className="badge badge-warning">{status || "대기"}</span>;
    }
  };

  const getTransactionTypeBadge = (type, tx) => {
    let typeName = type;
    let badgeClass = "badge-warning";

    if (type === "DEPOSIT" || type === "deposit") {
      typeName = "입금";
      badgeClass = "badge-success";
    } else if (type === "WITHDRAW" || type === "withdraw") {
      typeName = "출금";
      badgeClass = "badge-error";
    } else if (type === "TRANSFER" || type === "transfer") {
      if (currentAccountNumber && tx.senderAccountNumber === currentAccountNumber) {
        typeName = "송금(이체출금)";
        badgeClass = "badge-error";
      } else if (currentAccountNumber && tx.receiverAccountNumber === currentAccountNumber) {
        typeName = "수신(이체입금)";
        badgeClass = "badge-success";
      } else {
        typeName = "이체";
        badgeClass = "badge-warning";
      }
    }

    return <span className={`badge ${badgeClass}`}>{typeName}</span>;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>거래유형</th>
            <th>보낸 계좌</th>
            <th>받는 계좌</th>
            <th>거래금액</th>
            <th>상태</th>
            <th>거래시간</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id || tx.transactionId}>
              <td>{getTransactionTypeBadge(tx.transactionType || tx.type, tx)}</td>
              <td>{tx.senderAccountNumber || tx.fromAccount || "-"}</td>
              <td>{tx.receiverAccountNumber || tx.toAccount || "-"}</td>
              <td style={{ fontWeight: "600" }}>
                {formatCurrency(tx.amount)}
              </td>
              <td>{getStatusBadge(tx.status)}</td>
              <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {formatDate(tx.createdAt || tx.timestamp || tx.dateTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
