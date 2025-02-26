import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../utils/TokenContext";

const ProtectedRoute = () => {
  const { decodedToken } = useContext(TokenContext);

  return decodedToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
