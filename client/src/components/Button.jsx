import React from "react";

const Button = ({ children, variant = "primary", className = "", type = "button", ...props }) => {
  const styles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
  };

  return (
    <button type={type} className={`${styles[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;