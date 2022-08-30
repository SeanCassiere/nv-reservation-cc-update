import React, { useId } from "react";
import cn from "classnames";

import { ExclamationIcon } from "../../Icons";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  isError?: boolean;
}

const SelectInput: React.FC<Props> = ({ id, label, helperText, children, isError, className, ...selectProps }) => {
  const elementId = useId();

  const inputClassNames = cn(
    "block",
    "w-full",
    "sm:text-sm",
    "rounded",
    "border-gray-300",
    "focus:ring-indigo-500",
    "focus:border-indigo-500",
    {
      "bg-red-50": isError,
      "border-red-300": isError,
      "text-red-900": isError,
      "focus:outline-none": isError,
      "focus:ring-red-500": isError,
      "focus:border-red-500": isError,
      "placeholder-red-400": isError,
    },
    className
  );

  const helperClassNames = cn("mt-2", "text-sm", { "text-gray-500": !isError, "text-red-600": isError });

  return (
    <div>
      {label && (
        <label htmlFor={id ?? elementId} className="block text-sm font-medium text-gray-700">
          {label}
          {selectProps.required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div className="mt-1 relative">
        <select id={id ?? elementId} className={inputClassNames} {...selectProps}>
          {children}
        </select>
        {isError && (
          <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
            <ExclamationIcon className="text-red-500" />
          </div>
        )}
      </div>
      {helperText && <span className={helperClassNames}>{helperText}</span>}
    </div>
  );
};

export default SelectInput;
