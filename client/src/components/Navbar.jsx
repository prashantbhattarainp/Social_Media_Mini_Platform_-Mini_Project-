import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiHome, FiLogIn, FiLogOut, FiMenu, FiMoon, FiPlusCircle, FiSun, FiUser, FiUserPlus, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

const linkClass = ({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link");

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isDarkMode, toggleTheme } = useUI();
  const { isAuthenticated, logout, user, getErrorMessage } = useAuth();

  const navItems = [
    { to: "/", label: "Home", icon: FiHome, end: true },
    ...(isAuthenticated
      ? [
          { to: "/create", label: "Create", icon: FiPlusCircle },
          { to: "/profile", label: "Profile", icon: FiUser },
        ]
      : []),
  ];

  const initials = (user?.name || user?.username || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      setLogoutError("");
      await logout();
      setOpen(false);
    } catch (error) {
      setLogoutError(getErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-900/20 dark:bg-slate-200 dark:text-slate-900 dark:shadow-slate-100/10">
            MS
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-slate-950 dark:text-slate-100">MiniSocial</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Interactive social space</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} className={linkClass} end={end}>
              <span className="inline-flex items-center gap-2">
                <Icon />
                <span>{label}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-button"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-200 dark:text-slate-900">
                  {initials}
                </span>
                <span className="max-w-[120px] truncate">{user?.handle || `@${user?.username || "user"}`}</span>
              </Link>

              <button type="button" onClick={handleLogout} className="btn-secondary" disabled={isLoggingOut}>
                <span className="inline-flex items-center gap-2">
                  <FiLogOut />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                <span className="inline-flex items-center gap-2">
                  <FiLogIn />
                  Log in
                </span>
              </Link>
              <Link to="/register" className="btn-primary">
                <span className="inline-flex items-center gap-2">
                  <FiUserPlus />
                  Register
                </span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-2" aria-label="Mobile navigation">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)} end={end}>
                <span className="inline-flex items-center gap-2">
                  <Icon />
                  <span>{label}</span>
                </span>
              </NavLink>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-200 dark:text-slate-900">
                    {initials}
                  </span>
                  <span>{user?.handle || `@${user?.username || "user"}`}</span>
                </Link>
                <button type="button" onClick={handleLogout} className="btn-secondary w-full" disabled={isLoggingOut}>
                  <span className="inline-flex items-center justify-center gap-2">
                    <FiLogOut />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <FiLogIn />
                    Log in
                  </span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <FiUserPlus />
                    Register
                  </span>
                </Link>
              </>
            )}

            <button type="button" onClick={toggleTheme} className="icon-button">
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>
      )}

      {logoutError ? (
        <div className="mx-auto w-full max-w-7xl px-4 pb-3 sm:px-6 lg:px-8">
          <p className="alert-error px-3 py-2 text-sm">{logoutError}</p>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;