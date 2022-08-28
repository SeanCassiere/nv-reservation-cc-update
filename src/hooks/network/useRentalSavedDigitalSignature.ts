import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { reloadSavedDigitalSignatureBase64Url } from "../../api/digitalSignatureApi";

export const useRentalSavedDigitalSignature = <T = Awaited<ReturnType<typeof reloadSavedDigitalSignatureBase64Url>>>(
  opts: { referenceType: string; referenceId: string },
  queryOpts?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "initialData">
) => {
  return useQuery<T>(
    ["rental", "digital-signature"],
    async () => (await reloadSavedDigitalSignatureBase64Url(opts)) as unknown as T,
    queryOpts
  );
};
