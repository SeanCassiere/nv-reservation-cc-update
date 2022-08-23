import React from "react";
import cn from "classnames";

type Props = {
  children?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "success" | "warning";
};

const Alert: React.FC<Props> = ({ children, fullWidth = false, variant = "warning" }) => {
  const classNames = cn(
    "my-2",
    "py-2",
    "px-3",
    "rounded",
    "text-sm",
    "border-2",
    { "w-full": fullWidth },
    {
      "bg-amber-100": variant === "warning",
      "text-amber-800": variant === "warning",
      "border-amber-500": variant === "warning",
    },
    {
      "bg-green-100": variant === "success",
      "text-green-800": variant === "success",
      "border-green-500": variant === "success",
    }
  );

  return <div className={classNames}>{children}</div>;
};

export default Alert;
