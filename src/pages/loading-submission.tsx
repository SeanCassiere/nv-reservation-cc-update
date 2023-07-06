import React from "react";

import CardLayout from "@/components/card-layout";

const LoadingSubmission: React.FC<{ title: any }> = ({ title }) => {
  return (
    <CardLayout title={typeof title === "string" ? title : " "}>
      <div className="mb-16 mt-16 h-full w-full">
        <div className="custom-loader mx-auto" />
      </div>
    </CardLayout>
  );
};

export default LoadingSubmission;
