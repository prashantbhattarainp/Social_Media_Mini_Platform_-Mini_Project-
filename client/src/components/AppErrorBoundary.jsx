import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected runtime error",
    };
  }

  componentDidCatch(error) {
    console.error("[AppErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
          <div className="glass-card w-full p-6 sm:p-8">
            <p className="hero-pill w-fit">Runtime error</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-3xl">
              The app hit an error instead of rendering.
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-6"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
