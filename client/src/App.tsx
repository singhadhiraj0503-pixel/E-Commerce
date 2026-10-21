import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useBootstrapAuth } from "./features/auth/useBootstrapAuth";

const App = () => {
  useBootstrapAuth();

  return <RouterProvider router={router} />;
};

export default App;
