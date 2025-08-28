import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  if (userData) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;
