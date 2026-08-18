import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AccountPage from "../pages/AccountPage";
import AccountCreatePage from "../pages/AccountCreatePage";
import DepositPage from "../pages/DepositPage";
import WithdrawPage from "../pages/WithdrawPage";
import TransferPage from "../pages/TransferPage";
import TransactionHistoryPage from "../pages/TransactionHistoryPage";

// Route guard for authenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Route guard for unauthenticated users
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return <Navigate to="/account" replace />;
  }
  return children;
};

const AppRouter = () => {
  const token = localStorage.getItem("accessToken");

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/account" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      {/* unguarded so both guests and logged-in users can create accounts */}
      <Route
        path="/create-account"
        element={<AccountCreatePage />}
      />
      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <DepositPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <WithdrawPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <TransferPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        }
      />
      {/* Fallback route */}
      <Route
        path="*"
        element={<Navigate to={token ? "/account" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;
