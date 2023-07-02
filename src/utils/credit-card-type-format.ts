import Payment from "payment";

export function creditCardTypeFormat(cardNumber: string) {
  const defaultType = "Credit_Card";
  const type = Payment.fns.cardType(clearNumber(cardNumber.trim()));

  if (!type) return defaultType;

  switch (type.toLowerCase()) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Master";
    case "amex":
      return "American_Express";
    default:
      return defaultType;
  }
}

export function validateCardNumber(value: string) {
  return Payment.fns.validateCardNumber(clearNumber(value.trim()));
}

function clearNumber(value = "") {
  const item = value;
  const result = item.replace(/\D+/g, "");
  return result;
}

export function formatCreditCardNumber(value: string) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue =
        clearValue.slice(0, 4) +
        " " +
        clearValue.slice(4, 8) +
        " " +
        clearValue.slice(8, 12) +
        " " +
        clearValue.slice(12, 19);
      break;
  }
  return nextValue.trim();
}

export function getFormattedExpirationDate(value: string) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    const month = clearValue.slice(0, 2).trim();
    const year = clearValue.slice(2, 4).trim();
    return { monthExpiry: month, yearExpiry: year, monthYearExpiry: `${month}/${year}`.trim() };
  }

  return { monthExpiry: clearValue.slice(0, 2).trim(), yearExpiry: "", monthYearExpiry: clearValue.trim() };
}
