import { useId } from "react";
import clsx from "clsx";

import { ExclamationIcon } from "@/components/Icons";
import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextInputProps extends InputProps {
  label: string | number;
  required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ label, ...inputProps }) => {
  const elementId = useId();

  return (
    <div>
      <Label htmlFor={elementId}>{label}</Label>
      <Input id={elementId} {...inputProps} />
    </div>
  );
};

interface SelectInputProps
  extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  isError?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  helperText,
  children,
  isError,
  className,
  ...selectProps
}) => {
  const elementId = useId();

  return (
    <div>
      {label && (
        <label htmlFor={id ?? elementId} className="block select-none text-sm font-medium text-gray-700">
          {label}
          {selectProps.required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div className="relative mt-1">
        <select
          id={id ?? elementId}
          className={clsx(
            "block",
            "w-full",
            "sm:text-sm",
            "rounded",
            "border-gray-300",
            "focus:ring-slate-500",
            "focus:border-slate-500",
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex select-none items-center pr-8">
            <ExclamationIcon className="text-red-500" />
          </div>
        )}
      </div>
      {helperText && (
        <span className={clsx("mt-2", "text-sm", { "text-gray-500": !isError, "text-red-600": isError })}>
          {helperText}
        </span>
      )}
    </div>
  );
};

interface CheckInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: React.ReactNode;
  isError?: boolean;
  helperText?: React.ReactNode;
}

export const CheckInput: React.FC<CheckInputProps> = ({ id, label, helperText, className, ...inputProps }) => {
  const elementId = useId();

  return (
    <div className="flex h-5 items-center">
      <input
        id={id ?? elementId}
        className={clsx(
          "w-4",
          "h-4",
          "rounded",
          "text-slate-700",
          "border-gray-300",
          "focus:ring-slate-600",
          className
        )}
        {...inputProps}
      />
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor={id ?? elementId} className="select-none font-medium text-gray-700">
            {label}
          </label>
        </div>
      )}
      {helperText && <span className="block">{helperText}</span>}
    </div>
  );
};
