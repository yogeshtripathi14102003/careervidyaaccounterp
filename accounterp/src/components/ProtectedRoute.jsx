import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  
  // 1. LocalStorage se token aur role nikaalein (Jo LoginPage mein save kiye the)
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // 2. Agar token nahi hai (User logged in nahi hai)
  if (!token) {
    // User ko login par bhejein aur purana path 'state' mein rakhein taaki wapas aa sake
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Check
  // Agar allowedRoles diya hai aur user ka role usme nahi hai
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`Access Denied: Role '${userRole}' is not authorized for this route.`);
    
    // Unauthorized user ko home ya kisi aur page par bhej dein
    return <Navigate to="/" replace />;
  }

  // Sab sahi hai toh component dikhayein
  return children;
};

export default ProtectedRoute;