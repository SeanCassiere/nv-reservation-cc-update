import React, { useId } from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
  isError?: boolean;
  helperText?: React.ReactNode;
}

const CheckInput: React.FC<Props> = ({ id, label, helperText, className, ...inputProps }) => {
  const elementId = useId();

  const classNames = cn(
    "w-4",
    "h-4",
    "rounded",
    "text-indigo-600",
    "border-gray-300",
    "focus:ring-indigo-600",
    className
  );

  return (
    <div className="flex items-center h-5">
      <input id={id ?? elementId} className={classNames} {...inputProps} />
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor={id ?? elementId} className="text-gray-700 font-medium">
            {label}
          </label>
        </div>
      )}
      {helperText && <span className="block">{helperText}</span>}
    </div>
  );
};

export default CheckInput;
