import React from "react";
import clsx from "clsx";
import { cva, VariantProps } from "class-variance-authority";

import { ExclamationIcon, SuccessIcon } from "../../Icons";

const alertStyles = cva(["my-2", "p-4", "border-l-4", "rounded", "text-sm", "font-medium"], {
  variants: {
    fullWidth: { true: ["w-full"], false: [] },
    color: {
      success: ["bg-green-50", "text-green-600", "border-green-600"],
      warning: ["bg-yellow-50", "text-yellow-500", "border-yellow-500"],
      danger: ["bg-red-50", "text-red-600", "border-red-600"],
    },
  },
  defaultVariants: {
    fullWidth: false,
    color: "warning",
  },
});

interface CustomAlertProps {
  children?: React.ReactNode;
  className?: string;
}

type AlertProps = CustomAlertProps & VariantProps<typeof alertStyles>;

const Alert: React.FC<AlertProps> = ({ children, fullWidth, color: variant, className }) => {
  return (
    <div className={clsx(alertStyles({ fullWidth, color: variant }), className)}>
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
