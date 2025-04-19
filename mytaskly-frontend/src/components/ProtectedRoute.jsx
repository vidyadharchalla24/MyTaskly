import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const status = localStorage.getItem("status");
  const location = useLocation();

  const publicPages = ["/upgrade-plan", "/payment-page"];

  if (!token) return <Navigate to="/login" />;

  // Allow upgrade/payment pages even if not ACTIVE
  if (status !== "ACTIVE" && !publicPages.includes(location.pathname)) {
    return <Navigate to="/upgrade-plan" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
