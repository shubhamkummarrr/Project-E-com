import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { access_token } = useSelector((state) => state.auth);

  if (!access_token) {
    alert("⚠️ You are not authorized! Please login first.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
