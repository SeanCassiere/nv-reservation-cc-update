import React from "react";

const LoadingSubmission: React.FC<{ title: any }> = ({ title }) => {
  return (
    <div style={{ textAlign: "center", margin: "3rem 1rem" }}>
      <p style={{ marginBottom: "5rem", fontSize: "1.5rem", textAlign: "center", width: "100%" }}>
        {title !== "" ? <>{title}</> : <>&nbsp;</>}
      </p>
      <div className="custom-loader mx-auto" />
    </div>
  );
};

export default LoadingSubmission;
