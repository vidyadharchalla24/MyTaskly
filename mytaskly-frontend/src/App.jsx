import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/sharePages/Layout";
import LandingPage from "./components/LandingPage";
import Signup from "./components/authentication/SignUp";
import Login from "./components/authentication/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import VerifyOtp from "./components/forgotPassword/verifyOtp";
import ResetPassword from "./components/forgotPassword/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Organization from "./components/Organization";
import { useEffect } from "react";
import { setAxiosInterceptors } from "./utils/api";


export default function App() {

  const navigate = useNavigate();

  useEffect(()=>{
    setAxiosInterceptors(()=> navigate('/login'));
  },[navigate]);

  return (
    
    <>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
         
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/organization" element={<Organization/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
