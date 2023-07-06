import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { fetchRentalSummary, type SummaryCharges } from "@/api/summaryApi";

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
  queryOpts?: UseQueryOptions<SummaryCharges>
) => {
  return useQuery({
    queryKey: ["rental", "summary-of-charges"],
    queryFn: async () =>
      fetchRentalSummary({
        clientId: clientId,
        referenceId: referenceId,
        referenceType: referenceType.trim().toLowerCase() === "agreement" ? "Agreement" : "Reservation",
      }),
    ...queryOpts,
  });
};
