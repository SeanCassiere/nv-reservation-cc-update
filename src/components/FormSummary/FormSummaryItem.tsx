import React from "react";
import { PencilIcon } from "../Icons";

type Props = {
  title: string;
  children?: React.ReactNode;
  onEdit?: () => void;
};

const FormSummaryItem: React.FC<Props> = ({ title, children, onEdit }) => {
  return (
    <div className="mt-1 border border-b-0 border-l-0 border-r-0 border-gray-100 py-3">
      <div className="flex flex-row items-center">
        {title && (typeof title === "string" || typeof title !== "number") && (
          <h3 className="text-md flex-1 font-medium text-gray-600">{title}</h3>
        )}
        {onEdit && (
          <button type="button" className="p-1" onClick={onEdit}>
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormSummaryItem;
