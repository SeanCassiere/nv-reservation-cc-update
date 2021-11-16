export function creditCardTypeFormat(value: string): string {
	if (value.toLowerCase() === "amex") {
		return "American_Express";
	}
	if (value.toLowerCase() === "visa") {
		return "Visa";
	}
	if (value.toLowerCase() === "mastercard") {
		return "Master";
	}
	if (value.toLowerCase() === "discover") {
		return "Discover";
	}

	return "Credit_Card";
}
