import React, { useId } from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
}

const CheckInput: React.FC<Props> = ({ id, label, errorText, className, ...inputProps }) => {
  const elementId = useId();

  const classNames = cn(
    "w-4",
    "h-4",
    "text-blue-600",
    "bg-gray-100",
    "rounded",
    "border-gray-300",
    "focus:ring-blue-500",
    className
  );

  return (
    <div className="">
      <input id={id ?? elementId} className={classNames} {...inputProps} />
      {label && (
        <label htmlFor={id ?? elementId} className="ml-2 text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      {errorText && <span className="block">{errorText}</span>}
    </div>
  );
};

export default CheckInput;
