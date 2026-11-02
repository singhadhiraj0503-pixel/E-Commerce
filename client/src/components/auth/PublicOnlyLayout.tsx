import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import CommonLoader from "../common/Loader";

const PublicOnlyLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped, status } = useAuthStore();

  if (!isLoaded) return null;

  if (isSignedIn && (isBootstrapped || status === "loading")) {
    return <CommonLoader />;
  }

  if (isSignedIn) {
    return <Navigate to={"/profile"} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyLayout;
