import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 6;

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, register, getErrorMessage } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!username || !email || !password) {
      setError("Username, email and password are required.");
      return;
    }

    if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
      setError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ username, email, password });
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-card p-6 sm:p-8">
        <p className="hero-pill w-fit">Create account</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Register</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Start posting and interacting in your feed.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="input-field"
              value={form.username}
              onChange={handleChange}
              placeholder="john_doe"
              required
              minLength={MIN_USERNAME_LENGTH}
              maxLength={MAX_USERNAME_LENGTH}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={128}
            />
          </div>

          {error ? (
            <p className="alert-error px-3 py-2 text-sm">{error}</p>
          ) : null}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link className="font-semibold text-slate-900 underline underline-offset-4 dark:text-slate-100" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;