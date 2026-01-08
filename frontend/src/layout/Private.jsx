import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/authProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { role } = useAuth();
  const token = localStorage.getItem("authToken");

  // not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
