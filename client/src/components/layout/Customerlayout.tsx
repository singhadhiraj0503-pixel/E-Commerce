import React from "react";
import { Outlet } from "react-router-dom";
import CustomerNavbar from "../customer/common/DesktopNavbar";

const Customerlayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomerNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Customerlayout;
