import React from "react";

const Button = ({ children, variant = "primary", className = "", type = "button", ...props }) => {
  const styles = {
    primary: "btn-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
    secondary: "btn-secondary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
  };

  return (
    <button type={type} className={`${styles[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;