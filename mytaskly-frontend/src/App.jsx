import { BrowserRouter , Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./components/authentication/SignUp";
import Login from "./components/authentication/Login";
import Header from "./components/sharePages/Header";
import Footer from "./components/sharePages/Footer";
import Dashboard from "./components/authentication/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
