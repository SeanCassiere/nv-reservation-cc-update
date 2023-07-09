import { z } from "zod";

import { clientFetch } from "./clientV3";

const numberNullable = z.number().nullable();
const booleanNullable = z.boolean().nullable();

const summaryChargesSchema = z.object({
  baseRate: numberNullable,
  promotionDiscount: numberNullable,
  finalBaseRate: numberNullable,
  totalMiscChargesTaxable: numberNullable,
  totalMiscChargesNonTaxable: numberNullable,
  extraMilesCharge: numberNullable,
  isExtraMileageChargeTaxable: booleanNullable,
  extraDayCharge: numberNullable,
  isExtraDayChargeTaxable: booleanNullable,
  extraFuelCharge: numberNullable,
  isFuelChargeTaxable: booleanNullable,
  preAdjustment: numberNullable,
  preSubTotal: numberNullable,
  promotionDiscountOnSubTotal: numberNullable,
  subTotal: numberNullable,
  totalTax: numberNullable,
  additionalCharge: numberNullable,
  estimateTotalwithDeposit: numberNullable,
  postAdjustment: numberNullable,
  total: numberNullable,
  balanceDue: numberNullable,
  amountPaid: numberNullable,
  securityDeposit: numberNullable,
});
export type SummaryCharges = z.infer<typeof summaryChargesSchema>;

type GetSummaryProps = {
  clientId: string | number;
  referenceType: "Agreement" | "Reservation";
  referenceId: string | number;
};

export async function fetchRentalSummary(opts: GetSummaryProps) {
  const params = new URLSearchParams();
  params.append("clientId", `${opts.clientId}`);
  const pathType = opts.referenceType === "Agreement" ? "agreements" : "reservations";
  return clientFetch(`/api/v3/${pathType}/${opts.referenceId}/Summary?${params.toString()}`)
    .then((r) => r.json())
    .then((data) => summaryChargesSchema.parse(data));
}
