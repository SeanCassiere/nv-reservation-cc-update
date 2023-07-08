import axios from "axios";
import { ServerSupportedClientEnvironments } from "./requestHelpers";

type LoggerAuthType = {
  loggerUri: string;
  loggerServiceId: string;
};

type LoggerOptions = {
  ip?: string;
  lookupFilterValue?: string;
  environment: ServerSupportedClientEnvironments;
  data?: object | any[];
};

export async function logAction({ loggerUri, loggerServiceId }: LoggerAuthType, action: string, opts: LoggerOptions) {
  const body = {
    action,
    environment: opts.environment,
    ip: opts.ip,
    lookupFilterValue: opts.lookupFilterValue,
    data: opts.data,
  };

  return await axios
    .post(`${loggerUri}/api/service/${loggerServiceId}/log`, body)
    .then((res) => {
      return { success: true, data: res.data };
    })
    .catch((err) => {
      return { success: false, data: err };
    });
}
