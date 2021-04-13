import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSubmission = () => {
	return (
		<div style={{ textAlign: "center", margin: "3rem" }}>
			<Spinner animation='border' role='status' style={{ width: "200px", height: "200px", borderWidth: "thick" }} />
		</div>
	);
};

export default LoadingSubmission;
