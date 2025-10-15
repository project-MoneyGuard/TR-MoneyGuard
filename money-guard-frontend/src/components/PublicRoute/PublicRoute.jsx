import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, isLoggedIn }) => {
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;