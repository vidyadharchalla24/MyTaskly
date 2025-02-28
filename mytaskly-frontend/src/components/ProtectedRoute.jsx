import { useContext } from "react";
import { TokenContext } from "../utils/TokenContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { decodedToken } = useContext(TokenContext);

  return decodedToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
