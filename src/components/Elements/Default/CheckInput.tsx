import React, { useId } from "react";
import classNames from "classnames";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
  isError?: boolean;
  helperText?: React.ReactNode;
}

const CheckInput: React.FC<Props> = ({ id, label, helperText, className, ...inputProps }) => {
  const elementId = useId();

  return (
    <div className="flex h-5 items-center">
      <input
        id={id ?? elementId}
        className={classNames(
          "w-4",
          "h-4",
          "rounded",
          "text-indigo-600",
          "border-gray-300",
          "focus:ring-indigo-600",
          className
        )}
        {...inputProps}
      />
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor={id ?? elementId} className="font-medium text-gray-700">
            {label}
          </label>
        </div>
      )}
      {helperText && <span className="block">{helperText}</span>}
    </div>
  );
};

export default CheckInput;
