import React from "react";
import { Card } from "react-bootstrap";

import NotFoundImg from "../assets/undraw_page_not_found_su7k.svg";

const QueryStringNotPasses = () => {
	return (
		<Card border='light' style={{ width: "100%", padding: "2rem 1rem" }}>
			<Card.Img variant='top' alt='Not Found' src={NotFoundImg} />
			<Card.Body>
				<Card.Title>Uh-Oh</Card.Title>
				<Card.Text>
					It looks like all the necessary information was sent.
					<br />
					Please report to&nbsp;
					<a href='mailto:support@navotar.com' target='_blank' rel='noreferrer'>
						support@navotar.com
					</a>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default QueryStringNotPasses;
