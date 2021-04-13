import React from "react";

const CreditCardForm = ({ ccData, handleChange, handleSubmit }) => {
	return (
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
							<input type='number' name='cardNumber' value={ccData.cardNumber} onChange={handleChange} required />
						</td>
					</tr>
					<tr>
						<td>Name on Card</td>
						<td>
							<input type='text' name='nameOnCard' value={ccData.nameOnCard} onChange={handleChange} required />
						</td>
					</tr>
					<tr>
						<td>Expiry Month</td>
						<td>
							<input
								type='number'
								name='monthExpiry'
								value={ccData.monthExpiry}
								onChange={handleChange}
								min={1}
								max={12}
								required
							/>
						</td>
					</tr>
					<tr>
						<td>Expiry Year</td>
						<td>
							<input
								type='number'
								name='yearExpiry'
								value={ccData.yearExpiry}
								onChange={handleChange}
								min={21}
								max={99}
								required
							/>
						</td>
					</tr>
					<tr>
						<td>CVV</td>
						<td>
							<input type='number' name='cvv' value={ccData.cvv} onChange={handleChange} min={0} max={9999} required />
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
	);
};

export default CreditCardForm;
