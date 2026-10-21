import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/common/AdminSidebar";
import { UserButton } from "@clerk/react";
import { ModeToggle } from "../mode-toggle";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-secondary/45">
      <div className="min-h-screen flex">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 h-16 flex items-center gap-4 border-b border-border px-4 backdrop-blur lg:px-6">
            <div className="ml-auto flex items-center gap-5">
              <ModeToggle />
              <UserButton />
            </div>
          </header>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
