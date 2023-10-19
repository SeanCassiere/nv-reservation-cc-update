import { useQuery } from "@tanstack/react-query";

import { fetchRentalSummary } from "@/api/summaryApi";

export const useRentalSummaryQuery = ({
  clientId,
  referenceId,
  referenceType,
}: {
  clientId: string | number;
  referenceId: string | number;
  referenceType: string;
}) => {
  return useQuery({
    queryKey: ["rental", "summary-of-charges"],
    queryFn: () =>
      fetchRentalSummary({
        clientId: clientId,
        referenceId: referenceId,
        referenceType: referenceType.trim().toLowerCase() === "agreement" ? "Agreement" : "Reservation",
      }),
  });
};
