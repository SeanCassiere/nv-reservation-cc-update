import axios from "axios";

type LoggerAuthType = {
  loggerUri: string;
  loggerServiceId: string;
};

type LoggerOptions = {
  ip?: string;
  environment: string;
  data?: Object | any[];
};

export async function logAction({ loggerUri, loggerServiceId }: LoggerAuthType, action: string, opts: LoggerOptions) {
  const body = {
    serviceId: loggerServiceId,
    action,
    environment: opts.environment,
    ip: opts.ip,
    data: opts.data,
  };

  return await axios
    .post(loggerUri + "/api/logs", body)
    .then((res) => {
      return { success: true, data: res.data };
    })
    .catch((err) => {
      return { success: false, data: err };
    });
}
