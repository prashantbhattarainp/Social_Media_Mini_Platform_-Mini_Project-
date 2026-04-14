import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const MainLayout = ({ user, users, stats, setCurrentUser }) => {
  return (
    <div className="min-h-screen">
      <Navbar user={user} users={users} stats={stats} setCurrentUser={setCurrentUser} />
      <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;