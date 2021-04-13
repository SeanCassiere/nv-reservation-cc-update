import React from "react";
import { Card } from "react-bootstrap";

import NotFoundImg from "../assets/undraw_page_not_found_su7k.svg";

const QueryStringNotPasses = () => {
	return (
		<Card style={{ width: "25em" }}>
			<Card.Img variant='top' alt='Not Found' src={NotFoundImg} />
			<Card.Body>
				<Card.Title>Uh-Oh</Card.Title>
				<Card.Text>
					<p>It looks like all the necessary information was not sent.</p>
					<p>
						Please report this issue to&nbsp;
						<a href='mailto:support@navotar.com' target='_blank' rel='noreferrer'>
							support@navotar.com
						</a>
					</p>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default QueryStringNotPasses;
