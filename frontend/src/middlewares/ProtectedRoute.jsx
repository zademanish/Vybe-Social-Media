import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { userData} = useSelector((state) => state.user);

  // Still fetching current user → show loader
  

  // Not logged in → redirect to signin
  if (!userData) {
    return <Navigate to="/signin" replace />;
  }

  // Authenticated → render the protected page
  return children; 
};

export default ProtectedRoute;
