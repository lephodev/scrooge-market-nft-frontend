import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/authContext"

function ProtectedRoute({ component: RouteComponent }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user && location.pathname === "/login") {
    return <Navigate to={`/`} />;
  }

  if (user) {
    return RouteComponent;
  }
  return <Navigate to="/login" />;
}

export default ProtectedRoute;