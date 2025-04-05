//scr/App.jsx
import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import RegisterCustomerPage from "./pages/CustomerRegister";
import RegisterAgentPage from "./pages/AgentRegister";
import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import HomePage from "./pages/Home";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import './App.css'
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Payment from "./pages/Payment";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (

      <>
      <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/customer" element={<RegisterCustomerPage />} />
          <Route path="/register/agent" element={<RegisterAgentPage />} />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/agent"
            element={
              <ProtectedRoute role="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/:bookingId" element={<Payment/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
   
  );
}

export default App;