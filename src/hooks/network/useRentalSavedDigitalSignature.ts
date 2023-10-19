import { useQuery } from "@tanstack/react-query";

import { reloadSavedDigitalSignatureBase64Url } from "@/api/digitalSignatureApi";

export const useRentalSavedDigitalSignature = (
  opts: {
    referenceType: string;
    referenceId: string;
    isCheckIn: boolean;
  },
  extra: { enabled: boolean },
) => {
  const enabled = extra.enabled;
  return useQuery({
    queryKey: ["rental", "digital-signature"],
    queryFn: () => reloadSavedDigitalSignatureBase64Url(opts),
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled,
  });
};
