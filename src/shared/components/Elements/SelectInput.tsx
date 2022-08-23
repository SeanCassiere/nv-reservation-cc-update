import React, { useId } from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
}

const SelectInput: React.FC<Props> = ({ id, label, errorText, children, className, ...selectProps }) => {
  const elementId = useId();

  const classNames = cn("w-full", "rounded", className);

  return (
    <div className="">
      {label && (
        <div className="block">
          <label htmlFor={id ?? elementId}>{label}</label>
        </div>
      )}
      <select id={id ?? elementId} className={classNames} {...selectProps}>
        {children}
      </select>
      {errorText && <span className="block">{errorText}</span>}
    </div>
  );
};

export default SelectInput;
