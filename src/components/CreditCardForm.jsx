import React, { useState } from "react";

import DynamicCreditCard from "./DynamicCreditCard";

const CreditCardForm = ({ ccData, handleChange, handleSubmit }) => {
	const [focus, setFocus] = useState("");

	function handleFocus(e) {
		if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
			setFocus("expiry");
		} else {
			setFocus(e.target.name);
		}
	}

	function handleBlur(e) {
		setFocus("");
	}

	return (
		<>
			<DynamicCreditCard
				cvc={ccData.cvc}
				expiryMonth={ccData.monthExpiry}
				expiryYear={ccData.yearExpiry}
				name={ccData.name}
				number={ccData.number}
				focused={focus}
			/>
			<form onSubmit={handleSubmit}>
				<table>
					<thead>
						<tr>
							<th>Label</th>
							<th>Input</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Card Number</td>
							<td>
								<input
									type='number'
									name='number'
									value={ccData.number}
									onChange={handleChange}
									onFocus={handleFocus}
									onBlur={handleBlur}
									required
								/>
							</td>
						</tr>
						<tr>
							<td>Name on Card</td>
							<td>
								<input
									type='text'
									name='name'
									value={ccData.name}
									onChange={handleChange}
									onFocus={handleFocus}
									onBlur={handleBlur}
									required
								/>
							</td>
						</tr>
						<tr>
							<td>Expiry Month</td>
							<td>
								<input
									type='text'
									name='monthExpiry'
									value={ccData.monthExpiry}
									onChange={handleChange}
									onFocus={handleFocus}
									onBlur={handleBlur}
									required
								/>
							</td>
						</tr>
						<tr>
							<td>Expiry Year</td>
							<td>
								<input
									type='text'
									name='yearExpiry'
									value={ccData.yearExpiry}
									onChange={handleChange}
									onFocus={handleFocus}
									onBlur={handleBlur}
									required
								/>
							</td>
						</tr>
						<tr>
							<td>CVV</td>
							<td>
								<input
									type='number'
									name='cvc'
									defaultChecked={0}
									value={ccData.cvc}
									onChange={handleChange}
									onFocus={handleFocus}
									onBlur={handleBlur}
									required
								/>
							</td>
						</tr>
						<tr>
							<td>Billing Zip Code</td>
							<td>
								<input type='text' name='billingZip' value={ccData.billingZip} onChange={handleChange} required />
							</td>
						</tr>
						<tr>
							<td span={2}>
								<button type='submit'>Submit</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</>
	);
};

export default CreditCardForm;
