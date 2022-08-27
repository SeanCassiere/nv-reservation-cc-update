import React from "react";
import cn from "classnames";

import { ExclamationIcon, SuccessIcon } from "../Icons";

type Props = {
  children?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "success" | "warning" | "danger";
  className?: string;
};

const Alert: React.FC<Props> = ({ children, fullWidth = false, variant = "warning", className }) => {
  const classNames = cn(
    "my-2",
    "p-4",
    "border-l-4",
    "rounded",
    "text-sm",
    "font-medium",
    { "w-full": fullWidth },
    {
      "bg-yellow-50": variant === "warning",
      "text-yellow-500": variant === "warning",
      "border-yellow-500": variant === "warning",
    },
    {
      "bg-green-50": variant === "success",
      "text-green-600": variant === "success",
      "border-green-600": variant === "success",
    },
    {
      "bg-red-50": variant === "danger",
      "text-red-600": variant === "danger",
      "border-red-600": variant === "danger",
    },
    className
  );

  return (
    <div className={classNames}>
      <div className="flex">
        <div className="flex-shrink-0">
          {variant === "danger" && <ExclamationIcon />}
          {variant === "warning" && <ExclamationIcon />}
          {variant === "success" && <SuccessIcon />}
        </div>
        <div className="ml-3">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
