import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/sharePages/Layout";
import LandingPage from "./components/LandingPage";
import Signup from "./components/authentication/SignUp";
import Login from "./components/authentication/Login";
import Dashboard from "./components/authentication/Dashboard";
import Profile from "./components/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap all routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
