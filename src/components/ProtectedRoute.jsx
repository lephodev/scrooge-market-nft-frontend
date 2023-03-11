import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/authContext"

function ProtectedRoute({ component: RouteComponent }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (user && location.pathname === "/login") {
    return <Navigate to={`/`} />;
  }

  if (user || loading) {
    return RouteComponent;
  }
  console.log("redirecting", loading, user)
  return <Navigate to="/login" />;
}

export default ProtectedRoute;