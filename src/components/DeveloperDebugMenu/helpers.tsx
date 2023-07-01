import { useId } from "react";

import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends InputProps {
  label: string | number;
  required?: boolean;
}

export const TextInput: React.FC<Props> = ({ label, ...inputProps }) => {
  const elementId = useId();

  return (
    <div>
      <Label htmlFor={elementId}>{label}</Label>
      <Input id={elementId} {...inputProps} />
    </div>
  );
};
