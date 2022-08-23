import React from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  uppercase?: boolean;
}

const Button: React.FC<Props> = ({
  children,
  className,
  variant = "primary",
  fullWidth = true,
  size = "md",
  uppercase = false,
  ...buttonProps
}) => {
  const buttonClasses = cn(
    className,
    {
      "py-3": size === "lg",
      "px-4": size === "lg",
      "text-lg": size === "lg",
    },
    {
      "py-2.5": size === "md",
      "px-3": size === "md",
      "text-base": size === "md",
    },
    {
      "py-1.5": size === "sm",
      "px-2": size === "sm",
      "text-sm": size === "sm",
    },
    "rounded",
    "font-medium",
    "transition-colors",
    { "w-full": fullWidth, uppercase: uppercase },
    {
      "bg-teal-400": variant === "primary",
      "text-white": variant === "primary",
      "hover:bg-teal-500": variant === "primary",
    },
    {
      "bg-sky-600": variant === "secondary",
      "text-white": variant === "secondary",
      "hover:bg-sky-700": variant === "secondary",
    },
    { "bg-teal-800": variant === "success" },
    {
      "bg-red-600": variant === "danger",
      "text-white": variant === "danger",
      "hover:bg-red-700": variant === "danger",
    },
    {
      "bg-amber-500": variant === "warning",
      "text-white": variant === "warning",
      "hover:bg-amber-600": variant === "warning",
    }
  );

  return (
    <button className={buttonClasses} {...buttonProps}>
      {children}
    </button>
  );
};

export default Button;
