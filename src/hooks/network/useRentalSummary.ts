import { useQuery, QueryOptions } from "@tanstack/react-query";
import { fetchRentalSummary, SummaryCharges } from "../../api/summaryApi";

export const useRentalSummaryQuery = (
  {
    clientId,
    referenceId,
    referenceType,
  }: {
    clientId: string | number;
    referenceId: string | number;
    referenceType: string;
  },
  queryOpts?: QueryOptions<SummaryCharges>
) => {
  return useQuery(
    ["rental", "summary-of-charges"],
    () =>
      fetchRentalSummary({
        clientId: clientId,
        referenceId: referenceId,
        referenceType: referenceType.trim().toLowerCase() === "agreement" ? "Agreement" : "Reservation",
      }),
    queryOpts
  );
};
