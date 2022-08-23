import React, { useId } from "react";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
  errorText?: React.ReactNode;
}

const CheckInput: React.FC<Props> = ({ id, label, errorText, ...inputProps }) => {
  const elementId = useId();

  return (
    <div className="">
      <input id={id ?? elementId} {...inputProps} />
      {label && (
        <label htmlFor={id ?? elementId} className="ml-2">
          {label}
        </label>
      )}
      {errorText && <span className="block">{errorText}</span>}
    </div>
  );
};

export default CheckInput;
