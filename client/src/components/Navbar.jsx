import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const linkClass = ({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link");

const Navbar = ({ user, users, stats, setCurrentUser }) => {
  const [open, setOpen] = useState(false);

  const handleUserChange = (name) => {
    const selectedUser = users.find((candidate) => candidate.name === name);
    if (selectedUser) setCurrentUser(selectedUser);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
            MS
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-slate-950">MiniSocial</p>
            <p className="text-xs text-slate-500">Clean social feed</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Create
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <div className="text-right space-y-2">
              <div>
                <p className="text-sm font-semibold text-slate-950">{user.name}</p>
                <p className="text-xs text-slate-500">{stats.posts} posts</p>
              </div>
              <select
                value={user.name}
                onChange={(event) => handleUserChange(event.target.value)}
                className="w-36 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
              >
                {users.map((account) => (
                  <option key={account.name} value={account.name}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
            {user?.avatar || "U"}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Menu</span>
          <span className="text-xl">☰</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)} end>
              Home
            </NavLink>
            <NavLink to="/create" className={linkClass} onClick={() => setOpen(false)}>
              Create
            </NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
              Profile
            </NavLink>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Switch account</p>
              <select
                value={user?.name || ""}
                onChange={(event) => handleUserChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
              >
                {users.map((account) => (
                  <option key={account.name} value={account.name}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;