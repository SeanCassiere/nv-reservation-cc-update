import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSubmission = ({ title }) => {
	return (
		<div style={{ textAlign: "center", margin: "3rem 1rem" }}>
			<p style={{ marginBottom: "5rem", fontSize: "1.5rem", textAlign: "center", width: "100%" }}>{title}</p>
			<Spinner animation='border' role='status' style={{ width: "200px", height: "200px", borderWidth: "thick" }} />
		</div>
	);
};

export default LoadingSubmission;
