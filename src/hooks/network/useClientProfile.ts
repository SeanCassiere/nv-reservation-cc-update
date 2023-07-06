import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { FetchClientProfile, fetchClientProfile } from "@/api/clientApi";

export const useClientProfileQuery = (
  { clientId }: { clientId: string | number },
  queryOpts?: UseQueryOptions<FetchClientProfile>
) => {
  return useQuery({
    queryKey: ["client", "profile"],
    queryFn: async () => fetchClientProfile({ clientId }),
    ...queryOpts,
  });
};
