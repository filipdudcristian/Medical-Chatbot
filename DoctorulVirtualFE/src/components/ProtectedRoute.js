import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  
  console.log("Check user in Private: ", user);
  if (Object.keys(user).length === 0) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
