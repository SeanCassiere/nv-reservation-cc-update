import { useQuery } from "@tanstack/react-query";

import { fetchClientProfile } from "@/api/clientApi";

export const useClientProfileQuery = ({ clientId }: { clientId: string | number }) => {
  return useQuery({
    queryKey: ["client", "profile"],
    queryFn: () => fetchClientProfile({ clientId }),
  });
};
