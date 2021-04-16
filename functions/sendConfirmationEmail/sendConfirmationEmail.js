// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const handler = async (event) => {
	const { email } = event.queryStringParameters;

	const msg = {
		to: `${email}`, // Change to your recipient,
		from: "sean@navotar.com", // Change to your verified sender
		subject: "Sending with SendGrid is Fun",
		html: "<strong>and easy to do anywhere, even with Node.js</strong>",
	};

	try {
		await sgMail.send(msg);
		console.log(`Email sent to ${email}`);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: msg }),
			// // more keys you can return:
			// headers: { "headerName": "headerValue", ... },
			// isBase64Encoded: true,
		};
	} catch (error) {
		return { statusCode: 500, body: error.toString() };
	}
};

module.exports = { handler };
