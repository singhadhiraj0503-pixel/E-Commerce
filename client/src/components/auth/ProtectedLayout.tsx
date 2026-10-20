import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped, status } = useAuthStore();
  const location = useLocation();

  if (!isLoaded || (isSignedIn && (!isBootstrapped || status === "loading")))
    return null;

  if (!isSignedIn) {
    return (
      <Navigate
        to={`/sign-in`}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  return <Outlet />;
};

export default ProtectedLayout;
