import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminOnly = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminOnly;
