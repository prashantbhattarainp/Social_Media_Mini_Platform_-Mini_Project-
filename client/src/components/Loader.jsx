import React from "react";

const Loader = ({ label = "Loading" }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-slate-600 dark:text-slate-300">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default Loader;