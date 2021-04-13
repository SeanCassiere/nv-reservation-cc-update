import React from "react";
import { Card } from "react-bootstrap";

import NotFoundImg from "../assets/undraw_page_not_found_su7k.svg";

const QueryStringNotPasses = ({ lang, translate }) => {
	return (
		<Card border='light' style={{ width: "100%", padding: "2rem 1rem" }}>
			<Card.Img variant='top' alt='Not Found' src={NotFoundImg} />
			<Card.Body>
				<Card.Title>{translate[lang].query_missing.title}</Card.Title>
				<Card.Text>
					{translate[lang].query_missing.message}
					<br />
					{translate[lang].query_missing.report}&nbsp;
					<a href='mailto:support@navotar.com' target='_blank' rel='noreferrer'>
						support@navotar.com
					</a>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default QueryStringNotPasses;
