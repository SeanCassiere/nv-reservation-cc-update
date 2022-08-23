import React, { useId } from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
}

const TextInput: React.FC<Props> = ({ id, label, errorText, className, ...inputProps }) => {
  const elementId = useId();

  const classNames = cn("w-full", "rounded", className);

  return (
    <div className="">
      {label && (
        <div className="block">
          <label htmlFor={id ?? elementId}>{label}</label>
        </div>
      )}
      <input id={id ?? elementId} className={classNames} {...inputProps} />
      {errorText && <span className="block">{errorText}</span>}
    </div>
  );
};

export default TextInput;
