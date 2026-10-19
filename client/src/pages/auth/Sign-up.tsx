import { SignIn } from "@clerk/react";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <SignIn />
    </div>
  );
};

export default SignUpPage;
