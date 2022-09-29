import React, { useId } from "react";
import classNames from "classnames";

import { ExclamationIcon } from "../../Icons";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  isError?: boolean;
}

const SelectInput: React.FC<Props> = ({ id, label, helperText, children, isError, className, ...selectProps }) => {
  const elementId = useId();

  return (
    <div>
      {label && (
        <label htmlFor={id ?? elementId} className="block text-sm font-medium text-gray-700">
          {label}
          {selectProps.required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div className="relative mt-1">
        <select
          id={id ?? elementId}
          className={classNames(
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
          )}
          {...selectProps}
        >
          {children}
        </select>
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
            <ExclamationIcon className="text-red-500" />
          </div>
        )}
      </div>
      {helperText && (
        <span className={classNames("mt-2", "text-sm", { "text-gray-500": !isError, "text-red-600": isError })}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
