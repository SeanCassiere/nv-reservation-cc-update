import React, { useId } from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
}

const SelectInput: React.FC<Props> = ({ id, label, errorText, children, className, ...selectProps }) => {
  const elementId = useId();

  const classNames = cn(
    "w-full",
    "rounded",
    "bg-gray-50",
    "border",
    "border-gray-300",
    "text-gray-900",
    "text-sm",
    "focus:ring-blue-500",
    "focus:border-blue-500",
    { "bg-red-50": errorText, "border-red-500": errorText },
    className
  );

  return (
    <div className="">
      {label && (
        <div className="block mb-1 text-sm text-gray-600">
          <label htmlFor={id ?? elementId}>{label}</label>
        </div>
      )}
      <select id={id ?? elementId} className={classNames} {...selectProps}>
        {children}
      </select>
      {errorText && <span className="block mt-1 text-xs text-red-500">{errorText}</span>}
    </div>
  );
};

export default SelectInput;
