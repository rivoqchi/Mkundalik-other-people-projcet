import { Navigate, Outlet } from 'react-router-dom';
import { fetchRole } from '../Auth/CheckAuth';
import React from 'react';

const ProtectedRoute = ({ allowedRoles }) => {
  const [role, setRole] = React.useState(null);
  console.log(role);
  
  React.useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await fetchRole();
      setRole(userRole);
      
    };
    fetchUserRole();
    
  }, []);

  if (role === null) {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/not-allowed" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;