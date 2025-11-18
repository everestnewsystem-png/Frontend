import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRoutes = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/home" replace />;

  return <Outlet />;
};

export default AuthRoutes;
