// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const sgMail = require("@sendgrid/mail");

const { SG_API_KEY, SG_FROM_EMAIL, SG_TEMPLATE_ID } = process.env;

sgMail.setApiKey(SG_API_KEY);

const handler = async (event) => {
	const { customerEmail, reservationNo } = event.queryStringParameters;

	const msg = {
		to: `${customerEmail}`, // Change to your recipient,
		from: SG_FROM_EMAIL, // Change to your verified sender
		subject: `Credit Card added to your reservation (${reservationNo})`,
		html: `<strong>Card added to your reservation (${reservationNo})</strong>`,
		templateId: SG_TEMPLATE_ID,
		dynamic_template_data: {
			reservationNo,
		},
	};

	try {
		await sgMail.send(msg);
		console.log(`Email sent to ${customerEmail}`);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: "success", customerEmail, fromEmail: SG_FROM_EMAIL }),
		};
	} catch (error) {
		return { statusCode: 500, body: error.toString() };
	}
};

module.exports = { handler };